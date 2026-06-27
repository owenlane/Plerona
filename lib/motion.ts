import type { Variants } from 'framer-motion';

/**
 * Animation system — Website Structure V2 §17.
 * GPU-only (transform/opacity). ease-out entrances. Reduced motion is handled
 * at the component level via useReducedMotion().
 */

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// A02 — Section Entrance: fade up
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

// A01 — Hero Entrance cascade container
export const cascade: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

// A03 — Card grid stagger container (60ms between children)
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export const viewportOnce = { once: true, amount: 0.3 } as const;
