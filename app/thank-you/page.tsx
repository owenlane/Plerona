import { redirect } from 'next/navigation';

// The confirmation page is now /success, which verifies payment against Stripe
// before showing anything. This legacy route can no longer display an
// unverified "order complete" state — it simply sends visitors home.
export default function ThankYouPage() {
  redirect('/');
}
