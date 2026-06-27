/**
 * Static content derived from Website Structure V2 §07–§10.
 * Copy tone: declarative, precise, educational. Never hype, never padded.
 */

export interface ProblemCard {
  title: string;
  body: string;
}

// HS-02 — Why Businesses Are Falling Behind
export const HOME_PROBLEMS: ProblemCard[] = [
  {
    title: 'Disconnected Tools',
    body: 'Scheduling, CRM, email, and reporting each live in their own silo. Your team is the integration layer, moving information between systems by hand.',
  },
  {
    title: 'Manual Repetition',
    body: 'The same tasks are done again every week — entering, copying, summarizing, following up. Work that a connected system would simply absorb.',
  },
  {
    title: 'False Visibility',
    body: 'Dashboards exist, but the real picture is scattered across platforms. You are reacting to fragments, not operating from a single source of truth.',
  },
  {
    title: 'Capability Ceiling',
    body: 'Growth stalls not from lack of effort, but because the operation cannot do more without breaking. The ceiling is structural, not personal.',
  },
];

// HS-03 — Historical Timeline
export interface Milestone {
  era: string;
  context: string;
  impact: string;
  gain: string;
  implication: string;
  active?: boolean;
}

export const TIMELINE: Milestone[] = [
  {
    era: 'Industrial Revolution',
    context: 'Mechanization replaced manual production.',
    impact: 'Output decoupled from individual labor.',
    gain: 'Order-of-magnitude productivity.',
    implication: 'Businesses rebuilt around machines.',
  },
  {
    era: 'Assembly Line',
    context: 'Standardized, sequential production.',
    impact: 'Repeatable processes at scale.',
    gain: 'Cost per unit collapsed.',
    implication: 'Operations became systems, not crafts.',
  },
  {
    era: 'Digital Revolution',
    context: 'Computers entered the business.',
    impact: 'Records, calculation, and storage digitized.',
    gain: 'Information became fast and cheap.',
    implication: 'Software became operational infrastructure.',
  },
  {
    era: 'Internet Era',
    context: 'Businesses connected to the world.',
    impact: 'Distribution and communication globalized.',
    gain: 'Reach without physical limits.',
    implication: 'Online presence became mandatory.',
  },
  {
    era: 'AI Revolution',
    context: 'Intelligence became programmable.',
    impact: 'Systems can now reason, draft, and decide.',
    gain: 'Cognitive work compounds, not just manual.',
    implication: 'Every operation must reconnect around AI.',
    active: true,
  },
  {
    era: 'Connected Infrastructure',
    context: 'The present opportunity.',
    impact: 'Tools, data, and AI operate as one system.',
    gain: 'The business operates at a different level.',
    implication: 'This is the infrastructure to build now.',
  },
];

// HS-04 — Bottleneck nodes
export const BOTTLENECK_NODES = [
  'Scheduling',
  'CRM',
  'Reporting',
  'Hiring',
  'Email',
  'Admin',
  'Knowledge',
  'Finance',
  'Coordination',
];

// HS-05 — Infrastructure layers
export interface InfraLayer {
  label: string;
  description: string;
}

export const INFRA_LAYERS: InfraLayer[] = [
  { label: 'Your Business', description: 'The operation at the center — every layer exists to serve it.' },
  { label: 'Connected Systems', description: 'Your existing tools, unified into one coordinated layer.' },
  { label: 'Claude AI Layer', description: 'Reasoning and language capability embedded across the operation.' },
  { label: 'Prompt Libraries', description: 'Documented, reusable instructions tuned to your business context.' },
  { label: 'Agent Teams', description: 'Configured agents executing defined work autonomously.' },
  { label: 'Automated Workflows', description: 'Handoffs and repetitive processes that run without manual effort.' },
  { label: 'Business Outcomes', description: 'Faster operations, real visibility, and capacity to grow.' },
];

// HS-06 — Industry transformations
export interface Transformation {
  industry: string;
  problem: string;
  connection: string;
  automation: string;
  outcome: string;
  beforeState: string;
  afterState: string;
}

