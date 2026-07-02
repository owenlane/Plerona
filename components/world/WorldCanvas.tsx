'use client';

/**
 * The world canvas — Constitution Part V, Article 1.
 * The Three.js layer is an enhancement behind the DOM: it renders the world
 * and camera travel while every word of content lives in semantic HTML above
 * it. It is pointer-transparent (all interaction is DOM), error-bounded (any
 * WebGL failure engages Focused Mode instead of crashing the tree — the
 * lesson encoded in SafeCanvasBoundary), and renders on demand.
 */
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import SafeCanvasBoundary from '@/components/SafeCanvasBoundary';
import Ship from './Ship';
import SpaceEnvironment from './SpaceEnvironment';
import InteriorGallery from './InteriorGallery';
import CameraRig from './CameraRig';
import { DPR_LADDER, initialDprIndex } from '@/lib/journey/capability';

const SPACE_DEEP = '#0B0F1A';
const SNOW = '#F5F7FA';

interface WorldCanvasProps {
  onFallback: () => void;
}

export default function WorldCanvas({ onFallback }: WorldCanvasProps) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <SafeCanvasBoundary onError={onFallback}>
        <Canvas
          frameloop="demand"
          dpr={DPR_LADDER[initialDprIndex()]}
          camera={{ fov: 58, near: 0.1, far: 460, position: [0, 1.5, 54] }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: true,
          }}
          onCreated={({ gl, scene }) => {
            gl.setClearColor(SPACE_DEEP, 1);
            scene.fog = new THREE.Fog(SPACE_DEEP, 90, 320);
          }}
        >
          {/* Lighting: calm key + fill; the Wordmark supplies the warmth */}
          <ambientLight color={SNOW} intensity={0.22} />
          <directionalLight position={[40, 55, 60]} color={SNOW} intensity={1.15} />
          <directionalLight position={[-30, -20, -50]} color={SNOW} intensity={0.25} />

          <SpaceEnvironment />
          <Ship />
          <InteriorGallery />
          <CameraRig onFallback={onFallback} />
        </Canvas>
      </SafeCanvasBoundary>
    </div>
  );
}
