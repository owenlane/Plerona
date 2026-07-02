import type { Metadata } from 'next';
import Link from 'next/link';
import Hero from '@/components/Hero';
import SectionHeader from '@/components/SectionHeader';
import ProblemCards from '@/components/ProblemCards';
import FAQAccordion from '@/components/FAQAccordion';
import { CONSULT, MONEY } from '@/lib/pricing';
import { CONSULT_FAQ, CONSULT_OUTCOMES, CONSULT_PROBLEMS } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Intermediary Consult — The Roadmap',
  description:
    'The Roadmap: strategic analysis, operational audit, and a prioritized infrastructure plan for your business. $798.95, delivered in 1 business day.',
};

const ROADMAP_STEPS = [
  { n: '01', t: 'Book', d: 'Reserve your Roadmap. You receive an intake outline immediately.' },
  { n: '02', t: 'Share', d: 'You provide a clear picture of how your operation runs today.' },
  { n: '03', t: 'Analysis', d: 'We audit your tools, workflows, and friction points.' },
  { n: '04', t: 'Delivery', d: 'You receive a documented roadmap within 1 business day.' },
];

export default function ConsultPage() {
  return (
    <>
      {/* 01 Hero */}
      <Hero
        eyebrow="Intermediary Consult"
        headline={['The Roadmap.', 'Clarity before commitment.']}
        subtitle="Before you build, you should know exactly what to build and why. The Roadmap is a documented analysis of your operation and a prioritized plan for connected AI infrastructure."
        price={`${MONEY(CONSULT.price)} · ${CONSULT.delivery}`}
        primary={{ label: CONSULT.ctaLabel, href: '/checkout?offer=consult' }}
        secondary={{ label: 'Compare to Implementation', href: '/implementation' }}
      />

      <div className="container-px py-20 lg:grid lg:grid-cols-[1fr_320px] lg:gap-16">
        <div className="space-y-24">
          {/* 02 Problem This Solves */}
          <section>
            <SectionHeader
              eyebrow="The Problem This Solves"
              headline={['You know something must change.', 'You do not yet know what.']}
            />
            <div className="mt-12">
              <ProblemCards cards={CONSULT_PROBLEMS} columns={2} />
            </div>
          </section>

          {/* 03 What You Receive */}
          <section>
            <SectionHeader
              eyebrow="What You Receive"
              headline={['Four deliverables.', 'One clear path forward.']}
            />
            <div className="mt-12 space-y-px overflow-hidden border border-rule">
              {CONSULT.deliverables.map((d, i) => (
                <div key={d.title} className="bg-surface p-6">
                  <div className="flex gap-5">
                    <span className="text-xl font-bold tabular-nums text-blue">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold">{d.title}</h3>
                      <p className="mt-1.5 text-sm leading-[1.6] text-graymid">{d.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 04 Roadmap Process */}
          <section>
            <SectionHeader
              eyebrow="The Roadmap Process"
              headline={['From purchase to plan.', 'One business day.']}
            />
            <ol className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-rule sm:grid-cols-2 lg:grid-cols-4">
              {ROADMAP_STEPS.map((s) => (
                <li key={s.n} className="bg-surface p-6">
                  <span className="text-xl font-bold tabular-nums text-blue">{s.n}</span>
                  <h3 className="mt-3 text-base font-semibold">{s.t}</h3>
                  <p className="mt-2 text-sm leading-[1.6] text-graymid">{s.d}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* 05 Expected Outcomes */}
          <section>
            <SectionHeader
              eyebrow="Expected Outcomes"
              headline={['What a completed Roadmap', 'typically reveals.']}
            />
            <div className="mt-12">
              <ProblemCards cards={CONSULT_OUTCOMES} columns={2} />
            </div>
          </section>

          {/* 06 FAQ */}
          <section>
            <SectionHeader eyebrow="Common Questions" headline={['Before you book.', 'The honest answers.']} />
            <div className="mt-12">
              <FAQAccordion items={CONSULT_FAQ} />
            </div>
          </section>

          {/* 08 Upgrade Path */}
          <section className="rounded-[2px] border-l-[3px] border-blue bg-offwhite p-8">
            <p className="eyebrow tracking-eyebrow mb-3">What Happens Next</p>
            <p className="max-w-2xl text-lg leading-[1.7] text-snow">
              Most clients who complete the Roadmap proceed to Implementation. Your roadmap becomes
              the blueprint — and your Roadmap credit applies to Implementation if you proceed within
              30 days.
            </p>
            <Link
              href="/implementation"
              className="mt-6 inline-flex rounded-[2px] border border-snow/20 px-6 py-3 text-sm font-semibold transition-colors hover:bg-snow/[0.06]"
            >
              View Implementation
            </Link>
          </section>
        </div>

        {/* 07 Purchase block — sticky sidebar (desktop) */}
        <aside className="mt-16 lg:mt-0">
          <div className="sticky top-24 rounded-[2px] border border-rule bg-ink p-7 text-white">
            <p className="eyebrow tracking-eyebrow mb-5">Book the Roadmap</p>
            <p className="text-4xl font-bold tracking-tight">{MONEY(CONSULT.price)}</p>
            <p className="mt-1 text-sm text-silver">Delivery: {CONSULT.delivery}</p>
            <ul className="mt-6 space-y-2 text-sm text-silver">
              {CONSULT.deliverables.map((d) => (
                <li key={d.title} className="flex gap-2">
                  <span className="text-blue">—</span>
                  {d.title}
                </li>
              ))}
            </ul>
            <Link
              href="/checkout?offer=consult"
              className="mt-7 block rounded-[2px] bg-blue px-6 py-3.5 text-center text-sm font-semibold text-space transition-colors hover:bg-blue-hover"
            >
              {CONSULT.ctaLabel}
            </Link>
            <p className="mt-3 text-center text-xs text-graymid">
              Credit applies to Implementation within 30 days.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
