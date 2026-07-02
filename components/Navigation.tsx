'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import sceneGraph from '@/lib/scene-graph.json';
import { dispatchModeChange } from '@/components/journey/JourneyShell';
import { MODE_STORAGE_KEY } from '@/lib/journey/capability';

const NAV_LINKS = [
  { label: 'Implementation', href: '/implementation' },
  { label: 'Consult', href: '/consult' },
  { label: 'About', href: '/about' },
];

const LOCATIONS = (sceneGraph.locations as Array<{ id: string; name: string; type: string }>).map(
  (l) => ({ id: l.id, name: l.name, type: l.type }),
);

/**
 * Navigation — Constitution Part III, Article 4.
 * Two permanent modes: the Journey itself, and this hamburger giving direct,
 * keyboard-accessible access to every Location from every point in the
 * experience (the drawer is available on all breakpoints). The drawer is
 * portaled to <body> so no stacking/containing context can trap it, and the
 * iOS-safe scroll lock is preserved exactly as shipped.
 */
export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedMode, setFocusedMode] = useState(false);
  const pathname = usePathname();

  // Portal target is only available on the client.
  useEffect(() => {
    setMounted(true);
    try {
      setFocusedMode(window.localStorage.getItem(MODE_STORAGE_KEY) === 'focused');
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on route change.
  useEffect(() => setOpen(false), [pathname]);

  // ESC to close + iOS-reliable body scroll lock while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);

    if (!open) {
      return () => document.removeEventListener('keydown', onKey);
    }

    // Lock scroll. Plain `overflow: hidden` does NOT hold on iPhone Safari,
    // so we pin the body in place and restore the scroll position on close.
    const scrollY = window.scrollY;
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  const toggleFocusedMode = () => {
    const next = !focusedMode;
    setFocusedMode(next);
    dispatchModeChange(next ? 'focused' : '3d');
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-beam/15 bg-space/85 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="container-px flex h-16 items-center justify-between">
        {/* The Wordmark — DOM twin of the Beam lettering */}
        <Link
          href="/"
          className="text-base font-bold tracking-tight text-snow"
          aria-label="Plerona home"
        >
          Plerona
        </Link>

        <div className="flex items-center gap-3 md:gap-6">
          {/* Desktop quick links (existing routes preserved) */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-mist transition-colors hover:text-snow"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/implementation"
              className="rounded-sm bg-beam px-5 py-2.5 text-sm font-semibold text-space transition-colors hover:bg-beam-hover"
            >
              View Packages
            </Link>
          </div>

          {/* Hamburger — reachable from every point (Part III, Art. 4.3) */}
          <button
            className="flex h-10 w-10 items-center justify-center"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <span className="relative block h-4 w-6">
              <span className="absolute left-0 top-0 block h-0.5 w-6 bg-snow" />
              <span className="absolute left-0 top-1/2 block h-0.5 w-6 -translate-y-1/2 bg-snow" />
              <span className="absolute bottom-0 left-0 block h-0.5 w-6 bg-snow" />
            </span>
          </button>
        </div>
      </nav>

      {/* Drawer — portaled to <body> so no ancestor stacking/containing
          context can trap or mis-position it. */}
      {mounted &&
        createPortal(
          <div aria-hidden={!open}>
            {/* Dimmed + blurred backdrop; tap to close */}
            <button
              type="button"
              aria-label="Close menu"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className={`fixed inset-0 z-[100] bg-space/70 backdrop-blur-sm transition-opacity duration-300 ${
                open ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            />

            {/* Sliding drawer */}
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className={`fixed inset-y-0 right-0 z-[110] flex w-[86%] max-w-sm flex-col overflow-y-auto bg-panel shadow-2xl transition-transform duration-300 ease-out ${
                open ? 'translate-x-0' : 'pointer-events-none translate-x-full'
              }`}
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-rule px-6">
                <span className="text-base font-bold tracking-tight text-snow">Plerona</span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="-mr-2 flex h-10 w-10 items-center justify-center text-snow"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              {/* Direct access to every Location (Part III, Art. 4.2) */}
              <nav className="px-6 pt-5" aria-label="Journey locations">
                <p className="mb-2 text-eyebrow font-semibold uppercase tracking-eyebrow text-mist">
                  The Journey
                </p>
                {LOCATIONS.map((l) => (
                  <Link
                    key={l.id}
                    href={`/#${l.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-rule py-3.5 text-[15px] font-medium text-snow transition-colors hover:text-beam"
                  >
                    {l.name}
                    <span className="text-[10px] uppercase tracking-wider text-mist">
                      {l.type === 'room' ? 'Room' : 'View'}
                    </span>
                  </Link>
                ))}
              </nav>

              <nav className="px-6 pt-6" aria-label="Pages">
                <p className="mb-2 text-eyebrow font-semibold uppercase tracking-eyebrow text-mist">
                  Pages
                </p>
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-rule py-3.5 text-[15px] font-medium text-snow transition-colors hover:text-beam"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>

              {/* Focused Mode — available to every visitor (Art. 10.3) */}
              <div className="px-6 pt-6">
                <button
                  type="button"
                  role="switch"
                  aria-checked={focusedMode}
                  onClick={toggleFocusedMode}
                  className="flex w-full items-center justify-between rounded-md border border-rule px-4 py-3.5 text-left transition-colors hover:border-beam/50"
                >
                  <span>
                    <span className="block text-[15px] font-medium text-snow">Focused Mode</span>
                    <span className="mt-0.5 block text-xs text-mist">
                      The complete experience without the 3D layer
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`relative ml-4 inline-flex h-6 w-11 shrink-0 items-center rounded-lg border transition-colors ${
                      focusedMode ? 'border-beam bg-beam' : 'border-rule bg-space'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-lg transition-transform ${
                        focusedMode ? 'translate-x-6 bg-space' : 'translate-x-1 bg-mist'
                      }`}
                    />
                  </span>
                </button>
              </div>

              <div className="mt-auto px-6 pb-10 pt-8">
                <Link
                  href="/implementation"
                  onClick={() => setOpen(false)}
                  className="block rounded-sm bg-beam px-5 py-4 text-center text-base font-semibold text-space"
                >
                  View Packages
                </Link>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}
