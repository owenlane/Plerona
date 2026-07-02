'use client';

import { ADDITIONAL_CONNECTION, MONEY } from '@/lib/pricing';

interface Props {
  value: number;
  onAdd: () => void;
  onRemove: () => void;
  surface?: 'light' | 'dark';
}

export default function ConnectionStepper({ value, onAdd, onRemove, surface = 'light' }: Props) {
  const dark = surface === 'dark';
  const text = dark ? 'text-white' : 'text-snow';
  const sub = dark ? 'text-silver' : 'text-graymid';
  const btn = dark
    ? 'border-white/25 text-white hover:bg-white/10'
    : 'border-snow/15 text-snow hover:bg-snow/[0.06]';

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold ${text}`}>Additional connections</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onRemove}
            disabled={value === 0}
            aria-label="Remove a connection"
            className={`flex h-12 w-12 items-center justify-center border text-xl transition-colors disabled:opacity-30 ${btn} rounded-[2px]`}
          >
            −
          </button>
          <span
            className={`w-12 text-center text-lg font-bold tabular-nums ${text}`}
            aria-live="polite"
          >
            {value}
          </span>
          <button
            type="button"
            onClick={onAdd}
            aria-label="Add a connection"
            className={`flex h-12 w-12 items-center justify-center border text-xl transition-colors ${btn} rounded-[2px]`}
          >
            +
          </button>
        </div>
      </div>
      <p className={`mt-2 text-xs ${sub}`}>
        {ADDITIONAL_CONNECTION.label}: +{MONEY(ADDITIONAL_CONNECTION.pricePerConnection)}
      </p>
    </div>
  );
}
