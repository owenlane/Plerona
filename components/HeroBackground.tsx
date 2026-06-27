'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

const NODE_COUNT = 42;
const LINK_DISTANCE = 1.45;
const BLUE = new THREE.Color('#1a56db');
const WHITE = new THREE.Color('#ffffff');

interface NodeData {
  base: THREE.Vector3;
  drift: THREE.Vector3;
}

function buildNodes(count: number): NodeData[] {
  const nodes: NodeData[] = [];
  for (let i = 0; i < count; i += 1) {
    nodes.push({
      base: new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4.5,
        (Math.random() - 0.5) * 3,
      ),
      drift: new THREE.Vector3(
        (Math.random() - 0.5) * 0.0006,
        (Math.random() - 0.5) * 0.0006,
        (Math.random() - 0.5) * 0.0006,
      ),
    });
  }
  return nodes;
}

function Graph({ reduced }: { reduced: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { mouse } = useThree();

  const nodes = useMemo(() => buildNodes(NODE_COUNT), []);
  const positions = useMemo(() => new Float32Array(NODE_COUNT * 3), []);

  // Precompute static link pairs (indices) for nodes within distance.
  const linkPairs = useMemo(() => {
    const pairs: [number, number][] = [];
    for (let i = 0; i < NODE_COUNT; i += 1) {
      for (let j = i + 1; j < NODE_COUNT; j += 1) {
        if (nodes[i].base.distanceTo(nodes[j].base) < LINK_DISTANCE) pairs.push([i, j]);
      }
    }
    return pairs;
  }, [nodes]);

  const linePositions = useMemo(() => new Float32Array(linkPairs.length * 6), [linkPairs.length]);

  const pointGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    return g;
  }, [linePositions]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Update node positions (subtle drift).
    for (let i = 0; i < NODE_COUNT; i += 1) {
      const n = nodes[i];
      if (!reduced) {
        n.base.addScaledVector(n.drift, 1);
        // Gentle bounded oscillation so nodes never wander off-screen.
        if (Math.abs(n.base.x) > 4.2) n.drift.x *= -1;
        if (Math.abs(n.base.y) > 2.4) n.drift.y *= -1;
        if (Math.abs(n.base.z) > 1.6) n.drift.z *= -1;
      }
      const wob = reduced ? 0 : Math.sin(t * 0.5 + i) * 0.04;
      positions[i * 3] = n.base.x;
      positions[i * 3 + 1] = n.base.y + wob;
      positions[i * 3 + 2] = n.base.z;
    }
    pointGeo.attributes.position.needsUpdate = true;

    // Update link endpoints.
    for (let k = 0; k < linkPairs.length; k += 1) {
      const [a, b] = linkPairs[k];
      linePositions[k * 6] = positions[a * 3];
      linePositions[k * 6 + 1] = positions[a * 3 + 1];
      linePositions[k * 6 + 2] = positions[a * 3 + 2];
      linePositions[k * 6 + 3] = positions[b * 3];
      linePositions[k * 6 + 4] = positions[b * 3 + 1];
      linePositions[k * 6 + 5] = positions[b * 3 + 2];
    }
    lineGeo.attributes.position.needsUpdate = true;

    // Mouse-responsive parallax on the whole graph.
    if (groupRef.current) {
      const targetX = reduced ? 0 : mouse.y * 0.12;
      const targetY = reduced ? 0 : mouse.x * 0.18;
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.04;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments ref={linesRef} geometry={lineGeo}>
        <lineBasicMaterial color={BLUE} transparent opacity={0.35} />
      </lineSegments>
      <points ref={pointsRef} geometry={pointGeo}>
        <pointsMaterial color={WHITE} size={0.06} sizeAttenuation transparent opacity={0.9} />
      </points>
    </group>
  );
}

export default function HeroBackground() {
  const reduced = useReducedMotion() ?? false;

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={reduced ? 'demand' : 'always'}
      >
        <Graph reduced={reduced} />
      </Canvas>
      {/* Legibility scrim — keeps headline readable over the graph (§05). */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/20 to-ink/70" />
    </div>
  );
}
