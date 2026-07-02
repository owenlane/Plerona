'use client';

/**
 * LocationSection — one navigable Location of the Journey (Part III, Art. 3).
 * In 3D mode the section's height is proportioned to its leg of the camera
 * path (scroll distance ≈ travel distance) and its Panel rides a sticky
 * viewport while the world moves behind it. In Focused Mode it collapses to a
 * calm, complete 2D museum section. Native scroll only — no capture.
 */
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { LOCATIONS, SECTION_WEIGHTS } from '@/lib/journey/graph';
import { useJourney } from './JourneyProvider';

interface LocationSectionProps {
  id: string;
  children: ReactNode;
}

const TOTAL_TRAVEL_VH = 1350; // combined journey scroll length in 3D mode

export default function LocationSection({ id, children }: LocationSectionProps) {
  const { setActiveId, mode } = useJourney();
  const ref = useRef<HTMLElement>(null);
  const index = LOCATIONS.findIndex((l) => l.id === id);
  const loc = LOCATIONS[index];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(id);
            el.setAttribute('data-inview', 'true');
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [id, setActiveId]);

  const heightVh = Math.round(SECTION_WEIGHTS[index] * TOTAL_TRAVEL_VH);

  return (
    <section
      ref={ref}
      id={id}
      aria-label={loc?.name}
      data-location-type={loc?.type}
      className="journey-section relative"
      style={
        mode === '3d'
          ? ({ '--section-vh': Math.max(heightVh, 110) } as CSSProperties)
          : undefined
      }
    >
      <div className="journey-viewport">
        <div className="container-px w-full py-16 md:py-20">
          <p className="mb-5 flex items-center gap-3 text-eyebrow font-semibold uppercase tracking-eyebrow text-beam">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-beam/60" />
            <span
              data-location-heading
              tabIndex={-1}
              className="outline-none"
            >
              {loc?.type === 'room' ? 'Room' : 'Viewpoint'} · {loc?.name}
            </span>
          </p>
          {children}
        </div>
      </div>
    </section>
  );
}
