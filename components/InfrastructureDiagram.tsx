'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { INFRA_LAYERS } from '@/lib/content';

/**
 * HS-05 — center node first, rings draw outward; nodes interactive (hover/tap
 * reveals description). White nodes, blue connections, black background.
 */
export default function InfrastructureDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  const cx = 250;
  const cy = 220;
  // Center node + 6 outer layers on a ring.
  const outer = INFRA_LAYERS.slice(1);
  const r = 165;
  const nodes = [
    { ...INFRA_LAYERS[0], x: cx, y: cy, center: true },
    ...outer.map((layer, i) => {
      const angle = (i / outer.length) * Math.PI * 2 - Math.PI / 2;
      return { ...layer, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), center: false };
    }),
  ];

  return (
    <div ref={ref}>
      <svg
        viewBox="0 0 500 440"
        className="mx-auto w-full max-w-xl"
        role="img"
        aria-label="Connected AI infrastructure diagram"
      >
        {/* connections from center outward */}
        {nodes.slice(1).map((n, i) => (
          <motion.line
            key={`c-${i}`}
            x1={cx}
            y1={cy}
            x2={n.x}
            y2={n.y}
            stroke="#1a56db"
            strokeWidth={1.25}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 0.6 } : {}}
            transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.3 + i * 0.12 }}
          />
        ))}
        {nodes.map((n, i) => {
          const isActive = active === i;
          return (
            <motion.g
              key={n.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : (n.center ? 0 : 0.3 + i * 0.12) }}
              style={{ transformOrigin: `${n.x}px ${n.y}px`, cursor: 'pointer' }}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              tabIndex={0}
              onFocus={() => setActive(i)}
            >
              <circle
                cx={n.x}
                cy={n.y}
                r={n.center ? 12 : 8}
                fill={n.center ? '#1a56db' : '#ffffff'}
                stroke={isActive ? '#1a56db' : 'transparent'}
                strokeWidth={3}
                className={n.center && inView && !reduced ? 'animate-pulse2' : ''}
              />
              <text
                x={n.x}
                y={n.y + (n.center ? 30 : -16)}
                textAnchor="middle"
                fill={isActive ? '#ffffff' : '#c0c4cc'}
                style={{ fontSize: n.center ? 12 : 10.5, fontWeight: 600 }}
              >
                {n.label}
              </text>
            </motion.g>
          );
        })}
      </svg>

      <motion.div
        key={active}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mx-auto mt-2 max-w-md rounded-[2px] border-l-[3px] border-blue bg-white/[0.03] p-4 text-center"
      >
        <p className="text-sm font-semibold text-white">{nodes[active].label}</p>
        <p className="mt-1 text-sm text-silver">{nodes[active].description}</p>
      </motion.div>
    </div>
  );
}
