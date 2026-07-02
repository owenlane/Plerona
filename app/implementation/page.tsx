import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import SectionHeader from '@/components/SectionHeader';
import ProcessSteps from '@/components/ProcessSteps';
import ImplementationConfigurator from '@/components/ImplementationConfigurator';
import FinalCTA from '@/components/FinalCTA';
import { IMPLEMENTATION, MONEY } from '@/lib/pricing';

export const metadata: Metadata = {
  title: 'Plerona Implementation',
  description:
    'Connected AI infrastructure built for your business and handed off to you. From $3,027.95, delivered in 2–5 business days. Configure your build.',
};

const CAPABILITIES = [
  { fn: 'Operations', items: ['Coordinate work across systems automatically', 'Replace manual handoffs with connected workflows'] },
  { fn: 'Customer', items: ['Respond to leads and requests instantly', 'Keep full history in one connected record'] },
  { fn: 'Knowledge', items: ['Retrieve answers from your own documented context', 'Generate first-draft work on request'] },
  { fn: 'Reporting', items: ['See the real operational picture in one place', 'Automate the reports you build by hand today'] },
];

export default function ImplementationPage() {
  return (
    <>
      {/* 01 Hero */}
      <Hero
        eyebrow="Plerona Implementation"
        headline={['Stop running on disconnected tools.', 'Operate on connected infrastructure.']}
        subtitle="Implementing AI infrastructure changes what your business is capable of — not by adding another tool, but by connecting the operation into a single intelligent system you own."
        price={`From ${MONEY(IMPLEMENTATION.basePrice)}`}
        primary={{ label: 'Configure My Infrastructure', href: '#configure' }}
        secondary={{ label: 'Book a Roadmap First', href: '/consult' }}
      />

      {/* 02 The Problem This Solves */}
      <section className="section bg-surface">
        <div className="container-px">
          <SectionHeader
            eyebrow="The Cost of Disconnection"
            headline={['Disconnection is not an inconvenience.', 'It is an operating tax.']}
            subtitle="Every manual handoff, every re-entry, every report assembled by hand is capacity spent maintaining the gap between your tools. At scale, that gap is the single largest drag on the operation."
          />
        </div>
      </section>

      {/* 03 What Plerona Connects */}
      <section className="section bg-offwhite">
        <div className="container-px">
          <SectionHeader
            eyebrow="What Plerona Connects"
            headline={['Not a feature list.', 'A list of new capabilities.']}
            subtitle="What your business can do after implementation that it cannot do today."
          />
          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-2">
            {CAPABILITIES.map((c) => (
              <div key={c.fn} className="bg-surface p-7">
                <p className="eyebrow tracking-eyebrow">{c.fn}</p>
                <ul className="mt-4 space-y-3">
                  {c.items.map((it) => (
                    <li key={it} className="flex gap-3 text-sm leading-[1.6] text-snow">
                      <span className="text-blue">→</span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 What You Receive */}
      <section className="section bg-ink">
        <div className="container-px">
          <SectionHeader
            surface="dark"
            eyebrow="Complete Deliverables"
            headline={['Everything is named.', 'Everything is yours.']}
          />
          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {IMPLEMENTATION.deliverables.map((d, i) => (
              <div key={d.title} className="bg-white/[0.02] p-6">
                <span className="text-sm font-bold tabular-nums text-blue">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 text-base font-semibold text-white">{d.title}</h3>
                <p className="mt-2 text-sm leading-[1.6] text-silver">{d.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 The Implementation Process */}
      <section className="section bg-surface">
        <div className="container-px">
          <SectionHeader
            eyebrow="The Implementation Process"
            headline={['Five steps.', 'Two to five business days.']}
          />
          <div className="mt-14">
            <ProcessSteps surface="light" />
          </div>
        </div>
      </section>

      {/* 06–08 Prompt Libraries / Agent Teams / Self-Sufficiency */}
      <section className="section bg-ink">
        <div className="container-px space-y-20">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <SectionHeader
              surface="dark"
              eyebrow="Prompt Libraries"
              headline={['Documented instructions,', 'built for your context.']}
              subtitle="Prompt libraries are the reusable, version-controlled instructions that make AI reliable inside your operation. They are written for your business, documented in full, and owned by you."
            />
            <SectionHeader
              surface="dark"
              eyebrow="Agent Teams"
              headline={['Configured agents,', 'doing defined work.']}
              subtitle="Agent teams are configured to handle specific, bounded tasks autonomously and hand off to your team when judgment is required. The goal is comprehension and control — not a black box."
            />
          </div>
          <div className="rounded-[2px] border-l-[3px] border-blue bg-white/[0.03] p-8">
            <p className="eyebrow tracking-eyebrow mb-4">Self-Sufficiency Philosophy</p>
            <p className="max-w-3xl text-lg leading-[1.7] text-silver">
              Plerona&apos;s goal is a client that does not need Plerona to keep operating. The
              documentation, the guided session, and the system handoff exist for one reason: when we
              leave, the infrastructure is fully yours to run, extend, and own. We do not build
              dependency. We build independence.
            </p>
          </div>
        </div>
      </section>

      {/* 09 Configuration — Live Pricing */}
      <section id="configure" className="section bg-surface scroll-mt-20">
        <div className="container-px">
          <SectionHeader
            eyebrow="Configure Your Infrastructure"
            headline={['Build your exact package.', 'See your exact price.']}
            subtitle="Start from the base package and add connections or optional hosting. Your total updates in real time. Nothing changes at checkout."
          />
          <div className="mt-14">
            <ImplementationConfigurator />
          </div>
        </div>
      </section>

      <FinalCTA
        headline="Your infrastructure is configured. The next step is to own it."
        primary={{ label: 'Start Implementation', href: '/checkout' }}
        secondary={{ label: 'Book Roadmap', href: '/consult' }}
      />
    </>
  );
}
