import type { Metadata } from 'next';
import { Suspense } from 'react';
import ThankYouClient from '@/components/ThankYouClient';

export const metadata: Metadata = {
  title: 'Thank You',
  description: 'Your order is confirmed. Here is what happens next.',
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <ThankYouClient />
    </Suspense>
  );
}
