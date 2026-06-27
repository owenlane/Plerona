import type { Metadata } from 'next';
import SectionHeader from '@/components/SectionHeader';
import FinalCTA from '@/components/FinalCTA';
import FounderPortrait from '@/components/FounderPortrait';

export const metadata: Metadata = {
  title: 'About — Why Plerona Exists',
  description:
    'Plerona builds connected AI infrastructure for small businesses and hands it back as something they own. The conviction, the philosophy, and the people behind it.',
};

// §10 — About. Honest framing only. No fabricated metrics, no invented client
// counts, no manufactured timelines. Every claim here is a statement of
// philosophy and intent, not a performance figure.

const PHILOSOPHY = [
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
];

const BUILDING_YEARS = [
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
];

export default function AboutPage() {
  return (
    <>
      {/* 01 Hero — Mission */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-ink pt-16 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(26,86,219,0.12),_transparent_60%)]" />
        <div className="container-px relative z-10 py-24">
          <p className="eyebrow tracking-eyebrow mb-6">Why Plerona Exists</p>
          <h1 className="max-w-4xl text-4xl font-bold leading-[1.05] tracking-tighter2 sm:text-5xl md:text-6xl">
            <span className="block">Small businesses deserve</span>
            <span className="block">infrastructure they own.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-[1.7] text-silver md:text-lg">
            Plerona exists to put connected AI infrastructure — the kind that quietly runs an
            operation — into the hands of the businesses that were told it was out of reach. We
            build it for your business, and then we give it to you.
          </p>
        </div>
      </section>

      {/* 02 Mission statement */}
      <section className="container-px section">
        <SectionHeader
          eyebrow="The Mission"
          headline={['Remove the structural bottleneck', 'from small-business growth.']}
          subtitle="Most small businesses are not held back by a lack of effort or talent. They are held back by structure — by work that has to pass through a person because nothing connects the tools they already pay for. Our mission is to dissolve that bottleneck and leave the business stronger and self-sufficient."
        />
      </section>

      {/* 03 Founder Journey */}
      <section className="bg-offwhite">
        <div className="container-px section">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[320px_1fr] lg:gap-16">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <FounderPortrait
                name="Owen Donaldo Lane Campos"
                role="Founder, Plerona LLC"
              />
            </div>
            <div>
              <p className="eyebrow tracking-eyebrow mb-5">The Founder Journey</p>
              <h2 className="text-3xl font-bold leading-[1.1] tracking-tighter2 md:text-[2.25rem]">
                Years of building inside the
                <br />
                businesses this is for.
              </h2>
              <div className="mt-10 space-y-10">
                {BUILDING_YEARS.map((b) => (
                  <div key={b.phase} className="border-l-2 border-blue pl-6">
                    <p className="eyebrow-muted mb-2">{b.phase}</p>
                    <p className="text-base leading-[1.7] text-ink/80">{b.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 Infrastructure Philosophy */}
      <section className="container-px section">
        <SectionHeader
          eyebrow="Infrastructure Philosophy"
          headline={['Three convictions that', 'shape everything we build.']}
        />
        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-rule md:grid-cols-3">
          {PHILOSOPHY.map((p) => (
            <div key={p.n} className="bg-surface p-8">
              <span className="text-2xl font-bold tabular-nums text-blue">{p.n}</span>
              <h3 className="mt-5 text-lg font-bold tracking-tight">{p.title}</h3>
              <p className="mt-3 text-sm leading-[1.7] text-graymid">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 05 The Birth of Plerona */}
      <section className="bg-ink text-white">
        <div className="container-px section">
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow tracking-eyebrow mb-6">The Birth of Plerona</p>
            <h2 className="text-3xl font-bold leading-[1.12] tracking-tighter2 md:text-[2.5rem]">
              A name for a different kind of partner.
            </h2>
            <div className="mt-8 space-y-6 text-base leading-[1.8] text-silver md:text-lg">
              <p>
                Plerona was built to be the partner we kept wishing existed — one that would walk
                into an operation, understand how it actually ran, and build the connective
                infrastructure that made it run better, without turning the business into a
                permanent customer.
              </p>
              <p>
                The model is deliberately uncommon. We are paid to make ourselves unnecessary. The
                implementation ends with a handoff, full ownership, and documentation thorough
                enough that your team can extend the system on their own. Optional hosting exists
                for businesses that want us to keep managing and evolving the infrastructure — but
                it is a choice, never a leash.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 06 Vision */}
      <section className="container-px section">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow tracking-eyebrow mb-6">The Vision</p>
          <h2 className="text-3xl font-bold leading-[1.12] tracking-tighter2 md:text-[2.5rem]">
            A world where the smallest business runs on the same infrastructure as the largest.
          </h2>
          <p className="mt-8 text-base leading-[1.8] text-graymid md:text-lg">
            Enterprise has always had operating infrastructure built around it. We think the
            corner shop, the contractor, and the studio deserve the same — connected, intelligent,
            and owned. That is the world Plerona is building toward, one implementation at a time.
          </p>
        </div>
      </section>

      {/* 07 Closing CTA */}
      <FinalCTA headline="If this is the kind of partner you have been looking for, let's begin." />
    </>
  );
}
