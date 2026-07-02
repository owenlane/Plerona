'use client';

/**
 * Journey orchestration — Constitution Part III.
 * Owns: 3D/Focused mode (Art. 10), the active Location for wayfinding
 * (Art. 9.1), polite screen-reader announcements on Location entry, and the
 * shared registry that MiniMap / TravelControls / CameraRig consume.
 * Scroll remains fully native — the Journey's single Travel Zone maps native
 * scroll to camera travel, so keyboard, touch, and assistive tech all work
 * with zero scroll capture (Part V, Article 4).
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { LOCATIONS } from '@/lib/journey/graph';
import {
  detectInitialMode,
  persistMode,
  prefersReducedMotion,
  type JourneyMode,
} from '@/lib/journey/capability';

interface JourneyContextValue {
  mode: JourneyMode;
  /** true once client detection has run (prevents hydration mismatch) */
  ready: boolean;
  setMode: (mode: JourneyMode, persist?: boolean) => void;
  activeId: string;
  setActiveId: (id: string) => void;
  travelTo: (id: string) => void;
  travelStep: (direction: 1 | -1) => void;
}

const JourneyContext = createContext<JourneyContextValue | null>(null);

export function useJourney(): JourneyContextValue {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error('useJourney must be used within JourneyProvider');
  return ctx;
}

export default function JourneyProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<JourneyMode>('focused'); // SSR-safe default
  const [ready, setReady] = useState(false);
  const [activeId, setActiveId] = useState<string>(LOCATIONS[0].id);
  const announceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setModeState(detectInitialMode());
    setReady(true);
  }, []);

  const setMode = useCallback((next: JourneyMode, persist = true) => {
    setModeState(next);
    if (persist) persistMode(next);
  }, []);

  // Polite wayfinding announcement on Location entry (Part III, Art. 6/9).
  useEffect(() => {
    const loc = LOCATIONS.find((l) => l.id === activeId);
    if (loc && announceRef.current) {
      announceRef.current.textContent = `Now at: ${loc.name}`;
    }
  }, [activeId]);

  const travelTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';
    el.scrollIntoView({ behavior, block: 'start' });
    // Move focus for keyboard/screen-reader continuity.
    const heading = el.querySelector<HTMLElement>('[data-location-heading]');
    heading?.focus({ preventScroll: true });
  }, []);

  const travelStep = useCallback(
    (direction: 1 | -1) => {
      const idx = LOCATIONS.findIndex((l) => l.id === activeId);
      const next = LOCATIONS[Math.min(LOCATIONS.length - 1, Math.max(0, idx + direction))];
      if (next && next.id !== activeId) travelTo(next.id);
    },
    [activeId, travelTo],
  );

  const value = useMemo(
    () => ({ mode, ready, setMode, activeId, setActiveId, travelTo, travelStep }),
    [mode, ready, setMode, activeId, travelTo, travelStep],
  );

  return (
    <JourneyContext.Provider value={value}>
      <div data-journey-mode={ready ? mode : 'focused'}>
        {/* Screen-reader wayfinding channel */}
        <div ref={announceRef} aria-live="polite" className="sr-only" />
        {children}
      </div>
    </JourneyContext.Provider>
  );
}
