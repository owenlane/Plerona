import { NextResponse, type NextRequest } from 'next/server';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import {
  CONSULT,
  IMPLEMENTATION,
  ADDITIONAL_CONNECTION,
  HOSTING_TIERS,
  type HostingId,
} from '@/lib/pricing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_HOSTING: HostingId[] = ['ai-care', 'ai-systems', 'ai-account'];
const MAX_CONNECTIONS = 50; // sane upper bound; model is "unlimited" but abuse-guarded

const toCents = (dollars: number): number => Math.round(dollars * 100);

interface CheckoutBody {
  offer?: string;
  additionalConnections?: number;
  hosting?: string | null;
  contact?: { name?: string; business?: string; email?: string; phone?: string };
}

export async function POST(req: NextRequest) {
  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const isConsult = body.offer === 'consult';
  const offer = isConsult ? 'consult' : 'implementation';

  // ── Validate, never trust client values ──
  const additionalConnections = isConsult
    ? 0
    : Math.min(MAX_CONNECTIONS, Math.max(0, Math.floor(Number(body.additionalConnections) || 0)));

  const hosting: HostingId | null =
    !isConsult && body.hosting && VALID_HOSTING.includes(body.hosting as HostingId)
      ? (body.hosting as HostingId)
      : null;

  const contact = {
    name: String(body.contact?.name ?? '').slice(0, 200),
    business: String(body.contact?.business ?? '').slice(0, 200),
    email: String(body.contact?.email ?? '').slice(0, 200),
    phone: String(body.contact?.phone ?? '').slice(0, 100),
  };

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email);
  if (!contact.name || !contact.business || !emailOk || !contact.phone) {
    return NextResponse.json({ error: 'Missing or invalid contact details.' }, { status: 400 });
  }

  // ── Build line items from the single source of truth ──
  const lineItems: {
    quantity: number;
    price_data: {
      currency: 'usd';
      unit_amount: number;
      product_data: { name: string; description?: string };
    };
  }[] = [];

  if (isConsult) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: toCents(CONSULT.price),
        product_data: {
          name: CONSULT.name,
          description: `Documented roadmap. Delivery: ${CONSULT.delivery}.`,
        },
      },
    });
  } else {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: toCents(IMPLEMENTATION.basePrice),
        product_data: {
          name: IMPLEMENTATION.name,
          description: `Base: ${IMPLEMENTATION.baseConnections} connections + all deliverables.`,
        },
      },
    });
    if (additionalConnections > 0) {
      lineItems.push({
        quantity: additionalConnections,
        price_data: {
          currency: 'usd',
          unit_amount: toCents(ADDITIONAL_CONNECTION.pricePerConnection),
          product_data: {
            name: 'Additional AI connection',
            description: 'One additional operational system connected to AI.',
          },
        },
      });
    }
  }

  // Hosting is monthly and begins AFTER implementation — it is NOT charged at
  // checkout. It is recorded as intent so fulfillment can set up the
  // subscription at handoff.
  const hostingTier = hosting ? HOSTING_TIERS.find((t) => t.id === hosting) ?? null : null;

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || new URL(req.url).origin;

  const recap = new URLSearchParams({ offer });
  if (additionalConnections > 0) recap.set('connections', String(additionalConnections));
  if (hosting) recap.set('hosting', hosting);
  const recapQs = recap.toString();

  // ── Graceful preview/demo mode when Stripe isn't configured ──
  if (!isStripeConfigured()) {
    return NextResponse.json({ configured: false, recap: recapQs });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ configured: false, recap: recapQs });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: contact.email,
      success_url: `${origin}/thank-you?${recapQs}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?${recapQs}`,
      billing_address_collection: 'auto',
      metadata: {
        offer,
        additional_connections: String(additionalConnections),
        total_connections: String(
          isConsult ? 0 : IMPLEMENTATION.baseConnections + additionalConnections,
        ),
        hosting: hosting ?? 'none',
        hosting_monthly: hostingTier ? String(hostingTier.pricePerMonth) : '0',
        hosting_note: hostingTier ? 'Begins after implementation. Not charged at checkout.' : '',
        contact_name: contact.name,
        contact_business: contact.business,
        contact_phone: contact.phone,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err);
    return NextResponse.json(
      { error: 'Could not start checkout. Please try again.' },
      { status: 502 },
    );
  }
}
