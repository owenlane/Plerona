'use client';

import { useState } from 'react';

interface Props {
  name: string;
  role: string;
  /**
   * Path to the founder photograph. Drop a file at /public/founder.jpg
   * (or pass another path) and it renders automatically. Until a real
   * photograph is supplied, an editorial monogram frame is shown so the
   * page never ships with a broken image.
   *
   * §10 requires a photograph — replace the fallback by adding the asset.
   */
  src?: string;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function FounderPortrait({ name, role, src = '/founder.jpg' }: Props) {
  const [failed, setFailed] = useState(false);
  const showPhoto = src && !failed;

  return (
    <figure>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] border border-rule bg-ink">
        {showPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={`${name}, ${role}`}
            className="h-full w-full object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-white">
            <span className="text-5xl font-bold tracking-tighter2 text-white/90">
              {initials(name)}
            </span>
            <span className="mt-4 h-px w-10 bg-blue" />
            <span className="mt-4 px-6 text-center text-[11px] uppercase tracking-eyebrow text-silver">
              Portrait
            </span>
          </div>
        )}
      </div>
      <figcaption className="mt-4">
        <p className="text-base font-semibold tracking-tight">{name}</p>
        <p className="mt-0.5 text-sm text-graymid">{role}</p>
      </figcaption>
    </figure>
  );
}
