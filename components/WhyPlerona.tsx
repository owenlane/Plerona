'use client';

import { motion } from 'framer-motion';
import { WHY_PILLARS } from '@/lib/content';
import { fadeUp, stagger, viewportOnce } from '@/lib/motion';

export default function WhyPlerona() {
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        <p className="eyebrow tracking-eyebrow mb-5">Why Plerona</p>
        <h2 className="text-3xl font-bold leading-[1.1] tracking-tighter2 text-white md:text-[2.5rem]">
          <span className="block">Tools create dependency.</span>
          <span className="block">Infrastructure creates ownership.</span>
        </h2>
        <p className="mt-6 max-w-md text-base leading-[1.7] text-silver">
          Plerona exists because most businesses are sold subscriptions when what they need is
          infrastructure. We build connected AI systems, document them completely, and hand them
          over. The goal is a business that does not need us to keep operating — because that is what
          ownership means.
        </p>
      </motion.div>

      <motion.ol
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="space-y-px self-center overflow-hidden border border-white/10"
      >
        {WHY_PILLARS.map((p) => (
          <motion.li key={p.n} variants={fadeUp} className="bg-white/[0.02] p-6">
            <div className="flex gap-5">
              <span className="text-xl font-bold tabular-nums text-blue">{p.n}</span>
              <div>
                <h3 className="text-base font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-[1.6] text-silver">{p.body}</p>
              </div>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  );
}
