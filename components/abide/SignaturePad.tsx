'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';

type Point = { x: number; y: number };

export interface SignaturePadHandle {
  clear: () => void;
  /** PNG data URL on a white background, or null if nothing drawn. */
  toDataUrl: () => string | null;
}

interface Props {
  onChange: (strokeCount: number) => void;
}

/**
 * Canvas signature pad. Uses Pointer Events (mouse, pen, touch — including
 * iOS Safari). `touch-action: none` stops the page from scrolling while
 * signing. Strokes are kept in CSS-pixel space and redrawn on resize so the
 * signature survives rotation and layout changes.
 */
const SignaturePad = forwardRef<SignaturePadHandle, Props>(function SignaturePad(
  { onChange },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Point[][]>([]);
  const drawing = useRef(false);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2.25;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0a0a0a';
    ctx.fillStyle = '#0a0a0a';
    for (const s of strokes.current) {
      if (s.length === 1) {
        ctx.beginPath();
        ctx.arc(s[0].x, s[0].y, 1.4, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }
      ctx.beginPath();
      ctx.moveTo(s[0].x, s[0].y);
      for (let i = 1; i < s.length - 1; i++) {
        const mx = (s[i].x + s[i + 1].x) / 2;
        const my = (s[i].y + s[i + 1].y) / 2;
        ctx.quadraticCurveTo(s[i].x, s[i].y, mx, my);
      }
      const last = s[s.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.stroke();
    }
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    redraw();
  }, [redraw]);

  useEffect(() => {
    resize();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [resize]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    strokes.current.push([pos(e)]);
    redraw();
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    e.preventDefault();
    const stroke = strokes.current[strokes.current.length - 1];
    // Coalesced events give smoother lines on fast touch movement.
    const native = e.nativeEvent as PointerEvent;
    const events =
      typeof native.getCoalescedEvents === 'function' ? native.getCoalescedEvents() : [];
    if (events.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      for (const ev of events) stroke.push({ x: ev.clientX - rect.left, y: ev.clientY - rect.top });
    } else {
      stroke.push(pos(e));
    }
    redraw();
  };

  const onUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    drawing.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    onChange(strokes.current.length);
  };

  useImperativeHandle(ref, () => ({
    clear() {
      strokes.current = [];
      redraw();
      onChange(0);
    },
    toDataUrl() {
      const canvas = canvasRef.current;
      if (!canvas || strokes.current.length === 0) return null;
      const out = document.createElement('canvas');
      out.width = canvas.width;
      out.height = canvas.height;
      const ctx = out.getContext('2d');
      if (!ctx) return null;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, out.width, out.height);
      ctx.drawImage(canvas, 0, 0);
      return out.toDataURL('image/png');
    },
  }));

  return (
    <canvas
      ref={canvasRef}
      aria-label="Signature pad. Draw your signature with your finger, pen, or mouse."
      role="img"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onContextMenu={(e) => e.preventDefault()}
      className="block h-44 w-full cursor-crosshair select-none bg-white md:h-48"
      style={{ touchAction: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
    />
  );
});

export default SignaturePad;
