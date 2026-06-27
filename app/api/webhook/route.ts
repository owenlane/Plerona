import { NextResponse, type NextRequest } from 'next/server';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { buildOrderFromSession, recordOrder } from '@/lib/orders';
import { sendBuyerConfirmation, sendInternalNotification } from '@/lib/email';

// Webhook must run on the Node runtime and read the raw request body so the
// Stripe signature can be verified.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    // Not configured yet — acknowledge so Stripe doesn't retry against preview.
    return NextResponse.json({ received: true, configured: false });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const order = buildOrderFromSession(session);

      // ── Fulfillment — three independent, best-effort steps ──
      // (1) Record the order (CRM entry). This also gives us idempotency:
      //     a duplicate Stripe event hits the unique constraint and returns
      //     isNew=false, so we don't send the confirmation emails twice.
      let isNew = true;
      try {
        const result = await recordOrder(order);
        isNew = result.isNew;
      } catch (err) {
        console.error('recordOrder failed:', err);
      }

      if (isNew) {
        // (2) Buyer confirmation + (3) internal notification. Run together;
        //     one failing must not block the other, and neither should throw
        //     out of the webhook (that would trigger needless Stripe retries).
        const results = await Promise.allSettled([
          sendBuyerConfirmation(order),
          sendInternalNotification(order),
        ]);
        results.forEach((r, i) => {
          if (r.status === 'rejected') {
            console.error(
              `${i === 0 ? 'Buyer confirmation' : 'Internal notification'} email failed:`,
              r.reason,
            );
          }
        });
      }

      console.info('Checkout completed:', {
        id: order.sessionId,
        email: order.email,
        offer: order.offer,
        amountTotal: order.amountTotal,
        hosting: order.hosting,
        isNew,
      });
      break;
    }
    default:
      // Other event types are acknowledged but not acted on.
      break;
  }

  return NextResponse.json({ received: true });
}
