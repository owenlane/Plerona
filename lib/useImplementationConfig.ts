'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  computePrice,
  type HostingId,
  type ImplementationConfig,
  type PriceBreakdown,
} from './pricing';

export interface UseImplementationConfig {
  config: ImplementationConfig;
  breakdown: PriceBreakdown;
  /** Today's total, animated digit-by-digit toward the real value (A06). */
  animatedToday: number;
  addConnection: () => void;
  removeConnection: () => void;
  setHosting: (id: HostingId) => void;
  queryString: string;
}

export function useImplementationConfig(
  initial?: Partial<ImplementationConfig>,
): UseImplementationConfig {
  const [config, setConfig] = useState<ImplementationConfig>({
    additionalConnections: initial?.additionalConnections ?? 0,
    hosting: initial?.hosting ?? null,
  });

  const breakdown = useMemo(() => computePrice(config), [config]);

  // Animated total (300ms ease-out) — A06 price counter.
  const [animatedToday, setAnimatedToday] = useState(breakdown.todayTotal);
  const fromRef = useRef(breakdown.todayTotal);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const target = breakdown.todayTotal;
    const start = fromRef.current;
    if (start === target) return;
    const duration = 300;
    const t0 = performance.now();
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const value = start + (target - start) * easeOut(p);
      setAnimatedToday(value);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [breakdown.todayTotal]);

  const addConnection = useCallback(
    () => setConfig((c) => ({ ...c, additionalConnections: c.additionalConnections + 1 })),
    [],
  );
  const removeConnection = useCallback(
    () =>
      setConfig((c) => ({ ...c, additionalConnections: Math.max(0, c.additionalConnections - 1) })),
    [],
  );
  const setHosting = useCallback(
    (id: HostingId) => setConfig((c) => ({ ...c, hosting: c.hosting === id ? null : id })),
    [],
  );

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (config.additionalConnections > 0)
      params.set('connections', String(config.additionalConnections));
    if (config.hosting) params.set('hosting', config.hosting);
    const s = params.toString();
    return s ? `?${s}` : '';
  }, [config]);

  return {
    config,
    breakdown,
    animatedToday,
    addConnection,
    removeConnection,
    setHosting,
    queryString,
  };
}
