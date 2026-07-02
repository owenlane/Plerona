import type { Metadata } from 'next';
import SectionHeader from '@/components/SectionHeader';
import FinalCTA from '@/components/FinalCTA';
import FounderPortrait from '@/components/FounderPortrait';
import {
  ABOUT_CLOSING_HEADLINE,
  ABOUT_HERO,
  ABOUT_MISSION,
  BIRTH,
  BUILDING_YEARS,
  FOUNDER,
  FOUNDER_JOURNEY,
  PHILOSOPHY,
  PHILOSOPHY_HEADER,
  VISION,
} from '@/lib/about-content';

export const metadata: Metadata = {
  title: 'About — Why Plerona Exists',
  description:
    'Plerona builds connected AI infrastructure for small businesses and hands it back as something they own. The conviction, the philosophy, and the people behind it.',
};

// §10 — About. Honest framing only. No fabricated metrics, no invented client
// counts, no manufactured timelines. Content lives in lib/about-content.ts and
// is shared verbatim with the Captain's Room on the Journey.

export default function AboutPage() {
  return (
    <>
      {/* 01 Hero — Mission */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-ink pt-16 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(232,198,112,0.10),_transparent_60%)]" />
        <div className="container-px relative z-10 py-24">
          <p className="eyebrow tracking-eyebrow mb-6">{ABOUT_HERO.eyebrow}</p>
          <h1 className="max-w-4xl text-4xl font-bold leading-[1.05] tracking-tighter2 sm:text-5xl md:text-6xl">
            <span className="block">{ABOUT_HERO.titleLines[0]}</span>
            <span className="block">{ABOUT_HERO.titleLines[1]}</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-[1.7] text-silver md:text-lg">
            {ABOUT_HERO.body}
          </p>
        </div>
      </section>

      {/* 02 Mission statement */}
      <section className="container-px section">
        <SectionHeader
          eyebrow={ABOUT_MISSION.eyebrow}
          headline={[ABOUT_MISSION.headline[0], ABOUT_MISSION.headline[1]]}
          subtitle={ABOUT_MISSION.subtitle}
        />
      </section>

      {/* 03 Founder Journey */}
      <section className="bg-offwhite">
        <div className="container-px section">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[320px_1fr] lg:gap-16">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <FounderPortrait name={FOUNDER.name} role={FOUNDER.role} />
            </div>
            <div>
              <p className="eyebrow tracking-eyebrow mb-5">{FOUNDER_JOURNEY.eyebrow}</p>
              <h2 className="text-3xl font-bold leading-[1.1] tracking-tighter2 md:text-[2.25rem]">
                {FOUNDER_JOURNEY.headlineLines[0]}
                <br />
                {FOUNDER_JOURNEY.headlineLines[1]}
              </h2>
              <div className="mt-10 space-y-10">
                {BUILDING_YEARS.map((b) => (
                  <div key={b.phase} className="border-l-2 border-blue pl-6">
                    <p className="eyebrow-muted mb-2">{b.phase}</p>
                    <p className="text-base leading-[1.7] text-snow/80">{b.body}</p>
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
          eyebrow={PHILOSOPHY_HEADER.eyebrow}
          headline={[PHILOSOPHY_HEADER.headline[0], PHILOSOPHY_HEADER.headline[1]]}
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
            <p className="eyebrow tracking-eyebrow mb-6">{BIRTH.eyebrow}</p>
            <h2 className="text-3xl font-bold leading-[1.12] tracking-tighter2 md:text-[2.5rem]">
              {BIRTH.headline}
            </h2>
            <div className="mt-8 space-y-6 text-base leading-[1.8] text-silver md:text-lg">
              {BIRTH.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 06 Vision */}
      <section className="container-px section">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow tracking-eyebrow mb-6">{VISION.eyebrow}</p>
          <h2 className="text-3xl font-bold leading-[1.12] tracking-tighter2 md:text-[2.5rem]">
            {VISION.headline}
          </h2>
          <p className="mt-8 text-base leading-[1.8] text-graymid md:text-lg">{VISION.body}</p>
        </div>
      </section>

      {/* 07 Closing CTA */}
      <FinalCTA headline={ABOUT_CLOSING_HEADLINE} />
    </>
  );
}
