'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CONSULT, IMPLEMENTATION, MONEY } from '@/lib/pricing';
import { useImplementationConfig } from '@/lib/useImplementationConfig';
import { fadeUp, viewportOnce } from '@/lib/motion';
import ConnectionStepper from './ConnectionStepper';
import HostingSelector from './HostingSelector';

export default function OfferSection() {
  const cfg = useImplementationConfig();

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr]"
    >
      {/* Consult — entry option */}
      <div className="flex flex-col rounded-[2px] border border-rule bg-surface p-8">
        <p className="eyebrow tracking-eyebrow">Entry</p>
        <h3 className="mt-4 text-xl font-bold tracking-tight">{CONSULT.name}</h3>
        <p className="mt-3 text-3xl font-bold tracking-tight">{MONEY(CONSULT.price)}</p>
        <p className="mt-1 text-sm text-graymid">{CONSULT.delivery}</p>
        <ul className="mt-6 flex-1 space-y-2.5 text-sm text-graymid">
          {CONSULT.deliverables.map((d) => (
            <li key={d.title} className="flex gap-2">
              <span className="text-blue">—</span>
              {d.title}
            </li>
          ))}
        </ul>
        <Link
          href="/consult"
          className="mt-8 block rounded-[2px] border border-snow/20 px-6 py-3.5 text-center text-sm font-semibold transition-colors hover:bg-snow/[0.06]"
        >
          {CONSULT.ctaLabel}
        </Link>
      </div>

      {/* Implementation — flagship with inline config */}
      <div className="flex flex-col rounded-[2px] border-2 border-blue bg-surface p-8">
        <div className="flex items-center justify-between">
          <p className="eyebrow tracking-eyebrow">Flagship</p>
          <span className="rounded-[2px] bg-blue px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-space">
            Most chosen
          </span>
        </div>
        <h3 className="mt-4 text-xl font-bold tracking-tight">{IMPLEMENTATION.name}</h3>
        <p className="mt-3 text-3xl font-bold tracking-tight">
          {MONEY(cfg.animatedToday)}
          {cfg.config.additionalConnections === 0 && (
            <span className="ml-2 text-sm font-normal text-graymid">starting price</span>
          )}
        </p>
        <p className="mt-1 text-sm text-graymid">
          {IMPLEMENTATION.delivery} · {cfg.breakdown.totalConnections} connections
        </p>

        {/* Inline configuration */}
        <div className="mt-6 space-y-6 border-t border-rule pt-6">
          <ConnectionStepper
            value={cfg.config.additionalConnections}
            onAdd={cfg.addConnection}
            onRemove={cfg.removeConnection}
          />
          <HostingSelector selected={cfg.config.hosting} onSelect={cfg.setHosting} />
        </div>

        {/* Running total */}
        <div className="mt-6 flex items-end justify-between border-t border-rule pt-6">
          <div>
            <p className="text-xs text-graymid">Today&apos;s total</p>
            <p className="text-2xl font-bold tabular-nums">{MONEY(cfg.animatedToday)}</p>
            {cfg.breakdown.monthlyTotal > 0 && (
              <p className="text-xs text-graymid">
                + {MONEY(cfg.breakdown.monthlyTotal)}/mo after implementation
              </p>
            )}
          </div>
        </div>

        <Link
          href={`/checkout${cfg.queryString}`}
          className="mt-6 block rounded-[2px] bg-blue px-6 py-3.5 text-center text-sm font-semibold text-space transition-colors hover:bg-blue-hover"
        >
          {IMPLEMENTATION.ctaLabel}
        </Link>
      </div>
    </motion.div>
  );
}
