'use client';

import { HOSTING_NOTE, HOSTING_TIERS, MONEY, type HostingId } from '@/lib/pricing';

interface Props {
  selected: HostingId | null;
  onSelect: (id: HostingId) => void;
  surface?: 'light' | 'dark';
}

export default function HostingSelector({ selected, onSelect, surface = 'light' }: Props) {
  const dark = surface === 'dark';

  return (
    <div>
      <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-ink'}`}>
        Monthly hosting <span className="font-normal text-graymid">(optional)</span>
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {HOSTING_TIERS.map((tier) => {
          const active = selected === tier.id;
          const baseCard = dark ? 'bg-white/[0.03] text-white' : 'bg-white text-ink';
          const border = active
            ? 'border-blue bg-blue-wash text-ink'
            : dark
              ? 'border-white/15'
              : 'border-rule';
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => onSelect(tier.id)}
              aria-pressed={active}
              className={`flex flex-col rounded-[2px] border p-4 text-left transition-colors duration-200 ${baseCard} ${border}`}
            >
              <span className="text-sm font-semibold">{tier.name}</span>
              <span className={`mt-1 text-base font-bold ${active ? 'text-blue' : ''}`}>
                {MONEY(tier.pricePerMonth)}
                <span className="text-xs font-normal text-graymid">/mo</span>
              </span>
              <span
                className={`mt-2 text-xs leading-relaxed ${active ? 'text-ink/70' : 'text-graymid'}`}
              >
                {tier.description}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-graymid">{HOSTING_NOTE}</p>
    </div>
  );
}
