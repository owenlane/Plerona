import type { Metadata } from 'next';
import Link from 'next/link';
import { getStripe } from '@/lib/stripe';
import ConfirmationView from '@/components/ConfirmationView';
import { type HostingId } from '@/lib/pricing';

// Must verify against Stripe at request time — never statically prerendered.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'Your payment has been confirmed.',
  robots: { index: false, follow: false },
};

const VALID_HOSTING: HostingId[] = ['ai-care', 'ai-systems', 'ai-account'];

/** Neutral state shown whenever payment cannot be verified. Never claims success. */
function NotConfirmed({ reason }: { reason: string }) {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-ink pt-16 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(232,198,112,0.12),_transparent_60%)]" />
      <div className="container-px relative z-10 py-24">
        <p className="eyebrow tracking-eyebrow mb-6">Payment Not Confirmed</p>
        <h1 className="max-w-2xl text-4xl font-bold leading-[1.06] tracking-tighter2 sm:text-5xl">
          We couldn&apos;t confirm a completed payment.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-[1.7] text-silver">{reason}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center rounded-[2px] bg-blue px-8 py-3.5 text-sm font-semibold text-space transition-colors hover:bg-blue-hover"
          >
            Return to checkout
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-[2px] border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Back to home
          </Link>
        </div>
        <p className="mt-8 text-sm text-graymid">
          If you believe you were charged, contact{' '}
          <a href="mailto:contact@plerona.com" className="font-semibold text-blue hover:text-blue-hover">
            contact@plerona.com
          </a>{' '}
          and we&apos;ll sort it out immediately.
        </p>
      </div>
    </section>
  );
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const stripe = getStripe();

  if (!stripe) {
    return (
      <NotConfirmed reason="Payments are not currently configured on this site. No charge was made." />
    );
  }
  if (!sessionId) {
    return (
      <NotConfirmed reason="No checkout session was provided. Please start from the checkout page." />
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return (
        <NotConfirmed reason="This payment has not completed. If you cancelled, you can return to checkout to try again." />
      );
    }

    const m = session.metadata ?? {};
    const offer = m.offer === 'consult' ? 'consult' : 'implementation';
    const additionalConnections = Math.max(
      0,
      parseInt(m.additional_connections ?? '0', 10) || 0,
    );
    const hostingRaw = m.hosting;
    const hostingId =
      hostingRaw && VALID_HOSTING.includes(hostingRaw as HostingId)
        ? (hostingRaw as HostingId)
        : null;

    return (
      <ConfirmationView
        offer={offer}
        additionalConnections={additionalConnections}
        hostingId={hostingId}
      />
    );
  } catch {
    return (
      <NotConfirmed reason="We couldn't verify this checkout session. If you were charged, contact us and we'll confirm your order manually." />
    );
  }
}
