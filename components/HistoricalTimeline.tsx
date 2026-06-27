'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TIMELINE } from '@/lib/content';
import { fadeUp, viewportOnce } from '@/lib/motion';

export default function HistoricalTimeline() {
  const activeIndex = TIMELINE.findIndex((m) => m.active);
  const [openMobile, setOpenMobile] = useState(activeIndex);

  return (
    <div>
      {/* Desktop: horizontal track */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="no-scrollbar hidden gap-5 overflow-x-auto pb-4 md:flex"
      >
        {TIMELINE.map((m, i) => (
          <article
            key={m.era}
            className={`relative w-72 flex-shrink-0 rounded-[2px] border p-6 ${
              m.active ? 'border-blue bg-blue/5' : 'border-white/10 bg-white/[0.02]'
            }`}
          >
            <div className="mb-4 flex items-center gap-3">
              <span
                className={`h-2.5 w-2.5 rounded-full ${m.active ? 'animate-pulse2 bg-blue' : 'bg-silver'}`}
              />
              <span className="text-xs font-semibold uppercase tracking-eyebrow text-graymid">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <h3 className={`text-lg font-bold ${m.active ? 'text-blue' : 'text-white'}`}>{m.era}</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <Row label="Context" value={m.context} />
              <Row label="Operational impact" value={m.impact} />
              <Row label="Productivity gain" value={m.gain} />
              <Row label="Implication" value={m.implication} />
            </dl>
          </article>
        ))}
      </motion.div>

      {/* Mobile: vertical accordion */}
      <div className="md:hidden">
        {TIMELINE.map((m, i) => {
          const open = openMobile === i;
          return (
            <div key={m.era} className="border-b border-white/10">
              <button
                type="button"
                onClick={() => setOpenMobile(open ? -1 : i)}
                className="flex w-full items-center justify-between py-5 text-left"
                aria-expanded={open}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${m.active ? 'bg-blue' : 'bg-silver'}`}
                  />
                  <span className={`text-base font-bold ${m.active ? 'text-blue' : 'text-white'}`}>
                    {m.era}
                  </span>
                </span>
                <span className={`text-silver transition-transform ${open ? 'rotate-90' : ''}`}>
                  ›
                </span>
              </button>
              {open && (
                <dl className="space-y-3 pb-6 text-sm">
                  <Row label="Context" value={m.context} />
                  <Row label="Operational impact" value={m.impact} />
                  <Row label="Productivity gain" value={m.gain} />
                  <Row label="Implication" value={m.implication} />
                </dl>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-eyebrow text-graymid">{label}</dt>
      <dd className="mt-0.5 text-silver">{value}</dd>
    </div>
  );
}