export const TRANSFORMATIONS: Transformation[] = [
  {
    industry: 'Pool Companies',
    problem: 'Bookings, routes, and customer history live in three disconnected places.',
    connection: 'Scheduling, CRM, and field notes connected into one system.',
    automation: 'Route building, reminders, and follow-ups triggered automatically.',
    outcome: 'More stops per day, fewer missed appointments, full customer history on demand.',
    beforeState: 'Owner rebuilds the schedule by hand every morning.',
    afterState: 'The schedule builds itself; the owner reviews and adjusts.',
  },
  {
    industry: 'General Contractors',
    problem: 'Bids, change orders, and crew coordination are scattered across texts and email.',
    connection: 'Estimating, project tracking, and communication unified.',
    automation: 'Bid drafts, status updates, and document generation automated.',
    outcome: 'Faster bids, fewer dropped details, projects that stay on schedule.',
    beforeState: 'Details get lost between the field and the office.',
    afterState: 'Every job has a single, current source of truth.',
  },
  {
    industry: 'Medical Offices',
    problem: 'Intake, scheduling, and records require constant manual re-entry.',
    connection: 'Intake, scheduling, and documentation connected with AI support.',
    automation: 'Intake summaries and follow-up coordination handled automatically.',
    outcome: 'Less administrative load, faster intake, more time with patients.',
    beforeState: 'Staff spend the day re-typing the same information.',
    afterState: 'Information flows once and stays connected.',
  },
  {
    industry: 'Legal Practices',
    problem: 'Document drafting and case intake consume billable hours.',
    connection: 'Intake, document drafting, and matter tracking connected.',
    automation: 'First-draft documents and intake summaries generated on request.',
    outcome: 'More billable focus, faster turnaround, consistent work product.',
    beforeState: 'Drafting from scratch on every matter.',
    afterState: 'Drafting from a documented, AI-assisted system.',
  },
  {
    industry: 'Dealerships',
    problem: 'Leads, inventory, and follow-up live in separate tools.',
    connection: 'Lead capture, inventory, and CRM connected.',
    automation: 'Lead routing, follow-up sequences, and reporting automated.',
    outcome: 'Faster lead response, fewer lost deals, clear pipeline visibility.',
    beforeState: 'Leads go cold waiting for a manual follow-up.',
    afterState: 'Every lead is engaged the moment it arrives.',
  },
  {
    industry: 'Professional Services',
    problem: 'Client work, knowledge, and coordination are tied to individuals.',
    connection: 'Knowledge base, project tracking, and communication connected.',
    automation: 'Status reporting and knowledge retrieval automated.',
    outcome: 'Less key-person risk, faster onboarding, scalable delivery.',
    beforeState: 'Knowledge lives in people, not the system.',
    afterState: 'Knowledge lives in the infrastructure.',
  },
];

// Why Plerona pillars (HS-10)
export const WHY_PILLARS = [
  { n: '01', title: 'Infrastructure over tooling', body: 'Tools are bought and forgotten. Infrastructure changes how the operation runs. We build the second.' },
  { n: '02', title: 'Ownership over subscription', body: 'You own the system, the prompts, and the documentation. No dependency, no recurring license to operate.' },
  { n: '03', title: 'Self-sufficiency over dependency', body: 'Our goal is a business that does not need us to keep running. The handoff is the point.' },
];

// Consult page problems (§08-02)
export const CONSULT_PROBLEMS: ProblemCard[] = [
  { title: 'No clear infrastructure picture', body: 'You know something needs to change, but not what, where, or in what order.' },
  { title: 'Tools without strategy', body: 'You have software, but no architecture connecting it into a coherent operation.' },
  { title: "Don't know where AI applies", body: 'AI is clearly relevant — but which parts of your business should it touch first?' },
  { title: 'Cannot evaluate implementation ROI', body: 'Without a roadmap, you cannot judge whether a full build is worth the investment.' },
];

// Consult FAQ (§08-06)
export const CONSULT_FAQ = [
  {
    q: 'What happens if I want to implement after?',
    a: 'Your roadmap becomes the blueprint for implementation. The credit from your Roadmap applies to Implementation if you proceed within 30 days.',
  },
  {
    q: 'Is this a sales call?',
    a: 'No. The Roadmap is a paid deliverable — strategic analysis, an operational audit, and a prioritized infrastructure plan. It stands on its own whether or not you implement with us.',
  },
  {
    q: 'What information do you need from me?',
    a: 'A clear view of how your business operates today: the tools you use, the manual work your team does, and where things break down. We guide you through exactly what to share.',
  },
  {
    q: 'How is this different from a free consultation?',
    a: 'A free consultation is a conversation. The Roadmap is a documented, structured analysis of your operation with a prioritized plan you keep — regardless of what you do next.',
  },
];

// Consult expected outcomes (§08-05)
export const CONSULT_OUTCOMES = [
  { title: 'Clarity on infrastructure gaps', body: 'A precise account of where your operation is disconnected and where that costs you.' },
  { title: 'Prioritized implementation list', body: 'The specific connections and automations to build, in the order that returns the most.' },
  { title: 'ROI projection', body: 'A grounded estimate of what connected infrastructure returns for your business.' },
  { title: 'Readiness to deploy', body: 'Everything needed to begin implementation immediately — or to decide with confidence.' },
];
