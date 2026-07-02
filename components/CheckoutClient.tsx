'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CONSULT,
  IMPLEMENTATION,
  MONEY,
  estimatedDelivery,
  type HostingId,
} from '@/lib/pricing';
import { useImplementationConfig } from '@/lib/useImplementationConfig';
import ConnectionStepper from './ConnectionStepper';
import HostingSelector from './HostingSelector';

const VALID_HOSTING: HostingId[] = ['ai-care', 'ai-systems', 'ai-account'];

function Field({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required,
  autoComplete,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-snow">
        {label}
        {required && <span className="ml-1 text-blue">*</span>}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[2px] border border-rule bg-surface px-4 py-3 text-sm text-snow outline-none transition-colors placeholder:text-silver focus:border-blue"
      />
    </label>
  );
}

export default function CheckoutClient() {
  const params = useSearchParams();

  const isConsult = params.get('offer') === 'consult';

  // Seed implementation config from the URL (?connections=N&hosting=ID).
  const seedConnections = Math.max(0, parseInt(params.get('connections') ?? '0', 10) || 0);
  const seedHostingRaw = params.get('hosting');
  const seedHosting =
    seedHostingRaw && VALID_HOSTING.includes(seedHostingRaw as HostingId)
      ? (seedHostingRaw as HostingId)
      : null;

  const cfg = useImplementationConfig({
    additionalConnections: seedConnections,
    hosting: seedHosting,
  });

  const [contact, setContact] = useState({ name: '', business: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const delivery = estimatedDelivery();

  // Totals differ by mode.
  const todayTotal = isConsult ? CONSULT.price : cfg.breakdown.todayTotal;
  const monthlyTotal = isConsult ? 0 : cfg.breakdown.monthlyTotal;
  const offerName = isConsult ? CONSULT.name : IMPLEMENTATION.name;
  const deliveryWindow = isConsult ? CONSULT.delivery : IMPLEMENTATION.delivery;

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim());
  const canSubmit = Boolean(
    contact.name.trim() &&
      contact.business.trim() &&
      emailValid &&
      contact.phone.trim(),
  );

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offer: isConsult ? 'consult' : 'implementation',
          additionalConnections: isConsult ? 0 : cfg.config.additionalConnections,
          hosting: isConsult ? null : cfg.config.hosting,
          contact,
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };

      if (data.url) {
        // Redirect to Stripe's secure hosted checkout.
        window.location.href = data.url;
        return;
      }
      // No URL means no session was created — surface the error, never fake success.
      setError(data.error ?? 'Payments are temporarily unavailable. Please try again shortly.');
      setSubmitting(false);
    } catch {
      setError('Could not reach the payment service. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="container-px section pt-32">
      <div className="mb-12">
        <p className="eyebrow tracking-eyebrow mb-4">Checkout</p>
        <h1 className="text-3xl font-bold tracking-tighter2 md:text-[2.5rem]">
          {isConsult ? 'Book your Roadmap.' : 'Confirm your implementation.'}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-[1.7] text-graymid">
          No surprise pricing. What you see below is exactly what you pay — itemized, with nothing
          added at the end.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
        {/* ── Left: configuration + details ── */}
        <div className="space-y-10">
          {/* Configuration (implementation only) */}
          {!isConsult && (
            <section>
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-eyebrow text-graymid">
                Your Configuration
              </h2>
              <div className="space-y-4">
                <div className="rounded-[2px] border border-rule bg-surface p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold tracking-tight">{IMPLEMENTATION.name}</h3>
                      <p className="mt-1 text-sm text-graymid">
                        Base: {IMPLEMENTATION.baseConnections} connections + all deliverables.
                      </p>
                    </div>
                    <p className="text-lg font-bold tabular-nums">
                      {MONEY(IMPLEMENTATION.basePrice)}
                    </p>
                  </div>
                </div>
                <div className="rounded-[2px] border border-rule bg-surface p-6">
                  <ConnectionStepper
                    value={cfg.config.additionalConnections}
                    onAdd={cfg.addConnection}
                    onRemove={cfg.removeConnection}
                  />
                </div>
                <div className="rounded-[2px] border border-rule bg-surface p-6">
                  <HostingSelector selected={cfg.config.hosting} onSelect={cfg.setHosting} />
                </div>
              </div>
            </section>
          )}

          {/* Consult summary block (consult only) */}
          {isConsult && (
            <section className="rounded-[2px] border border-rule bg-surface p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold tracking-tight">{CONSULT.name}</h3>
                  <p className="mt-1 text-sm text-graymid">Delivery: {CONSULT.delivery}</p>
                  <ul className="mt-4 space-y-1.5 text-sm text-graymid">
                    {CONSULT.deliverables.map((d) => (
                      <li key={d.title} className="flex gap-2">
                        <span className="text-blue">—</span>
                        {d.title}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-lg font-bold tabular-nums">{MONEY(CONSULT.price)}</p>
              </div>
            </section>
          )}

          {/* Contact details */}
          <section>
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-eyebrow text-graymid">
              Your Details
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                label="Full name"
                value={contact.name}
                onChange={(v) => setContact((c) => ({ ...c, name: v }))}
                placeholder="Jordan Avery"
                autoComplete="name"
                required
              />
              <Field
                label="Business name"
                value={contact.business}
                onChange={(v) => setContact((c) => ({ ...c, business: v }))}
                placeholder="Avery & Co."
                autoComplete="organization"
                required
              />
              <Field
                label="Email"
                type="email"
                value={contact.email}
                onChange={(v) => setContact((c) => ({ ...c, email: v }))}
                placeholder="jordan@averyco.com"
                autoComplete="email"
                required
              />
              <Field
                label="Phone"
                type="tel"
                value={contact.phone}
                onChange={(v) => setContact((c) => ({ ...c, phone: v }))}
                placeholder="(555) 010-0199"
                autoComplete="tel"
                required
              />
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-eyebrow text-graymid">
              Payment
            </h2>
            <div className="flex items-start gap-4 rounded-[2px] border border-rule bg-surface p-6">
              <div
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] bg-ink"
                aria-hidden
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5F7FA" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-snow">Secure payment via Stripe</p>
                <p className="mt-1.5 text-sm leading-[1.6] text-graymid">
                  Continue to Stripe&apos;s encrypted checkout to enter your card. Plerona never sees
                  or stores your card details.
                </p>
              </div>
            </div>
            {error && (
              <p
                role="alert"
                className="mt-4 rounded-[2px] border border-blue/30 bg-blue-wash px-4 py-3 text-sm text-snow"
              >
                {error}
              </p>
            )}
          </section>
        </div>

        {/* ── Right: persistent order summary ── */}
        <aside>
          <div className="sticky top-24 rounded-[2px] border border-rule bg-offwhite p-6">
            <p className="eyebrow tracking-eyebrow mb-5">Order Summary</p>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-graymid">{offerName}</span>
                <span className="font-medium tabular-nums">
                  {MONEY(isConsult ? CONSULT.price : IMPLEMENTATION.basePrice)}
                </span>
              </div>

              {!isConsult && cfg.breakdown.additionalConnections > 0 && (
                <div className="flex justify-between gap-4">
                  <span className="text-graymid">
                    {cfg.breakdown.additionalConnections} additional{' '}
                    {cfg.breakdown.additionalConnections === 1 ? 'connection' : 'connections'}
                  </span>
                  <span className="font-medium tabular-nums">
                    {MONEY(cfg.breakdown.additionalConnectionsTotal)}
                  </span>
                </div>
              )}

              {!isConsult && cfg.breakdown.hostingTier && (
                <div className="flex justify-between gap-4">
                  <span className="text-graymid">
                    {cfg.breakdown.hostingTier.name} (monthly)
                  </span>
                  <span className="font-medium tabular-nums">
                    {MONEY(cfg.breakdown.hostingTier.pricePerMonth)}/mo
                  </span>
                </div>
              )}

              <div className="border-t border-rule pt-4">
                <div className="flex items-end justify-between gap-4">
                  <span className="text-sm font-semibold">Today&apos;s Total</span>
                  <span className="text-2xl font-bold tabular-nums">
                    {MONEY(isConsult ? CONSULT.price : cfg.animatedToday)}
                  </span>
                </div>
                {monthlyTotal > 0 && (
                  <p className="mt-1 text-right text-xs text-graymid">
                    Then {MONEY(monthlyTotal)}/mo · begins after implementation
                  </p>
                )}
              </div>

              <div className="flex justify-between gap-4 border-t border-rule pt-4 text-xs text-graymid">
                <span>Estimated Delivery</span>
                <span>
                  {delivery.start} – {delivery.end}
                </span>
              </div>
              <p className="text-[11px] text-graymid">
                {deliveryWindow} from purchase date. Estimate, not a guarantee.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className="mt-6 block w-full rounded-[2px] bg-blue px-6 py-3.5 text-center text-sm font-semibold text-space transition-colors hover:bg-blue-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? 'Redirecting…' : 'Continue to Payment'}
            </button>
            <p className="mt-3 text-center text-[11px] text-graymid">
              {MONEY(todayTotal)} today. No charges beyond what is shown.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
