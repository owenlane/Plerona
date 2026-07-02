/**
 * About / founder content — moved verbatim from app/about/page.tsx so the
 * Captain's Room (the Journey) and the /about route share a single source.
 * Content sanctity: Part I, Article 5.5 — every word preserved exactly.
 */

export const ABOUT_HERO = {
  eyebrow: 'Why Plerona Exists',
  titleLines: ['Small businesses deserve', 'infrastructure they own.'] as const,
  body: 'Plerona exists to put connected AI infrastructure — the kind that quietly runs an operation — into the hands of the businesses that were told it was out of reach. We build it for your business, and then we give it to you.',
} as const;

export const ABOUT_MISSION = {
  eyebrow: 'The Mission',
  headline: ['Remove the structural bottleneck', 'from small-business growth.'] as const,
  subtitle:
    'Most small businesses are not held back by a lack of effort or talent. They are held back by structure — by work that has to pass through a person because nothing connects the tools they already pay for. Our mission is to dissolve that bottleneck and leave the business stronger and self-sufficient.',
} as const;

export const FOUNDER = {
  name: 'Owen Donaldo Lane Campos',
  role: 'Founder, Plerona LLC',
} as const;

export const FOUNDER_JOURNEY = {
  eyebrow: 'The Founder Journey',
  headlineLines: ['Years of building inside the', 'businesses this is for.'] as const,
} as const;

export const BUILDING_YEARS = [
  {
    phase: 'The pattern',
    body: 'Across the businesses we worked inside, the same shape kept appearing: capable operators spending their best hours on work that a connected system could absorb. The bottleneck was never effort. It was structure.',
  },
  {
    phase: 'The discovery',
    body: 'AI was being sold as a feature — a chatbot here, a generator there. The leverage was somewhere else entirely: in connecting the tools, data, and workflows a business already had into a single operating layer that worked while no one watched.',
  },
  {
    phase: 'The decision',
    body: 'So we stopped treating AI as a product to demonstrate and started treating it as infrastructure to install — mapped to a specific operation, prioritized by return, and handed off as something the business owns outright.',
  },
] as const;

export const PHILOSOPHY_HEADER = {
  eyebrow: 'Infrastructure Philosophy',
  headline: ['Three convictions that', 'shape everything we build.'] as const,
} as const;

export const PHILOSOPHY = [
  {
    n: '01',
    title: 'Infrastructure, not tools',
    body: 'A tool is something you buy. Infrastructure is something your business runs on. Most AI offerings sell tools and leave the integration — the hard part — to you. We build the integration and treat it as the product.',
  },
  {
    n: '02',
    title: 'Ownership, not dependency',
    body: 'The system we build is yours. The prompt libraries are your property. The documentation is written so your team can operate and extend the infrastructure without us. We are not trying to become a line item you can never remove.',
  },
  {
    n: '03',
    title: 'Restraint, not spectacle',
    body: 'The goal is not the most impressive demo. It is the connection that quietly removes an hour of manual work every day, then does it again tomorrow. We build for the operation that has to keep running.',
  },
] as const;

export const BIRTH = {
  eyebrow: 'The Birth of Plerona',
  headline: 'A name for a different kind of partner.',
  paragraphs: [
    'Plerona was built to be the partner we kept wishing existed — one that would walk into an operation, understand how it actually ran, and build the connective infrastructure that made it run better, without turning the business into a permanent customer.',
    'The model is deliberately uncommon. We are paid to make ourselves unnecessary. The implementation ends with a handoff, full ownership, and documentation thorough enough that your team can extend the system on their own. Optional hosting exists for businesses that want us to keep managing and evolving the infrastructure — but it is a choice, never a leash.',
  ],
} as const;

export const VISION = {
  eyebrow: 'The Vision',
  headline:
    'A world where the smallest business runs on the same infrastructure as the largest.',
  body: 'Enterprise has always had operating infrastructure built around it. We think the corner shop, the contractor, and the studio deserve the same — connected, intelligent, and owned. That is the world Plerona is building toward, one implementation at a time.',
} as const;

export const ABOUT_CLOSING_HEADLINE =
  "If this is the kind of partner you have been looking for, let's begin.";
