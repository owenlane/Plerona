import type { Metadata } from 'next';
import { Suspense } from 'react';
import CheckoutClient from '@/components/CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Confirm your configuration and complete your purchase. No surprise pricing.',
};

function CheckoutFallback() {
  return (
    <div className="container-px section pt-32">
      <div className="h-8 w-48 animate-pulse rounded bg-rule" />
      <div className="mt-6 h-4 w-80 max-w-full animate-pulse rounded bg-rule" />
      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <div className="h-32 animate-pulse rounded-[2px] bg-offwhite" />
          <div className="h-24 animate-pulse rounded-[2px] bg-offwhite" />
          <div className="h-40 animate-pulse rounded-[2px] bg-offwhite" />
        </div>
        <div className="h-72 animate-pulse rounded-[2px] bg-offwhite" />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutClient />
    </Suspense>
  );
}
