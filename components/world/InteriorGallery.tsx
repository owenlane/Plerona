'use client';

/**
 * The interior gallery — the museum inside the Beam strut (Part III, Art. 3).
 * A tunnel runs the strut's length; each Room is a pod shell opening from it.
 * The Captain's Room is the command sphere at the very center of the O and
 * carries the founder portrait (Part II, Art. 8.2). The Package Room reads as
 * a premium, well-organized shop (Part III, Art. 3.4). Geometry is static;
 * warmth comes from placed lights, not looping effects.
 */
import { useMemo } from 'react';
import * as THREE from 'three';
import { LOCATIONS, WORLD } from '@/lib/journey/path';
import { createFounderPortraitTexture } from './textures';

const T = {
  beam: '#E8C670',
  panel: '#1A1F2E',
  spaceDeep: '#0B0F1A',
};

const TUNNEL_R = WORLD.interiorTunnelRadius; // 1.7
const HALF = WORLD.beamStrut.halfLength; // 15

function Tunnel() {
  const ribs = useMemo(() => {
    const xs: number[] = [];
    for (let x = -HALF + 1; x <= HALF - 1; x += 2) xs.push(x);
    return xs;
  }, []);

  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[TUNNEL_R, TUNNEL_R, HALF * 2 + 2.4, 24, 1, true]} />
        <meshStandardMaterial
          color={T.panel}
          metalness={0.6}
          roughness={0.55}
          side={THREE.BackSide}
        />
      </mesh>
      {ribs.map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[TUNNEL_R - 0.04, 0.035, 6, 28]} />
          <meshBasicMaterial color={T.beam} transparent opacity={0.55} />
        </mesh>
      ))}
      {/* Guide light line along the floor of the tunnel */}
      <mesh position={[0, -TUNNEL_R + 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[HALF * 2 + 2, 0.12]} />
        <meshBasicMaterial color={T.beam} transparent opacity={0.7} />
      </mesh>
      {/* Airlock rings at both docking ends */}
      {[HALF + 0.9, -HALF - 0.9].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[TUNNEL_R + 0.15, 0.12, 8, 30]} />
          <meshBasicMaterial color={T.beam} />
        </mesh>
      ))}
    </group>
  );
}

function FounderPortrait3D({ position, lookFrom }: { position: [number, number, number]; lookFrom: [number, number, number] }) {
  const texture = useMemo(() => createFounderPortraitTexture(), []);
  const rotation = useMemo(() => {
    const m = new THREE.Matrix4().lookAt(
      new THREE.Vector3(...position),
      new THREE.Vector3(...lookFrom),
      new THREE.Vector3(0, 1, 0),
    );
    return new THREE.Euler().setFromRotationMatrix(m);
  }, [position, lookFrom]);

  return (
    <group position={position} rotation={rotation}>
      {/* Gold frame */}
      <mesh position={[0, 0, -0.03]}>
        <planeGeometry args={[2.55, 3.3]} />
        <meshStandardMaterial color={T.beam} metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh>
        <planeGeometry args={[2.3, 3.05]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* Picture light above the painting */}
      <pointLight position={[0, 1.9, 0.7]} color={T.beam} intensity={9} distance={7} decay={2} />
    </group>
  );
}

function RoomShells() {
  const stations = LOCATIONS.filter((l) => l.flags?.interior);
  return (
    <group>
      {stations.map((s) => {
        const x = s.camera[0];
        const isCaptains = Boolean(s.flags?.commandSphere);
        const isShop = Boolean(s.flags?.shop);
        const r = isCaptains ? 5.3 : 2.95;
        return (
          <group key={s.id} position={[x, 0, 0]}>
            <mesh>
              <sphereGeometry args={[r, isCaptains ? 36 : 24, isCaptains ? 26 : 18]} />
              <meshStandardMaterial
                color={T.panel}
                metalness={0.5}
                roughness={0.6}
                side={THREE.BackSide}
              />
            </mesh>
            {/* Room key light — warm in the Captain's Room and the shop */}
            <pointLight
              position={[0, r * 0.55, 0]}
              color={isCaptains || isShop ? T.beam : '#F5F7FA'}
              intensity={isCaptains ? 26 : 10}
              distance={r * 3.2}
              decay={2}
            />

            {isCaptains && (
              <FounderPortrait3D position={[-2.2, 0.6, -3.4]} lookFrom={[0.4, 0, 0]} />
            )}

            {isShop && (
              <group>
                {[-1.5, 0, 1.5].map((z, i) => (
                  <group key={i} position={[-0.6, -TUNNEL_R + 0.45, z * 0.95]}>
                    <mesh>
                      <boxGeometry args={[0.55, 0.9, 0.55]} />
                      <meshStandardMaterial color={T.spaceDeep} metalness={0.7} roughness={0.4} />
                    </mesh>
                    <mesh position={[0, 0.47, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                      <planeGeometry args={[0.58, 0.58]} />
                      <meshBasicMaterial color={T.beam} transparent opacity={0.85} />
                    </mesh>
                  </group>
                ))}
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}

export default function InteriorGallery() {
  return (
    <group>
      <Tunnel />
      <RoomShells />
    </group>
  );
}
