import Hero from '@/components/Hero';
import SectionHeader from '@/components/SectionHeader';
import ProblemCards from '@/components/ProblemCards';
import HistoricalTimeline from '@/components/HistoricalTimeline';
import BottleneckDiagram from '@/components/BottleneckDiagram';
import InfrastructureDiagram from '@/components/InfrastructureDiagram';
import TransformationTabs from '@/components/TransformationTabs';
import ProcessSteps from '@/components/ProcessSteps';
import OfferSection from '@/components/OfferSection';
import ComparisonTable from '@/components/ComparisonTable';
import WhyPlerona from '@/components/WhyPlerona';
import FinalCTA from '@/components/FinalCTA';
import { HOME_PROBLEMS } from '@/lib/content';

export default function HomePage() {
  return (
    <>
      {/* HS-01 — Hero */}
      <Hero
        immersive
        eyebrow="AI Operational Infrastructure"
        headline={['Build Your Business', 'an AI-Powered Infrastructure']}
        subtitle="We transform disconnected operations into AI-powered systems by integrating the right tools, workflows, prompts, and automations into a single operational infrastructure."
        primary={{ label: 'View Packages', href: '#packages' }}
        secondary={{ label: 'How It Works', href: '#process' }}
        stats={['AI-Connected', 'Prompt-Powered', 'Agent-Driven', 'Delivery: 2–5 Days']}
      />

      {/* HS-02 — Why Businesses Are Falling Behind */}
      <section className="section bg-surface">
        <div className="container-px">
          <SectionHeader
            eyebrow="The Reality"
            headline={['Your business is not behind on effort.', 'It is behind on infrastructure.']}
            subtitle="Most operations are not limited by how hard the team works. They are limited by the systems they inherited — disconnected tools held together by manual effort."
          />
          <div className="mt-14">
            <ProblemCards cards={HOME_PROBLEMS} columns={4} />
          </div>
        </div>
      </section>

      {/* HS-03 — Philosophy / Historical Timeline */}
      <section className="section bg-ink">
        <div className="container-px">
          <SectionHeader
            surface="dark"
            eyebrow="Our Philosophy"
            headline={['This is not an upgrade.', 'It is the next operating shift.']}
            subtitle="Every business era forces businesses to rebuild their operational infrastructure. The constraint you feel is not personal failure — it is the gap between an old operating model and a new one."
          />
          <div className="mt-14">
            <HistoricalTimeline />
          </div>
        </div>
      </section>

      {/* HS-04 — The Bottleneck */}
      <section className="section bg-surface">
        <div className="container-px">
          <SectionHeader
            align="center"
            eyebrow="The Bottleneck"
            headline={['The tools are not the problem.', 'The absence of connection is.']}
            subtitle="Every system runs in isolation. Your team becomes the connective tissue — and that friction is where time, money, and visibility quietly disappear."
          />
          <div className="mt-16">
            <BottleneckDiagram />
          </div>
        </div>
      </section>

      {/* HS-05 — The Infrastructure */}
      <section className="section bg-ink">
        <div className="container-px">
          <SectionHeader
            surface="dark"
            align="center"
            eyebrow="What Connected Looks Like"
            headline={['One infrastructure.', 'Every system, operating as one.']}
            subtitle="Infrastructure determines capability. A business running on connected AI infrastructure does not work harder — it operates at a different level entirely."
          />
          <div className="mt-16">
            <InfrastructureDiagram />
          </div>
        </div>
      </section>

      {/* HS-06 — Transformations */}
      <section className="section bg-surface">
        <div className="container-px">
          <SectionHeader
            eyebrow="Infrastructure Transformations"
            headline={['See your operation', 'inside the system.']}
            subtitle="The same arc applies across industries: an operational problem, a connection deployed, an automation triggered, and a measurable business outcome."
          />
          <div className="mt-14">
            <TransformationTabs />
          </div>
        </div>
      </section>

      {/* HS-07 — Process */}
      <section id="process" className="section bg-ink scroll-mt-20">
        <div className="container-px">
          <SectionHeader
            surface="dark"
            eyebrow="How We Work"
            headline={['A controlled build.', 'Not a leap into the unknown.']}
            subtitle="The engagement has a defined process, a defined timeline, and a clear outcome. You know exactly what happens, and in what order, before you commit."
          />
          <div className="mt-14">
            <ProcessSteps surface="dark" />
          </div>
        </div>
      </section>

      {/* HS-08 — Offers + inline configuration */}
      <section id="packages" className="section bg-surface scroll-mt-20">
        <div className="container-px">
          <SectionHeader
            align="center"
            eyebrow="Choose Your Starting Point"
            headline={['Two clean options.', 'Configure the one that fits.']}
            subtitle="Start with a roadmap, or implement now. Configure your implementation below and see your exact price before you decide."
          />
          <div className="mt-14">
            <OfferSection />
          </div>
        </div>
      </section>

      {/* HS-09 — Comparison */}
      <section className="section bg-offwhite">
        <div className="container-px">
          <SectionHeader
            eyebrow="Which Path Is Yours"
            headline={['Roadmap or Implementation.', 'Both lead to the same place.']}
          />
          <div className="mt-14">
            <ComparisonTable />
          </div>
        </div>
      </section>

      {/* HS-10 — Why Plerona */}
      <section className="section bg-ink">
        <div className="container-px">
          <WhyPlerona />
        </div>
      </section>

      {/* HS-11 — Final Conversion */}
      <FinalCTA
        headline="The businesses that own their infrastructure will operate differently than those that rent it. The only question is which one yours becomes."
        primary={{ label: 'Start Implementation', href: '/implementation' }}
        secondary={{ label: 'Book Roadmap', href: '/consult' }}
      />
    </>
  );
}
