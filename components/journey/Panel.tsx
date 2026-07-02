'use client';

/**
 * Panel — Constitution Part IV, Article 8.
 * The sole surface for textual information within the world: DOM-based,
 * holographic in aesthetic, readable at all times, never occluded by the 3D
 * layer (rendered above the canvas in normal document flow). States: default,
 * expanded, focused. Progressive disclosure (Part III, Art. 7.3) is built in
 * via the `disclosure` prop for sections beyond 400 words.
 */
import { useId, useState, type ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
  /** Optional collapsed-by-default long content, expanded in place. */
  disclosure?: { label: string; content: ReactNode };
  className?: string;
  /** Wider panels for dense components (tables, configurators). */
  width?: 'reading' | 'wide' | 'full';
}

const WIDTHS: Record<NonNullable<PanelProps['width']>, string> = {
  reading: 'max-w-3xl',
  wide: 'max-w-5xl',
  full: 'max-w-container',
};

export default function Panel({ children, disclosure, className = '', width = 'wide' }: PanelProps) {
  const [expanded, setExpanded] = useState(false);
  const regionId = useId();

  return (
    <div
      data-panel
      data-state={expanded ? 'expanded' : 'default'}
      className={`panel-holo relative mx-auto w-full ${WIDTHS[width]} rounded-lg ${className}`}
    >
      {children}

      {disclosure && (
        <div className="mt-6">
          <div
            id={regionId}
            role="region"
            hidden={!expanded}
            className="panel-disclosure space-y-6"
          >
            {disclosure.content}
          </div>
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={regionId}
            onClick={() => setExpanded((v) => !v)}
            className="mt-4 inline-flex items-center gap-2 rounded-sm border border-beam/40 px-4 py-2 text-sm font-semibold text-beam transition-colors duration-base ease-cinematic hover:bg-beam-wash"
          >
            {expanded ? 'Show less' : disclosure.label}
            <span aria-hidden="true">{expanded ? '↑' : '↓'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
