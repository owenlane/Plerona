'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CONSULT,
  IMPLEMENTATION,
  estimatedDelivery,
  HOSTING_TIERS,
  type HostingId,
} from '@/lib/pricing';

const CONSULT_STEPS = [
  {
    n: '01',
    t: 'Intake outline arrives',
    d: 'Within minutes, you receive a short intake outline by email. It tells us how your operation runs today.',
  },
  {
    n: '02',
    t: 'You share the picture',
    d: 'Send back the outline with as much detail as you can. The clearer the input, the sharper the roadmap.',
  },
  {
    n: '03',
    t: 'We audit and map',
    d: 'We analyze your tools, workflows, and friction points, then prioritize the highest-leverage infrastructure.',
  },
  {
    n: '04',
    t: 'Your roadmap is delivered',
    d: `A documented roadmap arrives within ${CONSULT.delivery.toLowerCase()} of receiving your intake.`,
  },
];

const IMPL_STEPS = [
  {
    n: '01',
    t: 'Kickoff & understanding',
    d: 'We reach out to schedule kickoff and learn exactly how your business operates — not how it is supposed to.',
  },
  {
    n: '02',
    t: 'Infrastructure mapping',
    d: 'We design which systems connect, in what order, and why — prioritized by return on the work.',
  },
  {
    n: '03',
    t: 'We build your system',
    d: 'Connections, prompt libraries, and agent teams are built into a single working infrastructure.',
  },
  {
    n: '04',
    t: 'Guided session & handoff',
    d: 'We run a working session, deliver complete documentation, and transfer full ownership. The system is yours.',
  },
];

export default function ThankYouClient() {
  const params = useSearchParams();
  const isConsult = params.get('offer') === 'consult';

  const connections = Math.max(0, parseInt(params.get('connections') ?? '0', 10) || 0);
  const hostingId = params.get('hosting') as HostingId | null;
  const hostingTier = hostingId ? HOSTING_TIERS.find((t) => t.id === hostingId) ?? null : null;

  const delivery = estimatedDelivery();
  const steps = isConsult ? CONSULT_STEPS : IMPL_STEPS;
  const offerName = isConsult ? CONSULT.name : IMPLEMENTATION.name;

  return (
    <>
      {/* Confirmation hero */}
      <section className="relative flex min-h-[60vh] items-center overflow-hidden bg-ink pt-16 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(26,86,219,0.14),_transparent_60%)]" />
        <div className="container-px relative z-10 py-24">
          <div
            className="mb-8 flex h-12 w-12 items-center justify-center rounded-full border border-blue"
            aria-hidden
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="eyebrow tracking-eyebrow mb-6">Order Confirmed</p>
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.06] tracking-tighter2 sm:text-5xl">
            {isConsult ? 'Your Roadmap is reserved.' : 'Your implementation is underway.'}
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-[1.7] text-silver md:text-lg">
            You made a clear decision — the kind that compounds. A confirmation is on its way to
            your inbox, and the work begins now.
          </p>
        </div>
      </section>

      {/* Order recap */}
      <section className="container-px section">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px] lg:gap-16">
          <div>
            <p className="eyebrow tracking-eyebrow mb-6">What Happens Next</p>
            <h2 className="text-3xl font-bold tracking-tighter2 md:text-[2.25rem]">
              The path from here.
            </h2>
            <ol className="mt-10 space-y-px overflow-hidden border border-rule">
              {steps.map((s) => (
                <li key={s.n} className="bg-surface p-6">
                  <div className="flex gap-5">
                    <span className="text-xl font-bold tabular-nums text-blue">{s.n}</span>
                    <div>
                      <h3 className="text-base font-semibold">{s.t}</h3>
                      <p className="mt-1.5 text-sm leading-[1.6] text-graymid">{s.d}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Recap + contact */}
          <aside className="space-y-6">
            <div className="rounded-[2px] border border-rule bg-offwhite p-6">
              <p className="eyebrow tracking-eyebrow mb-5">Your Order</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-graymid">Package</span>
                  <span className="font-medium">{offerName}</span>
                </div>
                {!isConsult && (
                  <div className="flex justify-between gap-4">
                    <span className="text-graymid">Connections</span>
                    <span className="font-medium tabular-nums">
                      {IMPLEMENTATION.baseConnections + connections}
                    </span>
                  </div>
                )}
                {hostingTier && (
                  <div className="flex justify-between gap-4">
                    <span className="text-graymid">Hosting</span>
                    <span className="font-medium">{hostingTier.name}</span>
                  </div>
                )}
                <div className="flex justify-between gap-4 border-t border-rule pt-3">
                  <span className="text-graymid">Est. Delivery</span>
                  <span className="font-medium">
                    {delivery.start} – {delivery.end}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[2px] border border-rule bg-surface p-6">
              <p className="eyebrow tracking-eyebrow mb-4">A Direct Line</p>
              <p className="text-sm leading-[1.7] text-graymid">
                Questions before we reach out? You can always contact us directly.
              </p>
              <a
                href="mailto:contact@plerona.com"
                className="mt-4 inline-block text-sm font-semibold text-blue hover:text-blue-hover"
              >
                contact@plerona.com
              </a>
            </div>
          </aside>
        </div>

        {/* Reassurance — no upsell */}
        <div className="mt-16 rounded-[2px] border-l-[3px] border-blue bg-offwhite p-8">
          <p className="max-w-2xl text-lg leading-[1.7] text-ink">
            There is nothing else to buy right now. The next move is ours. Watch your inbox — we
            will be in touch shortly to begin.
          </p>
        </div>

        <div className="mt-12">
          <Link href="/" className="text-sm font-semibold text-blue hover:text-blue-hover">
            ← Back to home
          </Link>
        </div>
      </section>
    </>
  );
}
