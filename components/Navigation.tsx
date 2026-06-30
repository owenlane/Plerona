'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Implementation', href: '/implementation' },
  { label: 'Consult', href: '/consult' },
  { label: 'About', href: '/about' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Portal target is only available on the client.
  useEffect(() => setMounted(true), []);

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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-white/5 bg-ink/85 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="container-px flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-base font-bold tracking-tight text-white"
          aria-label="Plerona home"
        >
          Plerona
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-silver transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/implementation"
            className="rounded-[2px] bg-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-hover"
          >
            View Packages
          </Link>
        </div>

        {/* Mobile open button */}
        <button
          className="flex h-10 w-10 items-center justify-center md:hidden"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span className="relative block h-4 w-6">
            <span className="absolute left-0 top-0 block h-0.5 w-6 bg-white" />
            <span className="absolute left-0 top-1/2 block h-0.5 w-6 -translate-y-1/2 bg-white" />
            <span className="absolute bottom-0 left-0 block h-0.5 w-6 bg-white" />
          </span>
        </button>
      </nav>

      {/* Mobile drawer — portaled to <body> so no ancestor stacking/containing
          context can trap or mis-position it. */}
      {mounted &&
        createPortal(
          <div className="md:hidden" aria-hidden={!open}>
            {/* Dimmed + blurred backdrop; tap to close */}
            <button
              type="button"
              aria-label="Close menu"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className={`fixed inset-0 z-[100] bg-ink/70 backdrop-blur-sm transition-opacity duration-300 ${
                open ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            />

            {/* Sliding drawer */}
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className={`fixed inset-y-0 right-0 z-[110] flex w-[82%] max-w-sm flex-col bg-ink shadow-2xl transition-transform duration-300 ease-out ${
                open ? 'translate-x-0' : 'pointer-events-none translate-x-full'
              }`}
            >
              <div className="flex h-16 items-center justify-between px-6">
                <span className="text-base font-bold tracking-tight text-white">Plerona</span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="-mr-2 flex h-10 w-10 items-center justify-center text-white"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              <nav className="flex flex-col px-6 pt-4">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-white/10 py-5 text-lg font-medium text-white"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto px-6 pb-10 pt-6">
                <Link
                  href="/implementation"
                  onClick={() => setOpen(false)}
                  className="block rounded-[2px] bg-blue px-5 py-4 text-center text-base font-semibold text-white"
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
