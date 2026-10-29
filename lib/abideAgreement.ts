/**
 * Plerona × Abide Electrical — Website Build Agreement.
 *
 * Single source of truth for the /abide-agreement page, its API route and the
 * signed-packet email. Prices here are locked for this agreement only and are
 * intentionally separate from lib/pricing.ts (the public marketing offers).
 *
 * Contract text below is verbatim. Do not shorten the payment, late-fee or
 * monthly SEO clauses.
 */

export const AGREEMENT_VERSION = 'ABIDE-STARTER-2026-10-28';
export const AGREEMENT_TITLE = 'PLERONA × ABIDE ELECTRICAL — Website Build Agreement';
export const NOTIFY_TO = 'contact@plerona.com';
export const TIME_ZONE = 'America/Los_Angeles';

export const PARTIES = {
  provider: {
    company: 'Plerona',
    name: 'Owen Lane',
    title: 'Owner',
    email: 'contact@plerona.com',
  },
  client: {
    company: 'Abide Electrical',
    name: 'Ryan Hansen',
    email: 'ryan@abideelectrical.com',
    phone: '(626) 761-4926',
  },
  domain: 'abideelectrical.com',
  visualsUrl: 'https://abide-electrical-preview.vercel.app',
} as const;

export const PRICES = {
  listSetup: '$3,000.98',
  discountLabel: 'Carlos introduction discount: 20%',
  acceptedSetup: '$2,400.78',
  deposit: '$600.20',
  balance: '$1,800.58',
  yearlyHosting: '$49.97/year',
  yearlyHostingPleronaDomain: '$99.98/year',
  monthly: '$198.98/month',
} as const;

const PAYPAL_HANDLE = 'owenlan';
export const PAYPAL = {
  handle: `paypal.me/${PAYPAL_HANDLE}`,
  profileUrl: `https://paypal.me/${PAYPAL_HANDLE}`,
  depositAmount: '600.20',
  balanceAmount: '1800.58',
  depositUrl: `https://www.paypal.com/paypalme/${PAYPAL_HANDLE}/600.20`,
  balanceUrl: `https://www.paypal.com/paypalme/${PAYPAL_HANDLE}/1800.58`,
} as const;

/** A block of contract text: a paragraph, a labelled line, or a bullet list. */
export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'kv'; label: string; text: string; strong?: boolean }
  | { kind: 'list'; label?: string; items: string[] }
  | { kind: 'link'; label: string; href: string };

export interface Section {
  id: string;
  number: number;
  title: string;
  blocks: Block[];
}

export const REQUIRED_CHECKBOXES = [
  { id: 'readAgree', label: 'I have read and agree to this Agreement.' },
  { id: 'authorized', label: 'I am authorized to sign for Abide Electrical.' },
  { id: 'depositStarts', label: 'I understand the 25% deposit ($600.20) starts my build.' },
  { id: 'depositNonRefundable', label: 'I understand the deposit is non-refundable once paid.' },
  {
    id: 'balanceBeforeLive',
    label: 'I understand the balance ($1,800.58) is due before my site goes live.',
  },
  {
    id: 'hostingTerms',
    label:
      'I understand the yearly hosting fee starts 1 year after launch ($49.97/year, own domain), and the optional monthly hosting at $198.98/month (unlimited revisions + SEO + Google Preferred / Ads support + monthly report) is optional.',
  },
  { id: 'contentRights', label: 'I have the rights to all content I provide.' },
  {
    id: 'noSensitiveData',
    label: 'I will not send passwords, card numbers, or patient records.',
  },
  { id: 'eRecords', label: 'I agree to sign and receive records electronically.' },
] as const;

export type CheckboxId = (typeof REQUIRED_CHECKBOXES)[number]['id'];

export const MONTHLY_OPTIONS = {
  yes: 'Yes — start monthly hosting at $198.98/month after go-live',
  no: 'No — yearly hosting only for now',
} as const;

export type MonthlyChoice = keyof typeof MONTHLY_OPTIONS;

