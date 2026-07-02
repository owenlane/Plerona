'use client';

/**
 * JourneyShell — assembles the Journey for the homepage: provider, the lazy
 * 3D world (only when capable and chosen), and permanent wayfinding. The
 * header's Focused Mode toggle lives outside this tree, so mode changes
 * arrive via a window event.
 */
import dynamic from 'next/dynamic';
import { useCallback, useEffect, type ReactNode } from 'react';
import JourneyProvider, { useJourney } from './JourneyProvider';
import { MiniMap, TravelControls } from './Wayfinding';
import SafeCanvasBoundary from '@/components/SafeCanvasBoundary';
import JourneyErrorBoundary from './JourneyErrorBoundary';
import { persistMode, type JourneyMode } from '@/lib/journey/capability';

const WorldCanvas = dynamic(() => import('@/components/world/WorldCanvas'), {
  ssr: false,
  loading: () => null,
});

export const MODE_EVENT = 'plerona-mode-change';

function ShellInner({ children }: { children: ReactNode }) {
  const { mode, ready, setMode } = useJourney();

  const engageFocused = useCallback(() => {
    setMode('focused', false); // automatic fallback never overwrites preference
  }, [setMode]);

  // Header toggle → mode change (event carries the persisted choice).
  useEffect(() => {
    const onModeEvent = (e: Event) => {
      const detail = (e as CustomEvent<JourneyMode>).detail;
      if (detail === '3d' || detail === 'focused') setMode(detail, false);
    };
    window.addEventListener(MODE_EVENT, onModeEvent);
    return () => window.removeEventListener(MODE_EVENT, onModeEvent);
  }, [setMode]);

  return (
    <JourneyErrorBoundary onRecover={engageFocused}>
      {ready && mode === '3d' && (
        <SafeCanvasBoundary onError={engageFocused}>
          <WorldCanvas onFallback={engageFocused} />
        </SafeCanvasBoundary>
      )}
      <div id="journey-root" className="relative z-10">
        {children}
      </div>
      <MiniMap />
      <TravelControls />
    </JourneyErrorBoundary>
  );
}

export default function JourneyShell({ children }: { children: ReactNode }) {
  return (
    <JourneyProvider>
      <ShellInner>{children}</ShellInner>
    </JourneyProvider>
  );
}

/** Dispatch helper for the header toggle (outside the provider tree). */
export function dispatchModeChange(mode: JourneyMode): void {
  persistMode(mode);
  window.dispatchEvent(new CustomEvent(MODE_EVENT, { detail: mode }));
}
