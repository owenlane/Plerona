import type { ReactNode } from 'react';

interface Section {
  heading: string;
  body: ReactNode;
}

interface Props {
  title: string;
  updated: string;
  intro: string;
  sections: Section[];
}

export default function LegalLayout({ title, updated, intro, sections }: Props) {
  return (
    <>
      <section className="bg-ink pt-16 text-white">
        <div className="container-px py-20">
          <p className="eyebrow tracking-eyebrow mb-5">Legal</p>
          <h1 className="text-4xl font-bold tracking-tighter2 md:text-5xl">{title}</h1>
          <p className="mt-4 text-sm text-graymid">Last updated: {updated}</p>
        </div>
      </section>

      <section className="container-px py-20">
        <div className="mx-auto max-w-2xl">
          <p className="text-base leading-[1.8] text-ink/80">{intro}</p>
          <div className="mt-14 space-y-12">
            {sections.map((s, i) => (
              <div key={s.heading}>
                <h2 className="text-lg font-bold tracking-tight">
                  <span className="mr-3 tabular-nums text-blue">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {s.heading}
                </h2>
                <div className="mt-4 space-y-4 text-sm leading-[1.8] text-graymid">{s.body}</div>
              </div>
            ))}
          </div>

          <p className="mt-16 border-t border-rule pt-8 text-sm leading-[1.8] text-graymid">
            Questions about this policy? Contact us at{' '}
            <a href="mailto:contact@plerona.com" className="font-semibold text-blue hover:text-blue-hover">
              contact@plerona.com
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
