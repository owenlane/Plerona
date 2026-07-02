import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

// Self-hosted Inter (variable weight). No runtime dependency on Google Fonts —
// faster, private, and reliable across every environment.
const inter = localFont({
  src: './fonts/Inter-Variable.woff2',
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://plerona.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Plerona — AI-Powered Infrastructure for Small Businesses',
    template: '%s · Plerona',
  },
  description:
    'Plerona builds AI-powered operational infrastructure for small businesses. Custom-built systems you own, implemented in 2–5 business days.',
  keywords: [
    'AI infrastructure',
    'operational infrastructure',
    'AI implementation',
    'small business AI',
    'workflow automation',
  ],
  openGraph: {
    title: 'Plerona — AI-Powered Infrastructure for Small Businesses',
    description:
      'We transform disconnected operations into AI-powered systems — built for your business and handed off to you.',
    url: SITE_URL,
    siteName: 'Plerona',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-space text-snow antialiased">
        <Navigation />
        <main id="content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
