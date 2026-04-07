import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Find Your Supplement app and website.',
  alternates: { canonical: 'https://findyoursupplement.co/privacy/' },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-bold text-text mb-2">Privacy Policy</h1>
        <p className="text-text-tertiary text-sm mb-10">Last updated: April 6, 2026</p>

        <div className="prose space-y-6">
          <section>
            <h2>Overview</h2>
            <p>
              Find Your Supplement (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, and safeguard your information when you use our
              website (findyoursupplement.co) and mobile application.
            </p>
          </section>

          <section>
            <h2>Information We Collect</h2>

            <h3>Quiz Data (Website)</h3>
            <p>
              When you take our supplement quiz, we collect your health goals, diet type, lifestyle factors, and
              symptoms. <strong>This data is stored exclusively in your browser&apos;s session storage and is never
              sent to our servers.</strong> It is deleted when you close your browser tab.
            </p>

            <h3>Health Data (Mobile App)</h3>
            <p>
              The mobile app may collect additional health information including blood work values and genetic
              variant data. <strong>All health data is stored exclusively on your device</strong> using encrypted
              local storage. We do not have access to this data.
            </p>

            <h3>AI-Assisted Features</h3>
            <p>
              If you use the PDF lab report upload or DNA file parsing features in the mobile app, the minimum
              necessary data is sent to OpenAI&apos;s API for processing. OpenAI does not use this data to train
              their models (per their API data usage policy). No health data is stored on OpenAI&apos;s servers
              beyond the processing window.
            </p>

            <h3>Analytics</h3>
            <p>
              We use Google Analytics 4 to collect anonymous usage data such as page views, quiz completion rates,
              and button clicks. This data does not include any health information, quiz answers, or personally
              identifiable information. You can opt out of analytics by using a browser extension like
              Google Analytics Opt-out.
            </p>

            <h3>Email</h3>
            <p>
              If you voluntarily provide your email address (e.g., to receive your supplement plan or a lead magnet),
              we store it in ConvertKit for email communication. You can unsubscribe at any time using the link in
              any email we send.
            </p>
          </section>

          <section>
            <h2>How We Use Your Information</h2>
            <ul>
              <li>To generate personalized supplement recommendations based on your quiz answers</li>
              <li>To improve our recommendation algorithm and website experience</li>
              <li>To send you your supplement plan and educational content (if you opt in)</li>
              <li>To understand aggregate usage patterns (via anonymous analytics)</li>
            </ul>
          </section>

          <section>
            <h2>What We Do NOT Do</h2>
            <ul>
              <li>We do not sell your personal data to third parties</li>
              <li>We do not share your health data with advertisers</li>
              <li>We do not store your quiz answers on our servers</li>
              <li>We do not require you to create an account</li>
              <li>We do not track you across other websites</li>
            </ul>
          </section>

          <section>
            <h2>Affiliate Links</h2>
            <p>
              Our website and app contain Amazon affiliate links (tag: insquire-20). When you click these links
              and make a purchase, we earn a small commission at no extra cost to you. Amazon may collect data
              about your purchase according to their own privacy policy.
            </p>
          </section>

          <section>
            <h2>Data Retention</h2>
            <p>
              Quiz data: Deleted when you close your browser tab (website) or clear app data (mobile app).
              Email addresses: Retained until you unsubscribe.
              Analytics data: Retained by Google Analytics for up to 14 months.
            </p>
          </section>

          <section>
            <h2>Children&apos;s Privacy</h2>
            <p>
              Our service is not directed to children under 18. We do not knowingly collect personal information
              from children.
            </p>
          </section>

          <section>
            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the top of this
              page indicates when the policy was last revised.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, contact us at:{' '}
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
