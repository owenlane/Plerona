'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  IMPLEMENTATION,
  MONEY,
  estimatedDelivery,
  type PriceBreakdown,
} from '@/lib/pricing';

interface Props {
  breakdown: PriceBreakdown;
  animatedToday: number;
  ctaLabel: string;
  ctaHref?: string;
  onCta?: () => void;
  /** Render as the static desktop sidebar (false) or mobile bottom bar (true). */
}

function SummaryLines({ breakdown, animatedToday }: Pick<Props, 'breakdown' | 'animatedToday'>) {
  const delivery = estimatedDelivery();
  return (
    <div className="space-y-4 text-sm">
      <div className="flex justify-between gap-4">
        <span className="text-graymid">Base implementation</span>
        <span className="font-medium tabular-nums">{MONEY(breakdown.base)}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-graymid">
          {breakdown.additionalConnections} additional{' '}
          {breakdown.additionalConnections === 1 ? 'connection' : 'connections'}
        </span>
        <span className="font-medium tabular-nums">
          {MONEY(breakdown.additionalConnectionsTotal)}
        </span>
      </div>
      {breakdown.hostingTier && (
        <div className="flex justify-between gap-4">
          <span className="text-graymid">{breakdown.hostingTier.name} (monthly)</span>
          <span className="font-medium tabular-nums">
            {MONEY(breakdown.hostingTier.pricePerMonth)}/mo
          </span>
        </div>
      )}

      <div className="border-t border-rule pt-4">
        <div className="flex items-end justify-between gap-4">
          <span className="text-sm font-semibold">Today&apos;s Total</span>
          <span className="text-2xl font-bold tabular-nums">{MONEY(animatedToday)}</span>
        </div>
        {breakdown.monthlyTotal > 0 && (
          <p className="mt-1 text-right text-xs text-graymid">
            Then {MONEY(breakdown.monthlyTotal)}/mo · begins after implementation
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
        {IMPLEMENTATION.delivery} from purchase date. Estimate, not a guarantee.
      </p>
    </div>
  );
}

export default function OrderSummary({
  breakdown,
  animatedToday,
  ctaLabel,
  ctaHref,
  onCta,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const Cta =
    ctaHref != null ? (
      <Link
        href={ctaHref}
        className="block w-full rounded-[2px] bg-blue px-6 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-hover"
      >
        {ctaLabel}
      </Link>
    ) : (
      <button
        type="button"
        onClick={onCta}
        className="block w-full rounded-[2px] bg-blue px-6 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-hover"
      >
        {ctaLabel}
      </button>
    );

  return (
    <>
      {/* Desktop sticky sidebar */}
      <aside className="sticky top-24 hidden rounded-[2px] border border-rule bg-offwhite p-6 lg:block">
        <p className="eyebrow tracking-eyebrow mb-5">Order Summary</p>
        <SummaryLines breakdown={breakdown} animatedToday={animatedToday} />
        <div className="mt-6">{Cta}</div>
      </aside>

      {/* Mobile bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-surface lg:hidden">
        {expanded && (
          <div className="max-h-[60vh] overflow-y-auto border-b border-rule p-6">
            <SummaryLines breakdown={breakdown} animatedToday={animatedToday} />
          </div>
        )}
        <div className="container-px flex items-center justify-between gap-4 py-3">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-left"
            aria-expanded={expanded}
          >
            <span className="block text-xs text-graymid">Today&apos;s Total</span>
            <span className="text-lg font-bold tabular-nums">{MONEY(animatedToday)}</span>
          </button>
          <div className="flex-1 max-w-[60%]">{Cta}</div>
        </div>
      </div>
    </>
  );
}
