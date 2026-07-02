'use client';

import { useState } from 'react';
import { CONSULT, IMPLEMENTATION, MONEY } from '@/lib/pricing';

const DIMENSIONS = ['Best for', 'What you receive', 'Timeline', 'Investment', 'Outcome'] as const;

const CELLS: Record<(typeof DIMENSIONS)[number], [string, string]> = {
  'Best for': [
    'Operators who need clarity before committing to a full build.',
    'Operators ready to deploy connected AI infrastructure now.',
  ],
  'What you receive': [
    'Strategic analysis, operational audit, and a prioritized infrastructure roadmap.',
    'A built, connected system: connections, prompt libraries, agent teams, and full handoff.',
  ],
  Timeline: [CONSULT.delivery, IMPLEMENTATION.delivery],
  Investment: [MONEY(CONSULT.price), `From ${MONEY(IMPLEMENTATION.basePrice)}`],
  Outcome: [
    'A documented plan you own — and confidence in the next step.',
    'An operational infrastructure your business runs independently.',
  ],
};

export default function ComparisonTable() {
  const [col, setCol] = useState<0 | 1>(1);

  return (
    <div>
      {/* Mobile tab switch */}
      <div className="mb-6 inline-flex rounded-[2px] border border-rule p-1 lg:hidden">
        <button
          type="button"
          onClick={() => setCol(0)}
          className={`px-4 py-2 text-sm font-medium ${col === 0 ? 'bg-ink text-white' : 'text-graymid'}`}
        >
          {CONSULT.name}
        </button>
        <button
          type="button"
          onClick={() => setCol(1)}
          className={`px-4 py-2 text-sm font-medium ${col === 1 ? 'bg-blue text-space' : 'text-graymid'}`}
        >
          Implementation
        </button>
      </div>

      {/* Desktop: two columns side by side */}
      <div className="hidden grid-cols-[200px_1fr_1fr] overflow-hidden rounded-[2px] border border-rule lg:grid">
        <div className="bg-offwhite" />
        <div className="border-l border-rule bg-offwhite p-5">
          <p className="text-eyebrow font-semibold uppercase tracking-eyebrow text-graymid">Entry</p>
          <p className="mt-1 text-lg font-bold tracking-tight">{CONSULT.name}</p>
        </div>
        <div className="border-l-2 border-blue bg-blue/5 p-5">
          <p className="text-eyebrow font-semibold uppercase tracking-eyebrow text-blue">Flagship</p>
          <p className="mt-1 text-lg font-bold tracking-tight">{IMPLEMENTATION.name}</p>
        </div>

        {DIMENSIONS.map((dim) => (
          <div key={dim} className="contents">
            <div className="border-t border-rule p-5 text-sm font-semibold">{dim}</div>
            <div className="border-l border-t border-rule p-5 text-sm leading-[1.6] text-graymid">
              {CELLS[dim][0]}
            </div>
            <div className="border-l-2 border-t border-blue/40 bg-blue/[0.03] p-5 text-sm leading-[1.6] text-snow">
              {CELLS[dim][1]}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: single column */}
      <div className="overflow-hidden rounded-[2px] border border-rule lg:hidden">
        {DIMENSIONS.map((dim) => (
          <div key={dim} className="border-t border-rule first:border-t-0">
            <div className="bg-offwhite px-5 py-3 text-sm font-semibold">{dim}</div>
            <div className="px-5 py-4 text-sm leading-[1.6] text-graymid">{CELLS[dim][col]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
