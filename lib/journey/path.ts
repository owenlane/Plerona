/**
 * Journey path (3D side) — three.js splines built from the same Scene-Graph
 * STOPS the DOM layer uses (lib/journey/graph.ts). Imported only inside the
 * lazy WorldCanvas chunk so three.js stays out of the first load.
 */
import * as THREE from 'three';
import { STOPS } from '@/lib/journey/graph';

export { LOCATIONS, WORLD, LOCATION_ANCHORS, SECTION_WEIGHTS } from '@/lib/journey/graph';

export const cameraCurve = new THREE.CatmullRomCurve3(
  STOPS.map((s) => new THREE.Vector3(...s.point)),
  false,
  'centripetal',
);
export const lookCurve = new THREE.CatmullRomCurve3(
  STOPS.map((s) => new THREE.Vector3(...s.look)),
  false,
  'centripetal',
);
