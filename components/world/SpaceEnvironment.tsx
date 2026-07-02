'use client';

/**
 * The universe — Constitution Part II, Article 1.
 * A vast setting with distant spaceship-style cities and worlds rendered
 * soft-focus and atmospheric: beautiful, visible, remote. Everything is
 * static — stars do not twinkle, nothing loops (Part VII, Art. 5.1.2) — so
 * the Ship and Wordmark remain the sole focal point (Art. 1.3).
 */
import { useMemo } from 'react';
import * as THREE from 'three';
import { createGlowTexture } from './textures';

const T = {
  beam: '#E8C670',
  snow: '#F5F7FA',
  mist: '#A8B0C0',
};

function seeded(i: number, salt: number): number {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function Starfield() {
  const { positions, colors } = useMemo(() => {
    const count = 2600;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cSnow = new THREE.Color(T.snow);
    const cMist = new THREE.Color(T.mist);
    const cBeam = new THREE.Color(T.beam);
    for (let i = 0; i < count; i += 1) {
      // Spherical shell far outside the travel path.
      const r = 130 + seeded(i, 1) * 190;
      const theta = seeded(i, 2) * Math.PI * 2;
      const phi = Math.acos(2 * seeded(i, 3) - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      const roll = seeded(i, 4);
      const c = roll > 0.92 ? cBeam : roll > 0.55 ? cSnow : cMist;
      const dim = 0.45 + seeded(i, 5) * 0.55;
      colors[i * 3] = c.r * dim;
      colors[i * 3 + 1] = c.g * dim;
      colors[i * 3 + 2] = c.b * dim;
    }
    return { positions, colors };
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.9}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
}

/** Distant worlds and spaceship cities — soft glows with faint light clusters. */
function DistantWorlds() {
  const glowSnow = useMemo(() => createGlowTexture(T.mist), []);
  const glowBeam = useMemo(() => createGlowTexture(T.beam), []);

  const worlds: Array<{
    pos: [number, number, number];
    scale: number;
    warm: boolean;
    cluster: number;
  }> = [
    { pos: [-120, 34, -170], scale: 64, warm: false, cluster: 14 },
    { pos: [150, -22, -190], scale: 82, warm: true, cluster: 18 },
    { pos: [70, 70, -220], scale: 48, warm: false, cluster: 10 },
    { pos: [-170, -48, -120], scale: 55, warm: true, cluster: 12 },
    { pos: [30, -95, -240], scale: 70, warm: false, cluster: 0 },
  ];

  return (
    <group>
      {worlds.map((w, wi) => (
        <group key={wi} position={w.pos}>
          <sprite scale={[w.scale, w.scale, 1]}>
            <spriteMaterial
              map={w.warm ? glowBeam : glowSnow}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              opacity={0.22}
            />
          </sprite>
          {/* City lights: a static constellation on the world's face */}
          {Array.from({ length: w.cluster }).map((_, i) => (
            <sprite
              key={i}
              position={[
                (seeded(i, wi + 7) - 0.5) * w.scale * 0.5,
                (seeded(i, wi + 13) - 0.5) * w.scale * 0.32,
                2,
              ]}
              scale={[2.6, 2.6, 1]}
            >
              <spriteMaterial
                map={glowBeam}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.35}
              />
            </sprite>
          ))}
        </group>
      ))}
    </group>
  );
}

export default function SpaceEnvironment() {
  return (
    <group>
      <Starfield />
      <DistantWorlds />
    </group>
  );
}
