'use client';

import { IMPLEMENTATION, MONEY } from '@/lib/pricing';
import { useImplementationConfig } from '@/lib/useImplementationConfig';
import ConnectionStepper from './ConnectionStepper';
import HostingSelector from './HostingSelector';
import OrderSummary from './OrderSummary';

export default function ImplementationConfigurator() {
  const cfg = useImplementationConfig();

  return (
    <div className="grid grid-cols-1 gap-10 pb-24 lg:grid-cols-[1fr_360px] lg:pb-0">
      {/* Configuration column */}
      <div className="space-y-8">
        {/* Base package — non-deselectable */}
        <div className="rounded-[2px] border border-rule bg-surface p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow tracking-eyebrow">Base package</p>
              <h3 className="mt-2 text-lg font-bold tracking-tight">{IMPLEMENTATION.name}</h3>
              <p className="mt-1 text-sm text-graymid">
                Includes {IMPLEMENTATION.baseConnections} connections + all base deliverables.
              </p>
            </div>
            <p className="text-xl font-bold tabular-nums">{MONEY(IMPLEMENTATION.basePrice)}</p>
          </div>
        </div>

        {/* Connections */}
        <div className="rounded-[2px] border border-rule bg-surface p-6">
          <ConnectionStepper
            value={cfg.config.additionalConnections}
            onAdd={cfg.addConnection}
            onRemove={cfg.removeConnection}
          />
        </div>

        {/* Hosting */}
        <div className="rounded-[2px] border border-rule bg-surface p-6">
          <HostingSelector selected={cfg.config.hosting} onSelect={cfg.setHosting} />
        </div>
      </div>

      {/* Persistent summary */}
      <OrderSummary
        breakdown={cfg.breakdown}
        animatedToday={cfg.animatedToday}
        ctaLabel="Proceed to Checkout"
        ctaHref={`/checkout${cfg.queryString}`}
      />
    </div>
  );
}
