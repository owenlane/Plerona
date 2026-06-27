'use client';

import { motion } from 'framer-motion';
import { fadeUp, stagger, viewportOnce } from '@/lib/motion';
import type { ProblemCard } from '@/lib/content';

interface Props {
  cards: ProblemCard[];
  columns?: 2 | 4;
}

export default function ProblemCards({ cards, columns = 4 }: Props) {
  const grid = columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4';
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={`grid grid-cols-1 gap-px overflow-hidden border border-rule bg-rule ${grid}`}
    >
      {cards.map((card) => (
        <motion.div key={card.title} variants={fadeUp} className="bg-surface p-7">
          <h3 className="text-lg font-semibold tracking-tight">{card.title}</h3>
          <p className="mt-3 text-sm leading-[1.7] text-graymid">{card.body}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
