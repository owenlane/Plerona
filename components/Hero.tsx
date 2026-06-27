'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { cascade, fadeUp } from '@/lib/motion';
import CTAButton from './CTAButton';

// 3D background is client-only and lazy-loaded; static fallback covers SSR/build.
const HeroBackground = dynamic(() => import('./HeroBackground'), {
  ssr: false,
  loading: () => null,
});

interface HeroCTA {
  label: string;
  href: string;
}

interface HeroProps {
  eyebrow?: string;
  headline: [string, string] | string;
  subtitle: string;
  primary: HeroCTA;
  secondary?: HeroCTA;
  stats?: string[];
  price?: string;
  /** Show the immersive node-graph background (homepage hero only by default). */
  immersive?: boolean;
}

export default function Hero({
  eyebrow,
  headline,
  subtitle,
  primary,
  secondary,
  stats,
  price,
  immersive = false,
}: HeroProps) {
  const heading = Array.isArray(headline) ? headline : [headline];

  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-ink pt-16 text-white">
      {immersive && <HeroBackground />}
      {!immersive && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(26,86,219,0.12),_transparent_60%)]" />
      )}

      <motion.div
        variants={cascade}
        initial="hidden"
        animate="show"
        className="container-px relative z-10 py-20"
      >
        {eyebrow && (
          <motion.p variants={fadeUp} className="eyebrow tracking-eyebrow mb-6">
            {eyebrow}
          </motion.p>
        )}

        <motion.h1
          variants={fadeUp}
          className="max-w-4xl text-4xl font-bold leading-[1.05] tracking-tighter2 sm:text-5xl md:text-6xl"
        >
          {heading.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-7 max-w-2xl text-base leading-[1.7] text-silver md:text-lg"
        >
          {subtitle}
        </motion.p>

        {price && (
          <motion.p variants={fadeUp} className="mt-6 text-2xl font-bold tracking-tight text-white">
            {price}
          </motion.p>
        )}

        <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <CTAButton href={primary.href} variant="primary">
            {primary.label}
          </CTAButton>
          {secondary && (
            <CTAButton href={secondary.href} variant="secondary" surface="dark">
              {secondary.label}
            </CTAButton>
          )}
        </motion.div>

        {stats && (
          <motion.ul
            variants={fadeUp}
            className="mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-4"
          >
            {stats.map((s) => (
              <li
                key={s}
                className="bg-ink px-5 py-6 text-center text-xs font-semibold uppercase tracking-wide text-silver sm:text-left"
              >
                {s}
              </li>
            ))}
          </motion.ul>
        )}
      </motion.div>
    </section>
  );
}