export const SECTIONS: Section[] = [
  {
    id: 'parties',
    number: 1,
    title: 'Parties',
    blocks: [
      { kind: 'kv', label: 'Provider', text: 'Plerona — Owen Lane, Owner · contact@plerona.com' },
      {
        kind: 'kv',
        label: 'Client',
        text: 'Abide Electrical — Ryan Hansen · ryan@abideelectrical.com · (626) 761-4926',
      },
      { kind: 'kv', label: 'Client domain (Client-owned)', text: 'abideelectrical.com' },
      {
        kind: 'link',
        label: 'Visuals already shared',
        href: 'https://abide-electrical-preview.vercel.app',
      },
    ],
  },
  {
    id: 'project',
    number: 2,
    title: 'Project',
    blocks: [
      {
        kind: 'kv',
        label: 'Package',
        text: 'Starter (Plerona Implementation) · Objective: Direct Line (Get Calls/Forms Filled Out) — Home Services / Electrical',
      },
      { kind: 'kv', label: 'Setup price (list)', text: '$3,000.98' },
      { kind: 'kv', label: 'Carlos introduction discount', text: '20%' },
      {
        kind: 'kv',
        label: 'Accepted setup quote (Setup Price)',
        text: '$2,400.78',
        strong: true,
      },
      {
        kind: 'list',
        label: 'Included (Starter / Direct Line)',
        items: [
          'Get Found on Google',
          'Reviews block',
          'FAQ',
          'Contact form',
          'Site Care Checks',
          'Mobile First Design',
          'Fast Page Loads',
          'Easy Access Design',
          'Click-to-call bar',
          'Service area map',
          'Up to five main pages',
          'one business location',
          'owner-supplied approved content',
          'standard connections',
          'site direction follows the complimentary visuals already shared, with normal build adjustments.',
        ],
      },
      {
        kind: 'p',
        text: 'Anything not listed here is outside scope and requires a written Change Order.',
      },
    ],
  },
  {
    id: 'payment',
    number: 3,
    title: 'What you pay and when',
    blocks: [
      { kind: 'p', text: 'Nothing is charged until you approve this Agreement.' },
      {
        kind: 'kv',
        label: 'Deposit (25%) due at signing',
        text: '$600.20 — Non-refundable once paid, in all cases. Starts the build.',
        strong: true,
      },
      {
        kind: 'kv',
        label:
          'Balance (75%) due after you approve the final website (however many revisions it takes)',
        text: '$1,800.58 — Due by 11:59 PM Pacific Time on the 3rd day after Plerona sends the Balance Email.',
        strong: true,
      },
      {
        kind: 'p',
        text: 'Site goes live only after the Balance is paid (domain connection, email/phone connections, testing, launch).',
      },
      {
        kind: 'p',
        text: 'If late: 5% late fee added. If still unpaid after the 14-day late period, the project is closed and the site does not go live.',
      },
      {
        kind: 'kv',
        label: 'Payment method',
        text: 'PayPal to paypal.me/owenlan (deposit and balance). Plerona never asks for card numbers by email, form, or chat.',
      },
    ],
  },
  {
    id: 'timeline',
    number: 4,
    title: 'Timeline',
    blocks: [
      {
        kind: 'p',
        text: 'First version (V1) ready for review within 2 business days after Deposit is paid and this Agreement is signed.',
      },
      {
        kind: 'p',
        text: 'Client delays (files, answers, approvals, access) pause the clock; the clock resumes when Plerona receives what it needs.',
      },
      {
        kind: 'p',
        text: 'This timeline is a good-faith estimate, not a guarantee. If Plerona expects a delay on its side, Plerona emails a new estimated date.',
      },
      {
        kind: 'p',
        text: 'When V1 is ready, Plerona emails a review link. When the Client approves V1 and wants no more revisions, Plerona sends the Balance Email.',
      },
    ],
  },
  {
    id: 'revision',
    number: 5,
    title: 'Free revision',
    blocks: [
      {
        kind: 'p',
        text: 'One free revision within the agreed scope, usable for 14 days starting 30 days after delivery.',
      },
      {
        kind: 'p',
        text: 'New pages, features, or connected systems are separately quoted and approved in writing first.',
      },
    ],
  },
  {
    id: 'yearly-hosting',
    number: 6,
    title: 'Yearly hosting fee (required)',
    blocks: [
      {
        kind: 'p',
        text: 'First year of hosting and domain care: FREE (covered from the Balance).',
      },
      {
        kind: 'p',
        text: 'Because the Client uses their own domain (abideelectrical.com), starting 1 year after go-live the yearly fee is $49.97/year (Plerona connects the domain; hosting + upkeep).',
      },
      {
        kind: 'p',
        text: '(If Plerona later provided a domain instead, that rate would be $99.98/year — not applicable here.)',
      },
    ],
  },
  {
    id: 'monthly',
    number: 7,
    title: 'Optional monthly hosting — Unlimited Revisions + Digital Marketing — $198.98/month',
    blocks: [
      {
        kind: 'p',
        text: 'OPTIONAL and separate from Section 6. Cancel anytime, no notice. Benefits last until the end of the paid month; no further billing after cancel.',
      },
      {
        kind: 'list',
        label: 'Includes',
        items: [
          'Unlimited revisions that follow Plerona’s revision plan',
          'SEO marketing for the Client’s site',
          'Boosted Google Preferred / Google Ads support aimed at more qualified traffic, with trackable results',
          'A written monthly report each month summarizing what SEO and Google Ads activity did for the Client.',
        ],
      },
      {
        kind: 'list',
        label: 'Does NOT include unless stated in writing',
        items: [
          'The Client’s own Google Ads media spend / ad budget (paid by the Client to Google unless a separate written agreement says otherwise)',
          'Guaranteed rankings, traffic, leads, or revenue.',
        ],
      },
      {
        kind: 'p',
        text: 'Starting this plan, even for one month, cancels the next upcoming yearly fee bill. If later canceled, that skipped yearly bill is not charged; yearly fee resumes at the following yearly billing date.',
      },
      {
        kind: 'kv',
        label: 'Optional at signing',
        text: 'Yes — start monthly hosting at $198.98/month after go-live / No — yearly hosting only for now.',
      },
    ],
  },
  {
    id: 'ownership',
    number: 8,
    title: 'Ownership (short)',
    blocks: [
      { kind: 'p', text: 'Client owns Client content.' },
      {
        kind: 'p',
        text: 'Complimentary visuals belong to Plerona until the Deposit is paid; then they belong to the Client.',
      },
      {
        kind: 'p',
        text: 'While on Plerona hosting, Plerona holds the Final Site and the Client has the sole right to use it.',
      },
      {
        kind: 'p',
        text: 'Written request to leave → full site transfer at no charge within 14 days.',
      },
      { kind: 'p', text: 'Plerona keeps its tools, templates, and know-how.' },
      {
        kind: 'p',
        text: 'Plerona may show the Final Site in its portfolio unless the Client opts out by email.',
      },
    ],
  },
  {
    id: 'results',
    number: 9,
    title: 'Results',
    blocks: [
      {
        kind: 'p',
        text: 'Plerona does not promise search ranking, traffic, leads, sales, or revenue. Results depend on factors outside Plerona’s control.',
      },
    ],
  },
  {
    id: 'law',
    number: 10,
    title: 'Governing law',
    blocks: [
      {
        kind: 'p',
        text: 'Nevada law. Good-faith talk first (30 days), then Nevada courts if needed.',
      },
    ],
  },
  {
    id: 'checkboxes',
    number: 11,
    title: 'Required checkboxes (Client) — all required to submit',
    blocks: [],
  },
  {
    id: 'signatures',
    number: 12,
    title: 'Signatures',
    blocks: [
      {
        kind: 'kv',
        label: 'Client — Abide Electrical (Ryan Hansen)',
        text: 'signature pad + typed name + title + date/time PT',
      },
      {
        kind: 'kv',
        label: 'Plerona — Owen Lane, Owner',
        text: 'Owner counter-signature follows by email.',
      },
      {
        kind: 'p',
        text: 'Template note: Based on Plerona Session 1.1 Deposit Contract Terms. Not legal advice. Electronic signature with timestamp constitutes agreement to these terms.',
      },
    ],
  },
];

/** Format a Date in Pacific time with PDT/PST, e.g. "Oct 28, 2026, 4:52:10 PM PDT". */
export function formatPacific(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  }).format(date);
}
