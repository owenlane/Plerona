import JourneyShell from '@/components/journey/JourneyShell';
import LocationSection from '@/components/journey/LocationSection';
import Panel from '@/components/journey/Panel';
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
import FounderPortrait from '@/components/FounderPortrait';
import CTAButton from '@/components/CTAButton';
import { HOME_PROBLEMS } from '@/lib/content';
import {
  BIRTH,
  BUILDING_YEARS,
  FOUNDER,
  FOUNDER_JOURNEY,
  PHILOSOPHY,
  PHILOSOPHY_HEADER,
} from '@/lib/about-content';

/**
 * The Journey — Constitution Part III.
 * One coherent spaceship world experienced as a high-end digital museum.
 * Every pre-V2 homepage section (HS-01..HS-11) is preserved verbatim and
 * re-presented inside its assigned Location (Scene Graph, Part V Art. 2).
 * All critical information is DOM text on Panels; the 3D layer only travels
 * behind it. Focused Mode delivers this identical tree without the canvas.
 */
export default function HomePage() {
  return (
    <JourneyShell>
      {/* ── 01 · HERO VIEWPOINT — HS-01 (Part III, Art. 3.2) ─────────────── */}
      <LocationSection id="hero-viewpoint">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow tracking-eyebrow mb-6">AI Operational Infrastructure</p>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tighter2 text-snow sm:text-5xl md:text-[3.6rem]">
            <span className="block">Build Your Business</span>
            <span className="block">an AI-Powered Infrastructure</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-[1.7] text-mist md:text-lg">
            We transform disconnected operations into AI-powered systems by integrating the right
            tools, workflows, prompts, and automations into a single operational infrastructure.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CTAButton href="#package-room" variant="primary">
              View Packages
            </CTAButton>
            <CTAButton href="#operations-room" variant="secondary" surface="dark">
              How It Works
            </CTAButton>
          </div>
          <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {['AI-Connected', 'Prompt-Powered', 'Agent-Driven', 'Delivery: 2–5 Days'].map((s) => (
              <li
                key={s}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-mist"
              >
                <span aria-hidden="true" className="inline-block h-1 w-1 rounded-full bg-beam" />
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-16 text-xs uppercase tracking-[0.22em] text-mist/70">
            Scroll to begin the journey
          </p>
        </div>
      </LocationSection>

      {/* ── 02 · THE APPROACH — HS-02 ────────────────────────────────────── */}
      <LocationSection id="the-approach">
        <Panel>
          <SectionHeader
            surface="dark"
            eyebrow="The Reality"
            headline={['Your business is not behind on effort.', 'It is behind on infrastructure.']}
            subtitle="Most operations are not limited by how hard the team works. They are limited by the systems they inherited — disconnected tools held together by manual effort."
          />
          <div className="mt-12">
            <ProblemCards cards={HOME_PROBLEMS} columns={4} />
          </div>
        </Panel>
      </LocationSection>

      {/* ── 03 · CHRONICLE ROOM — HS-03 ──────────────────────────────────── */}
      <LocationSection id="chronicle-room">
        <Panel>
          <SectionHeader
            surface="dark"
            eyebrow="Our Philosophy"
            headline={['This is not an upgrade.', 'It is the next operating shift.']}
            subtitle="Every business era forces businesses to rebuild their operational infrastructure. The constraint you feel is not personal failure — it is the gap between an old operating model and a new one."
          />
          <div className="mt-12">
            <HistoricalTimeline />
          </div>
        </Panel>
      </LocationSection>

      {/* ── 04 · DIAGNOSTICS BAY — HS-04 ─────────────────────────────────── */}
      <LocationSection id="diagnostics-bay">
        <Panel>
          <SectionHeader
            surface="dark"
            align="center"
            eyebrow="The Bottleneck"
            headline={['The tools are not the problem.', 'The absence of connection is.']}
            subtitle="Every system runs in isolation. Your team becomes the connective tissue — and that friction is where time, money, and visibility quietly disappear."
          />
          <div className="mt-12">
            <BottleneckDiagram />
          </div>
        </Panel>
      </LocationSection>

      {/* ── 05 · ENGINEERING DECK — HS-05 ────────────────────────────────── */}
      <LocationSection id="engineering-deck">
        <Panel>
          <SectionHeader
            surface="dark"
            align="center"
            eyebrow="What Connected Looks Like"
            headline={['One infrastructure.', 'Every system, operating as one.']}
            subtitle="Infrastructure determines capability. A business running on connected AI infrastructure does not work harder — it operates at a different level entirely."
          />
          <div className="mt-12">
            <InfrastructureDiagram />
          </div>
        </Panel>
      </LocationSection>

      {/* ── 06 · CAPTAIN'S ROOM — HS-10 + About (Part III, Art. 3.3) ─────── */}
      <LocationSection id="captains-room">
        <Panel
          disclosure={{
            label: "Read the founder's full story",
            content: (
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr] lg:gap-14">
                <div>
                  <FounderPortrait name={FOUNDER.name} role={FOUNDER.role} />
                </div>
                <div>
                  <p className="eyebrow tracking-eyebrow mb-4">{FOUNDER_JOURNEY.eyebrow}</p>
                  <h3 className="text-2xl font-bold leading-[1.12] tracking-tighter2 text-snow">
                    {FOUNDER_JOURNEY.headlineLines[0]} {FOUNDER_JOURNEY.headlineLines[1]}
                  </h3>
                  <div className="mt-8 space-y-8">
                    {BUILDING_YEARS.map((b) => (
                      <div key={b.phase} className="border-l-2 border-beam pl-5">
                        <p className="eyebrow-muted mb-2">{b.phase}</p>
                        <p className="text-base leading-[1.7] text-snow/80">{b.body}</p>
                      </div>
                    ))}
                  </div>

                  <p className="eyebrow tracking-eyebrow mb-4 mt-12">{PHILOSOPHY_HEADER.eyebrow}</p>
                  <h3 className="text-2xl font-bold leading-[1.12] tracking-tighter2 text-snow">
                    {PHILOSOPHY_HEADER.headline[0]} {PHILOSOPHY_HEADER.headline[1]}
                  </h3>
                  <div className="mt-6 space-y-6">
                    {PHILOSOPHY.map((p) => (
                      <div key={p.n}>
                        <h4 className="text-base font-bold text-snow">
                          <span className="mr-3 tabular-nums text-beam">{p.n}</span>
                          {p.title}
                        </h4>
                        <p className="mt-2 text-sm leading-[1.7] text-mist">{p.body}</p>
                      </div>
                    ))}
                  </div>

                  <p className="eyebrow tracking-eyebrow mb-4 mt-12">{BIRTH.eyebrow}</p>
                  <h3 className="text-2xl font-bold leading-[1.12] tracking-tighter2 text-snow">
                    {BIRTH.headline}
                  </h3>
                  <div className="mt-5 space-y-5 text-base leading-[1.8] text-mist">
                    {BIRTH.paragraphs.map((p) => (
                      <p key={p.slice(0, 24)}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            ),
          }}
        >
          <WhyPlerona />
        </Panel>
      </LocationSection>

      {/* ── 07 · OBSERVATION DECK — HS-06 ────────────────────────────────── */}
      <LocationSection id="observation-deck">
        <Panel>
          <SectionHeader
            surface="dark"
            eyebrow="Infrastructure Transformations"
            headline={['See your operation', 'inside the system.']}
            subtitle="The same arc applies across industries: an operational problem, a connection deployed, an automation triggered, and a measurable business outcome."
          />
          <div className="mt-12">
            <TransformationTabs />
          </div>
        </Panel>
      </LocationSection>

      {/* ── 08 · OPERATIONS ROOM — HS-07 ─────────────────────────────────── */}
      <LocationSection id="operations-room">
        {/* Legacy anchor preserved so existing #process links keep resolving */}
        <span id="process" aria-hidden="true" />
        <Panel>
          <SectionHeader
            surface="dark"
            eyebrow="How We Work"
            headline={['A controlled build.', 'Not a leap into the unknown.']}
            subtitle="The engagement has a defined process, a defined timeline, and a clear outcome. You know exactly what happens, and in what order, before you commit."
          />
          <div className="mt-12">
            <ProcessSteps surface="dark" />
          </div>
        </Panel>
      </LocationSection>

      {/* ── 09 · PACKAGE ROOM — HS-08 + HS-09 (Part III, Art. 3.4/8) ─────── */}
      <LocationSection id="package-room">
        {/* Legacy anchor preserved so existing #packages links keep resolving */}
        <span id="packages" aria-hidden="true" />
        <Panel width="full">
          <SectionHeader
            surface="dark"
            align="center"
            eyebrow="Choose Your Starting Point"
            headline={['Two clean options.', 'Configure the one that fits.']}
            subtitle="Start with a roadmap, or implement now. Configure your implementation below and see your exact price before you decide."
          />
          <div className="mt-12">
            <OfferSection />
          </div>

          <div className="mt-20">
            <SectionHeader
              surface="dark"
              eyebrow="Which Path Is Yours"
              headline={['Roadmap or Implementation.', 'Both lead to the same place.']}
            />
            <div className="mt-10">
              <ComparisonTable />
            </div>
          </div>
        </Panel>
      </LocationSection>

      {/* ── 10 · TRANSMISSION DECK — HS-11 ───────────────────────────────── */}
      <LocationSection id="transmission-deck">
        <Panel width="reading" className="text-center">
          <h2 className="mx-auto max-w-3xl text-2xl font-bold leading-[1.15] tracking-tighter2 text-snow md:text-[2.4rem]">
            The businesses that own their infrastructure will operate differently than those that
            rent it. The only question is which one yours becomes.
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CTAButton href="/implementation" variant="primary">
              Start Implementation
            </CTAButton>
            <CTAButton href="/consult" variant="secondary" surface="dark">
              Book Roadmap
            </CTAButton>
          </div>
        </Panel>
      </LocationSection>
    </JourneyShell>
  );
}
