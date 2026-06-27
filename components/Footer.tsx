import Link from 'next/link';

const YEAR = new Date().getFullYear();

const NAV = [
  { label: 'Implementation', href: '/implementation' },
  { label: 'Intermediary Consult', href: '/consult' },
  { label: 'About Plerona', href: '/about' },
];

const LEGAL = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-px border-t border-white/10 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="text-base font-bold tracking-tight">Plerona</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-silver">
              AI-powered infrastructure for small businesses.
            </p>
            <p className="mt-6 text-xs text-graymid">© {YEAR} Plerona LLC. All rights reserved.</p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer" className="md:justify-self-center">
            <p className="eyebrow-muted mb-5">Navigate</p>
            <ul className="space-y-3">
              {NAV.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-silver transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal / contact */}
          <div className="md:justify-self-end">
            <p className="eyebrow-muted mb-5">Legal & Contact</p>
            <ul className="space-y-3">
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-silver transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="mailto:contact@plerona.com"
                  className="text-sm text-silver transition-colors hover:text-white"
                >
                  contact@plerona.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
