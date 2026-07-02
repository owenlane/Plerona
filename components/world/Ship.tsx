'use client';

/**
 * The Ship — Constitution Part II, Articles 2–3.
 * The single O-shaped Plerona craft: simultaneously the company logo and the
 * vessel of the experience. The Beam runs horizontally across its front as
 * the strut spanning the O, and the Wordmark's glowing lettering is the
 * actual light source. All materials trace to the Design Tokens (Part IV,
 * Art. 1.3). Geometry is fully procedural and static — no continuous
 * animation (Part VII, Art. 5).
 */
import { useMemo } from 'react';
import * as THREE from 'three';
import { WORLD, LOCATIONS } from '@/lib/journey/path';
import { createWordmarkTexture, createGlowTexture } from './textures';

const T = {
  beam: '#E8C670',
  spaceDeep: '#0B0F1A',
  panel: '#1A1F2E',
  snow: '#F5F7FA',
};

const R = WORLD.shipRadius; // 15
const TUBE = WORLD.shipTube; // 4.5
const STRUT = WORLD.beamStrut; // half-length 15, 4.4 × 4.4

function Greebles() {
  const { positions, quaternions } = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const quaternions: THREE.Quaternion[] = [];
    const up = new THREE.Vector3(0, 0, 1);
    for (let i = 0; i < 56; i += 1) {
      const angle = (i / 56) * Math.PI * 2 + 0.05;
      // Skip the strut junctions so pods read cleanly.
      if (Math.abs(Math.cos(angle)) > 0.985) continue;
      const radial = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
      positions.push(radial.clone().multiplyScalar(R + TUBE * 0.92));
      const q = new THREE.Quaternion().setFromUnitVectors(up, radial);
      quaternions.push(q);
    }
    return { positions, quaternions };
  }, []);

  return (
    <group>
      {positions.map((p, i) => (
        <mesh key={i} position={p} quaternion={quaternions[i]}>
          <boxGeometry args={[i % 3 === 0 ? 1.6 : 0.9, 0.7, i % 4 === 0 ? 1.4 : 0.7]} />
          <meshStandardMaterial color={T.panel} metalness={0.8} roughness={0.45} />
        </mesh>
      ))}
    </group>
  );
}

function Engines() {
  const glow = useMemo(() => createGlowTexture(T.beam), []);
  const angles = [-2.4, -1.9, -1.25, -0.6, 0.6, 1.25, 1.9, 2.4].map((a) => a + Math.PI / 2);
  return (
    <group>
      {angles.map((a, i) => {
        const x = Math.cos(a) * R;
        const y = Math.sin(a) * R;
        return (
          <group key={i} position={[x, y, -TUBE - 0.6]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.9, 1.25, 1.8, 16]} />
              <meshStandardMaterial color={T.panel} metalness={0.85} roughness={0.35} />
            </mesh>
            <mesh position={[0, 0, -1.0]}>
              <circleGeometry args={[0.8, 20]} />
              <meshBasicMaterial color={T.beam} />
            </mesh>
            <sprite position={[0, 0, -1.7]} scale={[4.2, 4.2, 1]}>
              <spriteMaterial
                map={glow}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.8}
              />
            </sprite>
          </group>
        );
      })}
    </group>
  );
}

/** Gallery pods bulging along the Beam strut — one per interior Room. */
function StationPods() {
  const stations = LOCATIONS.filter((l) => l.flags?.interior);
  return (
    <group>
      {stations.map((s) => {
        const x = s.camera[0];
        const isCaptains = Boolean(s.flags?.commandSphere);
        const r = isCaptains ? 5.6 : 3.15;
        return (
          <group key={s.id} position={[x, 0, 0]}>
            <mesh>
              <sphereGeometry args={[r, isCaptains ? 40 : 28, isCaptains ? 28 : 20]} />
              <meshStandardMaterial color={T.panel} metalness={0.82} roughness={0.4} />
            </mesh>
            {/* Equatorial window band — lit from within */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[r * 0.99, 0.07, 8, 48]} />
              <meshBasicMaterial color={T.beam} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function BeamAndWordmark() {
  const wordmark = useMemo(() => createWordmarkTexture(), []);
  const glow = useMemo(() => createGlowTexture(T.beam), []);
  const frontZ = STRUT.depth / 2 + 0.02;

  return (
    <group>
      {/* The strut spanning the O — houses the interior gallery */}
      <mesh>
        <boxGeometry args={[STRUT.halfLength * 2 + 1.2, STRUT.height, STRUT.depth]} />
        <meshStandardMaterial color={T.panel} metalness={0.85} roughness={0.38} />
      </mesh>

      {/* The Beam: hot light band across the front (Part II, Art. 3.1) */}
      <mesh position={[0, -STRUT.height * 0.28, frontZ]}>
        <planeGeometry args={[STRUT.halfLength * 2 + 1.1, 0.55]} />
        <meshBasicMaterial color={T.beam} toneMapped={false} />
      </mesh>

      {/* The Wordmark: glowing lettering integrated into the Beam — the
          actual light source (Part II, Art. 3.2) */}
      <mesh position={[0, STRUT.height * 0.12, frontZ + 0.03]}>
        <planeGeometry args={[24, 3.75]} />
        <meshBasicMaterial
          map={wordmark}
          transparent
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      {/* Wide additive halo so the front reads as headlights */}
      <sprite position={[0, 0, frontZ + 0.6]} scale={[46, 11, 1]}>
        <spriteMaterial
          map={glow}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.5}
        />
      </sprite>

      {/* The Wordmark literally lights the scene */}
      <pointLight position={[0, 0, frontZ + 4]} color={T.beam} intensity={210} distance={70} decay={1.7} />
    </group>
  );
}

export default function Ship() {
  return (
    <group>
      {/* O-shaped hull */}
      <mesh>
        <torusGeometry args={[R, TUBE, 26, 100]} />
        <meshStandardMaterial color={T.panel} metalness={0.86} roughness={0.42} />
      </mesh>

      {/* Front accent ring tracing the O */}
      <mesh position={[0, 0, TUBE * 0.86]}>
        <torusGeometry args={[R, 0.09, 8, 100]} />
        <meshBasicMaterial color={T.beam} />
      </mesh>

      {/* Docking collars where the Journey enters/exits the gallery */}
      {[R, -R].map((x) => (
        <mesh key={x} position={[x > 0 ? R + 1.2 : -R - 1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[2.15, 2.15, 2.6, 20, 1, true]} />
          <meshStandardMaterial color={T.panel} metalness={0.85} roughness={0.35} side={THREE.DoubleSide} />
        </mesh>
      ))}

      <BeamAndWordmark />
      <StationPods />
      <Greebles />
      <Engines />

      {/* Comms antenna — the Transmission Deck's focal mast */}
      <group position={[0, R + TUBE - 0.4, 0]}>
        <mesh position={[0, 2.6, 0]}>
          <cylinderGeometry args={[0.12, 0.22, 5.2, 10]} />
          <meshStandardMaterial color={T.panel} metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0, 5.4, 0]}>
          <sphereGeometry args={[0.42, 14, 12]} />
          <meshBasicMaterial color={T.beam} />
        </mesh>
      </group>
    </group>
  );
}
