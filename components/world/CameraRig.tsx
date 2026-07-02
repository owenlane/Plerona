'use client';

/**
 * Camera — Constitution Part III, Art. 5 and Part V, Art. 3.
 * A guided first-person vessel, never free-flight: scroll drives dolly along
 * the Scene-Graph spline; pointer/touch-drag steers a yaw/pitch-clamped look.
 * Linear interpolation with the mandated 0.08 damping factor smooths travel.
 * Below 768px, travel is 30% slower and look sensitivity reduced (Art. 5.4;
 * the DOM side applies --travel-scale so scroll distance grows 1.3×).
 * Sustained frame-rate failure steps down the DPR ladder, then engages
 * Focused Mode (Part V, Art. 6).
 */
import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { cameraCurve, lookCurve } from '@/lib/journey/path';
import { DPR_LADDER, fpsFloor, initialDprIndex, isNarrowViewport } from '@/lib/journey/capability';

const DAMPING = 0.08; // Part V, Art. 3.2 — non-negotiable
const LOOK_DISTANCE = 6;

interface CameraRigProps {
  onFallback: () => void;
}

export default function CameraRig({ onFallback }: CameraRigProps) {
  const { camera, setDpr, invalidate } = useThree();
  const target = useRef(0);
  const smoothed = useRef(0);
  const yaw = useRef(0);
  const pitch = useRef(0);
  const yawTarget = useRef(0);
  const pitchTarget = useRef(0);
  const dprIndex = useRef(initialDprIndex());
  const fps = useRef({ frames: 0, time: 0, badSeconds: 0 });
  const fellBack = useRef(false);

  // ── Scroll → travel target (native scroll only; no capture) ──
  useEffect(() => {
    const root = document.getElementById('journey-root');
    const measure = () => {
      const height = root ? root.offsetHeight : document.documentElement.scrollHeight;
      const max = Math.max(1, height - window.innerHeight);
      target.current = THREE.MathUtils.clamp(window.scrollY / max, 0, 1);
      invalidate();
    };
    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [invalidate]);

  // ── Constrained look: pointer position (desktop) / horizontal drag (touch) ──
  useEffect(() => {
    const narrow = isNarrowViewport();
    const maxYaw = narrow ? 0.16 : 0.3; // radians — lower sensitivity on mobile
    const maxPitch = narrow ? 0.1 : 0.2;

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      yawTarget.current = -nx * maxYaw;
      pitchTarget.current = -ny * maxPitch;
      invalidate();
    };

    let lastTouchX: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      lastTouchX = e.touches[0]?.clientX ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      // Vertical swipe stays with native scroll (travel). Horizontal drag
      // steers yaw only — no scroll capture, no preventDefault.
      const x = e.touches[0]?.clientX;
      if (x === undefined || lastTouchX === null) return;
      const dx = (x - lastTouchX) / window.innerWidth;
      lastTouchX = x;
      yawTarget.current = THREE.MathUtils.clamp(
        yawTarget.current + dx * maxYaw * 2.2,
        -maxYaw,
        maxYaw,
      );
      invalidate();
    };
    const onTouchEnd = () => {
      lastTouchX = null;
      yawTarget.current = 0; // gently recenter
      invalidate();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [invalidate]);

  // Runtime reduced-motion change → Focused Mode immediately (Part V, 7.4).
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => {
      if (mq.matches && !fellBack.current) {
        fellBack.current = true;
        onFallback();
      }
    };
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [onFallback]);

  const pos = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());
  const forward = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());
  const up = new THREE.Vector3(0, 1, 0);

  useFrame((_, delta) => {
    // ── Travel smoothing: mandated lerp damping ──
    const diff = target.current - smoothed.current;
    smoothed.current += diff * DAMPING;
    yaw.current += (yawTarget.current - yaw.current) * 0.1;
    pitch.current += (pitchTarget.current - pitch.current) * 0.1;

    const u = THREE.MathUtils.clamp(smoothed.current, 0, 1);
    cameraCurve.getPointAt(u, pos.current);
    lookCurve.getPointAt(u, look.current);

    // Apply constrained look offsets in the camera frame.
    forward.current.subVectors(look.current, pos.current).normalize();
    right.current.crossVectors(forward.current, up).normalize();
    const offsetLook = look.current
      .clone()
      .addScaledVector(right.current, Math.tan(yaw.current) * LOOK_DISTANCE)
      .addScaledVector(up, Math.tan(pitch.current) * LOOK_DISTANCE);

    camera.position.copy(pos.current);
    camera.lookAt(offsetLook);

    // Keep rendering (demand mode) until motion settles.
    if (
      Math.abs(diff) > 0.00035 ||
      Math.abs(yawTarget.current - yaw.current) > 0.001 ||
      Math.abs(pitchTarget.current - pitch.current) > 0.001
    ) {
      invalidate();
    }

    // ── Adaptive quality: FPS floor → DPR ladder → Focused Mode ──
    fps.current.frames += 1;
    fps.current.time += delta;
    if (fps.current.time >= 1) {
      const measured = fps.current.frames / fps.current.time;
      fps.current.frames = 0;
      fps.current.time = 0;
      if (measured < fpsFloor()) {
        fps.current.badSeconds += 1;
        if (fps.current.badSeconds >= 3) {
          fps.current.badSeconds = 0;
          if (dprIndex.current < DPR_LADDER.length - 1) {
            dprIndex.current += 1;
            setDpr(DPR_LADDER[dprIndex.current]);
          } else if (!fellBack.current) {
            fellBack.current = true;
            onFallback();
          }
        }
      } else {
        fps.current.badSeconds = 0;
      }
    }
  });

  return null;
}
