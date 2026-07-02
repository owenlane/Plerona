'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { BOTTLENECK_NODES } from '@/lib/content';

/**
 * HS-04 — nodes appear sequentially; connections attempt to form and fail,
 * representing friction. When all nodes are visible, a callout appears.
 */
export default function BottleneckDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();

  // Lay nodes out on a circle.
  const N = BOTTLENECK_NODES.length;
  const cx = 250;
  const cy = 200;
  const r = 150;
  const points = BOTTLENECK_NODES.map((label, i) => {
    const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
    return { label, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  // A few "failing" connection attempts (dashed, faded).
  const failingLinks = [
    [0, 3],
    [1, 5],
    [2, 6],
    [4, 8],
    [3, 7],
    [0, 6],
  ];

  return (
    <div ref={ref}>
      <svg viewBox="0 0 500 400" className="mx-auto w-full max-w-xl" role="img" aria-label="Disconnected operational systems with failing connections between them">
        {failingLinks.map(([a, b], i) => (
          <motion.line
            key={`l-${i}`}
            x1={points[a].x}
            y1={points[a].y}
            x2={points[b].x}
            y2={points[b].y}
            stroke="#A8B0C0"
            strokeWidth={1}
            strokeDasharray="4 5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: [0, 0.7, 0], opacity: [0, 0.5, 0.12] } : {}}
            transition={{ duration: reduced ? 0 : 1.6, delay: reduced ? 0 : 0.8 + i * 0.12 }}
          />
        ))}
        {points.map((p, i) => (
          <motion.g
            key={p.label}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : i * 0.1 }}
            style={{ transformOrigin: `${p.x}px ${p.y}px` }}
          >
            <circle cx={p.x} cy={p.y} r={5} fill="#E8C670" />
            <text
              x={p.x}
              y={p.y - 12}
              textAnchor="middle"
              className="fill-graymid"
              style={{ fontSize: 11, fontWeight: 600 }}
            >
              {p.label}
            </text>
          </motion.g>
        ))}
      </svg>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: reduced ? 0 : 2.2 }}
        className="mx-auto mt-4 max-w-md text-center text-lg font-semibold tracking-tight"
      >
        The bottleneck is structural.
      </motion.p>
    </div>
  );
}
