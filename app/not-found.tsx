import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-ink pt-16 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(232,198,112,0.12),_transparent_60%)]" />
      <div className="container-px relative z-10 py-24">
        <p className="eyebrow tracking-eyebrow mb-6">404</p>
        <h1 className="max-w-2xl text-4xl font-bold leading-[1.06] tracking-tighter2 sm:text-5xl">
          This page doesn&apos;t exist.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-[1.7] text-silver">
          The link may be broken or the page may have moved. Everything you need is one step away.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-[2px] bg-blue px-8 py-3.5 text-sm font-semibold text-space transition-colors hover:bg-blue-hover"
          >
            Back to home
          </Link>
          <Link
            href="/implementation"
            className="inline-flex items-center justify-center rounded-[2px] border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            View Packages
          </Link>
        </div>
      </div>
    </section>
  );
}
