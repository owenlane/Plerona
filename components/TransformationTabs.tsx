'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TRANSFORMATIONS } from '@/lib/content';

export default function TransformationTabs() {
  const [active, setActive] = useState(0);
  const [showAfter, setShowAfter] = useState(true);
  const t = TRANSFORMATIONS[active];

  return (
    <div>
      {/* Tab selector */}
      <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 pb-2">
        {TRANSFORMATIONS.map((item, i) => (
          <button
            key={item.industry}
            type="button"
            onClick={() => setActive(i)}
            className={`flex-shrink-0 rounded-[2px] border px-4 py-2 text-sm font-medium transition-colors ${
              active === i
                ? 'border-blue bg-blue text-space'
                : 'border-rule bg-surface text-graymid hover:text-snow'
            }`}
          >
            {item.industry}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Transformation flow */}
        <AnimatePresence mode="wait">
          <motion.ol
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            <Flow n="Problem" body={t.problem} />
            <Flow n="Connection deployed" body={t.connection} />
            <Flow n="Automation triggered" body={t.automation} />
            <Flow n="Business outcome" body={t.outcome} accent />
          </motion.ol>
        </AnimatePresence>

        {/* Before / after toggle */}
        <div className="rounded-[2px] border border-rule bg-offwhite p-6">
          <div className="mb-5 inline-flex rounded-[2px] border border-rule bg-surface p-1">
            <button
              type="button"
              onClick={() => setShowAfter(false)}
              className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                !showAfter ? 'bg-ink text-white' : 'text-graymid'
              }`}
            >
              Before
            </button>
            <button
              type="button"
              onClick={() => setShowAfter(true)}
              className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                showAfter ? 'bg-blue text-space' : 'text-graymid'
              }`}
            >
              After
            </button>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${active}-${showAfter}`}
              initial={{ opacity: 0, x: showAfter ? 12 : -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-eyebrow font-semibold uppercase tracking-eyebrow text-graymid">
                {showAfter ? 'With Plerona' : 'Operating today'}
              </p>
              <p className="mt-3 text-lg font-medium leading-snug tracking-tight">
                {showAfter ? t.afterState : t.beforeState}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Flow({ n, body, accent }: { n: string; body: string; accent?: boolean }) {
  return (
    <li className="border-l-[3px] border-rule pl-5">
      <p
        className={`text-eyebrow font-semibold uppercase tracking-eyebrow ${
          accent ? 'text-blue' : 'text-graymid'
        }`}
      >
        {n}
      </p>
      <p className="mt-1.5 text-sm leading-[1.6] text-snow">{body}</p>
    </li>
  );
}
