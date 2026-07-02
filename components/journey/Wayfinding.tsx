'use client';

/**
 * Wayfinding — Constitution Part III, Article 9.
 * MiniMap: an always-available toggle showing every Location, the visitor's
 * current position, and one-press travel. TravelControls: dedicated travel
 * buttons (Interaction Matrix, Art. 6.1) complementing native scroll and
 * arrow keys. Everything is keyboard operable with visible focus states.
 */
import { useEffect, useRef, useState } from 'react';
import { LOCATIONS } from '@/lib/journey/graph';
import { useJourney } from './JourneyProvider';

export function MiniMap() {
  const { activeId, travelTo } = useJourney();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="fixed bottom-5 left-4 z-40 md:bottom-6 md:left-6">
      {open && (
        <div
          ref={panelRef}
          role="navigation"
          aria-label="World map"
          className="panel-holo mb-3 w-64 rounded-md p-4"
        >
          <p className="mb-3 text-eyebrow font-semibold uppercase tracking-eyebrow text-mist">
            The Journey
          </p>
          <ol className="space-y-1">
            {LOCATIONS.map((loc, i) => {
              const active = loc.id === activeId;
              return (
                <li key={loc.id}>
                  <button
                    type="button"
                    onClick={() => {
                      travelTo(loc.id);
                      setOpen(false);
                    }}
                    aria-current={active ? 'location' : undefined}
                    className={`flex w-full items-center gap-3 rounded-sm px-2 py-1.5 text-left text-sm transition-colors duration-fast ${
                      active
                        ? 'bg-beam-wash font-semibold text-beam'
                        : 'text-mist hover:bg-snow/[0.05] hover:text-snow'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`inline-block h-1.5 w-1.5 rounded-full ${
                        active ? 'bg-beam' : 'bg-mist/50'
                      }`}
                    />
                    <span className="flex-1">{loc.name}</span>
                    <span className="text-[10px] uppercase tracking-wider text-mist/70">
                      {loc.type === 'room' ? 'Room' : 'View'}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close world map' : 'Open world map'}
        className="flex h-11 items-center gap-2 rounded-md border border-rule bg-panel/90 px-4 text-sm font-semibold text-snow shadow-panel backdrop-blur-sm transition-colors duration-base ease-cinematic hover:border-beam/50 hover:text-beam"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3.5 12h17" />
        </svg>
        Map
      </button>
    </div>
  );
}

export function TravelControls() {
  const { travelStep, activeId } = useJourney();
  const idx = LOCATIONS.findIndex((l) => l.id === activeId);

  return (
    <div
      className="fixed bottom-5 right-4 z-40 flex flex-col gap-2 md:bottom-6 md:right-6"
      role="group"
      aria-label="Travel controls"
    >
      <button
        type="button"
        onClick={() => travelStep(-1)}
        disabled={idx <= 0}
        aria-label="Travel to previous location"
        className="flex h-11 w-11 items-center justify-center rounded-md border border-rule bg-panel/90 text-snow shadow-panel backdrop-blur-sm transition-colors duration-base ease-cinematic hover:border-beam/50 hover:text-beam disabled:opacity-35 disabled:hover:border-rule disabled:hover:text-snow"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => travelStep(1)}
        disabled={idx >= LOCATIONS.length - 1}
        aria-label="Travel to next location"
        className="flex h-11 w-11 items-center justify-center rounded-md border border-rule bg-panel/90 text-snow shadow-panel backdrop-blur-sm transition-colors duration-base ease-cinematic hover:border-beam/50 hover:text-beam disabled:opacity-35 disabled:hover:border-rule disabled:hover:text-snow"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
