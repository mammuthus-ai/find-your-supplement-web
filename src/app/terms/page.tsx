import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for Find Your Supplement app and website.',
  alternates: { canonical: 'https://findyoursupplement.co/terms/' },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-bold text-text mb-2">Terms of Service</h1>
        <p className="text-text-tertiary text-sm mb-10">Last updated: April 6, 2026</p>

        <div className="prose space-y-6">
          <section>
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing or using Find Your Supplement (&quot;the Service&quot;), including our website
              (findyoursupplement.co) and mobile application, you agree to be bound by these Terms of Service.
              If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2>Medical Disclaimer</h2>
            <p>
              <strong>Find Your Supplement is NOT a medical device, diagnostic tool, or healthcare provider.</strong>
            </p>
            <p>
              The supplement recommendations provided by our Service are for informational and educational purposes
              only. They are based on published clinical research and should not be interpreted as medical advice,
              diagnosis, or treatment recommendations.
            </p>
            <p>
              <strong>Always consult a qualified healthcare professional</strong> before starting, stopping, or
              changing any supplement regimen, especially if you:
            </p>
            <ul>
              <li>Are pregnant, nursing, or planning to become pregnant</li>
              <li>Take prescription medications</li>
              <li>Have a diagnosed medical condition</li>
              <li>Are under 18 years of age</li>
              <li>Are scheduled for surgery</li>
            </ul>
            <p>
              We do not guarantee any specific health outcomes from following our recommendations. Individual
              results may vary. Supplement efficacy depends on many factors including genetics, diet, lifestyle,
              and existing health conditions.
            </p>
          </section>

          <section>
            <h2>Description of Service</h2>
            <p>
              Find Your Supplement provides personalized supplement recommendations based on user-provided health
              information (goals, diet, lifestyle, symptoms, and optionally blood work and genetic data). Our
              recommendation engine uses evidence from PubMed-indexed research, ClinicalTrials.gov, and other
              scientific databases to score and rank supplements by relevance to each user&apos;s profile.
            </p>
          </section>

          <section>
            <h2>Affiliate Disclosure</h2>
            <p>
              Find Your Supplement participates in the Amazon Associates Program and other affiliate programs.
              When you click product links and make purchases, we may earn a commission at no additional cost to
              you. Our recommendations are generated algorithmically based on scientific evidence and are not
              influenced by affiliate relationships.
            </p>
          </section>

          <section>
            <h2>User Responsibilities</h2>
            <ul>
              <li>You are responsible for the accuracy of the health information you provide</li>
              <li>You understand that recommendations are informational, not medical advice</li>
              <li>You will consult a healthcare provider before making health decisions</li>
              <li>You will not use the Service as a substitute for professional medical care</li>
              <li>You are at least 18 years of age</li>
            </ul>
          </section>

          <section>
            <h2>Intellectual Property</h2>
            <p>
              All content, algorithms, data, and materials on the Service are the property of Find Your Supplement
              and are protected by intellectual property laws. You may not copy, reproduce, distribute, or create
              derivative works from our content without written permission.
            </p>
          </section>

          <section>
            <h2>Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Find Your Supplement and its creators shall not be liable
              for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits
              or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other
              intangible losses resulting from your use of the Service.
            </p>
            <p>
              We are not responsible for any adverse health effects that may result from supplement use, whether
              or not those supplements were recommended by our Service.
            </p>
          </section>

          <section>
            <h2>Modifications</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be posted on this page with an
              updated &quot;Last updated&quot; date. Your continued use of the Service after changes are posted
              constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2>Termination</h2>
            <p>
              We may terminate or suspend your access to the Service at any time, without prior notice, for any
              reason. Since no account is required and all data is stored locally on your device, termination
              simply means restricting access to the Service.
            </p>
          </section>

          <section>
            <h2>Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in
              which Find Your Supplement operates, without regard to conflict of law provisions.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              Questions about these Terms? Contact us at:{' '}
              <a href="mailto:support@findyoursupplement.co" className="text-teal hover:text-teal-light">
                support@findyoursupplement.co
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
