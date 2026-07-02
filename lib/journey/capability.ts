/**
 * Focused Mode engagement rules — Constitution Part III, Article 10.2 and
 * Part V, Article 6. Focused Mode engages automatically when WebGL is
 * unavailable, device capability is insufficient, reduced motion is
 * preferred, or the frame-rate budget cannot be sustained at minimum quality.
 */

export type JourneyMode = '3d' | 'focused';

export const MODE_STORAGE_KEY = 'plerona-journey-mode';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isNarrowViewport(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(max-width: 767px)').matches;
}

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

function deviceCapable(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const memoryOk = nav.deviceMemory === undefined || nav.deviceMemory >= 4;
  const coresOk =
    navigator.hardwareConcurrency === undefined || navigator.hardwareConcurrency >= 4;
  // Touch devices with constrained memory/cores go straight to Focused Mode.
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch && !(memoryOk && coresOk)) return false;
  return true;
}

/** Initial mode decision on the client. User preference (toggle) wins. */
export function detectInitialMode(): JourneyMode {
  try {
    const saved = window.localStorage.getItem(MODE_STORAGE_KEY);
    if (saved === 'focused') return 'focused';
    if (saved === '3d') {
      // Even an explicit 3D preference cannot override hard incapability.
      return webglAvailable() ? '3d' : 'focused';
    }
  } catch {
    /* storage unavailable — fall through to detection */
  }
  if (prefersReducedMotion()) return 'focused';
  if (!webglAvailable()) return 'focused';
  if (!deviceCapable()) return 'focused';
  return '3d';
}

export function persistMode(mode: JourneyMode): void {
  try {
    window.localStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {
    /* non-fatal */
  }
}

/** Frame-rate floors (Part V, Article 5.1). */
export function fpsFloor(): number {
  return isNarrowViewport() || window.matchMedia('(pointer: coarse)').matches ? 45 : 50;
}

/** Adaptive DPR ladder (Part V, Article 6.1): step down before falling back. */
export const DPR_LADDER = [1.75, 1.4, 1.1, 0.85];

export function initialDprIndex(): number {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  return coarse ? 2 : 0;
}
