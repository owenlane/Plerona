'use client';

import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '@/lib/motion';
import CTAButton from './CTAButton';

interface Props {
  headline: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}

export default function FinalCTA({
  headline,
  primary = { label: 'Start Implementation', href: '/implementation' },
  secondary = { label: 'Book Roadmap', href: '/consult' },
}: Props) {
  return (
    <section className="bg-ink text-white">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="container-px section text-center"
      >
        <h2 className="mx-auto max-w-3xl text-3xl font-bold leading-[1.12] tracking-tighter2 md:text-[2.75rem]">
          {headline}
        </h2>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CTAButton href={primary.href} variant="primary">
            {primary.label}
          </CTAButton>
          <CTAButton href={secondary.href} variant="secondary" surface="dark">
            {secondary.label}
          </CTAButton>
        </div>
      </motion.div>
    </section>
  );
}
