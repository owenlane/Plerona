import type { Metadata } from 'next';
import LegalLayout from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Plerona LLC collects, uses, and protects your information.',
};

const UPDATED = 'June 2026';

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated={UPDATED}
      intro="Plerona LLC (“Plerona,” “we,” “us”) builds AI infrastructure for small businesses. This policy explains what information we collect, why we collect it, and the choices you have. We collect only what we need to deliver our work and run our business."
      sections={[
        {
          heading: 'Information We Collect',
          body: (
            <>
              <p>
                We collect information you provide directly — such as your name, business name,
                email, and phone number when you book a Roadmap or start an Implementation. During
                an engagement, you may share operational details about your business so we can build
                your infrastructure.
              </p>
              <p>
                We also collect limited technical data automatically, such as basic analytics about
                how the site is used, to keep it working and improve it.
              </p>
            </>
          ),
        },
        {
          heading: 'How We Use Information',
          body: (
            <p>
              We use your information to deliver the services you purchased, communicate with you
              about your engagement, process payment, and meet legal and accounting obligations. We
              do not sell your personal information.
            </p>
          ),
        },
        {
          heading: 'Confidentiality of Your Operation',
          body: (
            <p>
              The operational details you share during an engagement are treated as confidential.
              We use them solely to build and document your infrastructure, and we do not disclose
              them to third parties except as required to deliver the work or comply with the law.
            </p>
          ),
        },
        {
          heading: 'Payment Processing',
          body: (
            <p>
              Payments are handled by a third-party payment processor. We do not store full card
              numbers on our systems. The processor handles card data under its own security
              standards and privacy terms.
            </p>
          ),
        },
        {
          heading: 'Data Retention',
          body: (
            <p>
              We retain your information for as long as needed to provide our services and to meet
              legal, tax, and accounting requirements. When information is no longer needed, we take
              reasonable steps to delete or anonymize it.
            </p>
          ),
        },
        {
          heading: 'Your Choices',
          body: (
            <p>
              You may request access to, correction of, or deletion of your personal information by
              contacting us. We will respond consistent with applicable law. You can also opt out of
              non-essential communications at any time.
            </p>
          ),
        },
        {
          heading: 'Changes to This Policy',
          body: (
            <p>
              We may update this policy as our practices evolve. Material changes will be reflected
              by updating the date at the top of this page.
            </p>
          ),
        },
      ]}
    />
  );
}
