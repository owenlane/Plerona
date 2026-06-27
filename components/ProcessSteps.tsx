'use client';

import { motion } from 'framer-motion';
import { PROCESS_STEPS } from '@/lib/pricing';
import { fadeUp, stagger, viewportOnce } from '@/lib/motion';

interface Props {
  surface?: 'light' | 'dark';
}

export default function ProcessSteps({ surface = 'dark' }: Props) {
  const dark = surface === 'dark';
  const title = dark ? 'text-white' : 'text-ink';
  const body = dark ? 'text-silver' : 'text-graymid';
  const border = dark ? 'border-white/10' : 'border-rule';

  return (
    <motion.ol
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="grid grid-cols-1 gap-px overflow-hidden md:grid-cols-5"
    >
      {PROCESS_STEPS.map((step) => (
        <motion.li
          key={step.n}
          variants={fadeUp}
          className={`border ${border} p-6 md:border-l-0 md:first:border-l`}
        >
          <div className="mb-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold tabular-nums text-blue">{step.n}</span>
          </div>
          <h3 className={`text-base font-semibold tracking-tight ${title}`}>{step.name}</h3>
          <p className={`mt-2 text-sm leading-[1.6] ${body}`}>{step.what}</p>
          <p className={`mt-4 text-xs ${dark ? 'text-graymid' : 'text-graymid'}`}>{step.client}</p>
          <p className="mt-3 text-eyebrow font-semibold uppercase tracking-eyebrow text-blue">
            {step.time}
          </p>
        </motion.li>
      ))}
    </motion.ol>
  );
}
