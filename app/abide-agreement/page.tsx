import type { Metadata } from 'next';
import AgreementClient from '@/components/abide/AgreementClient';

export const metadata: Metadata = {
  title: 'Abide Electrical — Website Build Agreement',
  description: 'Plerona × Abide Electrical website build agreement — review, sign, and pay deposit.',
  robots: { index: false, follow: false },
};

export default function AbideAgreementPage() {
  return <AgreementClient />;
}
