import type { Metadata } from 'next';
import LegalLayout from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms that govern your use of Plerona LLC services.',
};

const UPDATED = 'June 2026';

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      updated={UPDATED}
      intro="These terms govern your purchase and use of services from Plerona LLC (“Plerona,” “we,” “us”). By booking a Roadmap or starting an Implementation, you agree to these terms. They are written to be clear and fair to both sides."
      sections={[
        {
          heading: 'Services',
          body: (
            <p>
              Plerona provides two core services: the Intermediary Consult (a documented roadmap)
              and Plerona Implementation (the build and handoff of connected AI infrastructure).
              Additional connections and optional monthly hosting are customization options on top
              of an Implementation, not standalone products. The deliverables for each service are
              described on the relevant page of this site.
            </p>
          ),
        },
        {
          heading: 'Pricing & Payment',
          body: (
            <p>
              Prices are shown on the site and itemized at checkout with no hidden fees. The
              Intermediary Consult is a one-time fee. Implementation is a one-time fee based on the
              configuration you select. Optional hosting, if chosen, is billed monthly and begins
              only after implementation is complete.
            </p>
          ),
        },
        {
          heading: 'Delivery Estimates',
          body: (
            <p>
              Delivery windows shown on the site and at checkout are good-faith estimates, not
              guarantees. Actual timing depends on the scope of your engagement and the speed at
              which requested information is provided.
            </p>
          ),
        },
        {
          heading: 'Ownership & Handoff',
          body: (
            <p>
              On completion of an Implementation, ownership of the delivered infrastructure,
              prompt libraries, and documentation transfers to you. You are free to operate, modify,
              and extend the system. Optional hosting does not change this ownership — it is a
              service for managing and evolving infrastructure you already own.
            </p>
          ),
        },
        {
          heading: 'Roadmap Credit',
          body: (
            <p>
              If you purchase an Intermediary Consult and proceed to Implementation within 30 days,
              the Roadmap fee is credited toward your Implementation, subject to the terms presented
              at the time of purchase.
            </p>
          ),
        },
        {
          heading: 'Your Responsibilities',
          body: (
            <p>
              Delivering effective infrastructure depends on accurate information about your
              operation and reasonable access to the tools and accounts being connected. You are
              responsible for providing these and for maintaining your own credentials and security.
            </p>
          ),
        },
        {
          heading: 'Limitation of Liability',
          body: (
            <p>
              To the extent permitted by law, Plerona’s total liability arising from the services is
              limited to the amount you paid for the engagement giving rise to the claim. We are not
              liable for indirect or consequential damages. Nothing in these terms limits liability
              that cannot be limited by law.
            </p>
          ),
        },
        {
          heading: 'Changes to These Terms',
          body: (
            <p>
              We may update these terms from time to time. The version in effect at the time of your
              purchase governs that engagement. Material changes will be reflected by updating the
              date at the top of this page.
            </p>
          ),
        },
      ]}
    />
  );
}
