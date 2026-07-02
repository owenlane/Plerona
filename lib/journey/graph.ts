/**
 * Scene-Graph geometry (pure TypeScript — no three.js) so the DOM layer can
 * consume Location anchors and section weights without pulling the 3D engine
 * into the first-load bundle (Part V, Art. 5 bundle budget). CameraRig builds
 * its three.js curves from the same STOPS in lib/journey/path.ts.
 */
import sceneGraph from '@/lib/scene-graph.json';

export interface LocationDef {
  id: string;
  name: string;
  type: 'viewpoint' | 'room';
  travelZone: boolean;
  sectionAssignment: string;
  founderAssigned: boolean;
  camera: [number, number, number];
  look: [number, number, number];
  flags: Record<string, boolean>;
}

export const LOCATIONS = sceneGraph.locations as LocationDef[];
export const WORLD = sceneGraph.world;

export interface PathStop {
  point: [number, number, number];
  look: [number, number, number];
  locationId: string | null;
}

export const STOPS: PathStop[] = (() => {
  const stops: PathStop[] = [];
  const transits = sceneGraph.transitPoints as Array<{
    after: string;
    camera: [number, number, number];
    look: [number, number, number];
  }>;
  for (const loc of LOCATIONS) {
    stops.push({ point: loc.camera, look: loc.look, locationId: loc.id });
    for (const t of transits.filter((tp) => tp.after === loc.id)) {
      stops.push({ point: t.camera, look: t.look, locationId: null });
    }
  }
  return stops;
})();

type V3 = [number, number, number];

/** Centripetal Catmull-Rom evaluation matching three.js' implementation. */
function crPoint(points: V3[], t: number): V3 {
  const n = points.length;
  const p = (n - 1) * t;
  let i = Math.floor(p);
  let w = p - i;
  if (i >= n - 1) {
    i = n - 2;
    w = 1;
  }
  const p0 = points[Math.max(0, i - 1)];
  const p1 = points[i];
  const p2 = points[i + 1];
  const p3 = points[Math.min(n - 1, i + 2)];

  const alpha = 0.5; // centripetal
  const dist = (a: V3, b: V3) =>
    Math.pow(
      Math.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2 + (b[2] - a[2]) ** 2),
      alpha,
    ) || 1e-4;

  const dt0 = dist(p0, p1);
  const dt1 = dist(p1, p2);
  const dt2 = dist(p2, p3);

  const out: V3 = [0, 0, 0];
  for (let axis = 0; axis < 3; axis += 1) {
    const t0 = ((p1[axis] - p0[axis]) / dt0 - (p2[axis] - p0[axis]) / (dt0 + dt1) + (p2[axis] - p1[axis]) / dt1) * dt1;
    const t1 = ((p2[axis] - p1[axis]) / dt1 - (p3[axis] - p1[axis]) / (dt1 + dt2) + (p3[axis] - p2[axis]) / dt2) * dt1;
    const x0 = p1[axis];
    const x1 = p2[axis];
    const w2 = w * w;
    const w3 = w2 * w;
    out[axis] =
      (2 * x0 - 2 * x1 + t0 + t1) * w3 + (-3 * x0 + 3 * x1 - 2 * t0 - t1) * w2 + t0 * w + x0;
  }
  return out;
}

const DIVISIONS = 400;

const LENGTHS: number[] = (() => {
  const pts: V3[] = STOPS.map((s) => s.point);
  const lengths = [0];
  let prev = crPoint(pts, 0);
  for (let d = 1; d <= DIVISIONS; d += 1) {
    const cur = crPoint(pts, d / DIVISIONS);
    const seg = Math.sqrt(
      (cur[0] - prev[0]) ** 2 + (cur[1] - prev[1]) ** 2 + (cur[2] - prev[2]) ** 2,
    );
    lengths.push(lengths[d - 1] + seg);
    prev = cur;
  }
  return lengths;
})();

/** Arc-length scroll anchor (0..1) for each Location's stop on the path. */
export const LOCATION_ANCHORS: Record<string, number> = (() => {
  const anchors: Record<string, number> = {};
  const total = LENGTHS[LENGTHS.length - 1];
  const n = STOPS.length;
  for (let i = 0; i < n; i += 1) {
    const stop = STOPS[i];
    if (!stop.locationId) continue;
    const t = n === 1 ? 0 : i / (n - 1);
    const targetLen = t * total;
    let u = t;
    for (let j = 1; j < LENGTHS.length; j += 1) {
      if (LENGTHS[j] >= targetLen) {
        const seg = LENGTHS[j] - LENGTHS[j - 1] || 1;
        u = (j - 1 + (targetLen - LENGTHS[j - 1]) / seg) / DIVISIONS;
        break;
      }
    }
    anchors[stop.locationId] = Math.min(1, Math.max(0, u));
  }
  return anchors;
})();

/** Relative section heights so scroll distance ≈ travel distance per leg. */
export const SECTION_WEIGHTS: number[] = (() => {
  const ids = LOCATIONS.map((l) => l.id);
  const weights: number[] = [];
  for (let i = 0; i < ids.length; i += 1) {
    const here = LOCATION_ANCHORS[ids[i]];
    const next = i + 1 < ids.length ? LOCATION_ANCHORS[ids[i + 1]] : 1 + (1 - here) * 0.2;
    weights.push(Math.max(0.06, next - here));
  }
  const sum = weights.reduce((a, b) => a + b, 0);
  return weights.map((w) => w / sum);
})();
