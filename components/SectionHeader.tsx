'use client';

import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '@/lib/motion';

interface SectionHeaderProps {
  eyebrow: string;
  /** Two-line setup-payoff headline. Pass an array of [setup, payoff]. */
  headline: [string, string] | string;
  subtitle?: string;
  surface?: 'light' | 'dark';
  align?: 'left' | 'center';
}

export default function SectionHeader({
  eyebrow,
  headline,
  subtitle,
  surface = 'light',
  align = 'left',
}: SectionHeaderProps) {
  const heading = Array.isArray(headline) ? headline : [headline];
  const sub = surface === 'dark' ? 'text-silver' : 'text-graymid';
  const head = surface === 'dark' ? 'text-white' : 'text-snow';
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={`max-w-2xl ${alignment}`}
    >
      <p className="eyebrow tracking-eyebrow mb-5">{eyebrow}</p>
      <h2 className={`text-3xl md:text-[2.5rem] font-bold leading-[1.08] tracking-tighter2 ${head}`}>
        {heading.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h2>
      {subtitle && <p className={`mt-6 text-base md:text-[1.0625rem] leading-[1.7] ${sub}`}>{subtitle}</p>}
    </motion.div>
  );
}
