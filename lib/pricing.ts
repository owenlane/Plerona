/**
 * PLERONA BUSINESS MODEL — IMMUTABLE (Website Structure V2 §02)
 *
 * This file is the single source of truth for every price, offer, deliverable,
 * and hosting tier on the entire site. No price may be hardcoded in any
 * component. If the business model ever changes, it changes here and only here.
 *
 * RULES ENFORCED BY STRUCTURE:
 *  - Only two core offers: Intermediary Consult and Plerona Implementation.
 *  - Additional Connections and Hosting are customization options, never
 *    standalone products.
 *  - Hosting exists only AFTER implementation. It is surfaced exclusively
 *    inside / after the implementation configuration flow.
 */

export const MONEY = (n: number): string =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// ── Core Offer 01 — Intermediary Consult ────────────────────────────────────
export const CONSULT = {
  name: 'Intermediary Consult',
  price: 798.95,
  delivery: '1 Business Day',
  ctaLabel: 'Book Roadmap',
  deliverables: [
    {
      title: 'Strategic Analysis',
      description:
        'A direct read on where your operation stands and where AI infrastructure creates the most leverage.',
    },
    {
      title: 'Operational Audit',
      description:
        'A structured map of the tools, handoffs, and manual work your business runs on today.',
    },
    {
      title: 'Infrastructure Roadmap',
      description:
        'The specific sequence of connections, automations, and systems your business should build, in priority order.',
    },
    {
      title: 'Implementation Strategy',
      description:
        'A concrete plan for what implementation would look like for your business — scope, order, and expected outcome.',
    },
  ],
} as const;

// ── Core Offer 02 — Plerona Implementation ──────────────────────────────────
export const IMPLEMENTATION = {
  name: 'Plerona Implementation',
  basePrice: 3027.95,
  baseConnections: 3,
  delivery: '2–5 Business Days',
  ctaLabel: 'Start Implementation',
  deliverables: [
    { title: 'Analysis', description: 'A precise read of your operation and where connection unlocks capability.' },
    { title: 'Infrastructure Mapping', description: 'The architecture of how your tools, data, and workflows connect.' },
    { title: 'ROI Prioritization', description: 'The order of operations — highest-leverage connections built first.' },
    { title: 'Three AI Connections', description: 'Three operational systems connected to AI in your base package.' },
    { title: 'Prompt Libraries', description: 'Reusable, documented prompts built for your specific business context — your property.' },
    { title: 'Agent Teams', description: 'Configured agents that handle defined tasks autonomously inside your infrastructure.' },
    { title: 'Documentation', description: 'Complete documentation so your team can operate and extend the system without us.' },
    { title: 'Guided Implementation Session', description: 'A working session that transfers operation of the system to your team.' },
    { title: 'System Handoff', description: 'Full ownership transfer. The infrastructure is yours — no dependency.' },
  ],
} as const;

// ── Add-On — Additional Connections ─────────────────────────────────────────
export const ADDITIONAL_CONNECTION = {
  pricePerConnection: 498.95,
  label: 'Each additional connection',
  availability: 'Unlimited',
} as const;

// ── Optional Hosting (post-implementation only) ─────────────────────────────
export type HostingId = 'ai-care' | 'ai-systems' | 'ai-account';

export interface HostingTier {
  id: HostingId;
  name: string;
  pricePerMonth: number;
  description: string;
}

export const HOSTING_TIERS: HostingTier[] = [
  {
    id: 'ai-care',
    name: 'AI Care',
    pricePerMonth: 298.95,
    description: 'Ongoing monitoring and light maintenance to keep your infrastructure healthy.',
  },
  {
    id: 'ai-systems',
    name: 'AI Systems',
    pricePerMonth: 998.95,
    description: 'Active management, refinement, and expansion of your connected systems.',
  },
  {
    id: 'ai-account',
    name: 'AI Account',
    pricePerMonth: 2498.95,
    description: 'A dedicated operating partner managing and evolving your full infrastructure.',
  },
];

export const HOSTING_NOTE = 'Optional. Available after implementation is complete.';

// ── Process steps (shared, homepage + implementation) ───────────────────────
export const PROCESS_STEPS = [
  { n: '01', name: 'Understand', what: 'We learn how your business actually operates — not how it is supposed to.', client: 'A shared, accurate picture of your operation.', time: 'Day 1' },
  { n: '02', name: 'Map', what: 'We design the infrastructure: which systems connect, in what order, and why.', client: 'Your infrastructure map and ROI-prioritized build order.', time: 'Day 1–2' },
  { n: '03', name: 'Implement', what: 'We build the connections, prompt libraries, and agent teams into a single system.', client: 'A working, connected AI infrastructure.', time: 'Day 2–4' },
  { n: '04', name: 'Teach', what: 'We run a guided session so your team can operate and extend the system.', client: 'Documentation and a team that can run it.', time: 'Day 4–5' },
  { n: '05', name: 'Operate Independently', what: 'We hand off full ownership. The system is yours to run without us.', client: 'Complete system handoff and ownership.', time: 'Day 5' },
] as const;

// ── Pricing engine ──────────────────────────────────────────────────────────
export interface ImplementationConfig {
  additionalConnections: number; // >= 0
  hosting: HostingId | null;
}

export interface PriceBreakdown {
  base: number;
  additionalConnections: number;
  additionalConnectionsTotal: number;
  todayTotal: number; // one-time
  monthlyTotal: number; // 0 if no hosting
  hostingTier: HostingTier | null;
  totalConnections: number;
}

export function computePrice(config: ImplementationConfig): PriceBreakdown {
  const additional = Math.max(0, Math.floor(config.additionalConnections));
  const additionalConnectionsTotal = additional * ADDITIONAL_CONNECTION.pricePerConnection;
  const hostingTier = config.hosting
    ? HOSTING_TIERS.find((t) => t.id === config.hosting) ?? null
    : null;

  return {
    base: IMPLEMENTATION.basePrice,
    additionalConnections: additional,
    additionalConnectionsTotal,
    todayTotal: IMPLEMENTATION.basePrice + additionalConnectionsTotal,
    monthlyTotal: hostingTier ? hostingTier.pricePerMonth : 0,
    hostingTier,
    totalConnections: IMPLEMENTATION.baseConnections + additional,
  };
}

/** Estimated delivery window from an order date. Estimate, never a guarantee. */
export function estimatedDelivery(from: Date = new Date()): { start: string; end: string } {
  const addBusinessDays = (date: Date, days: number): Date => {
    const d = new Date(date);
    let added = 0;
    while (added < days) {
      d.setDate(d.getDate() + 1);
      const day = d.getDay();
      if (day !== 0 && day !== 6) added += 1;
    }
    return d;
  };
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  return { start: fmt(addBusinessDays(from, 2)), end: fmt(addBusinessDays(from, 5)) };
}
