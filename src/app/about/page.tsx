import Link from 'next/link'
import type { Metadata } from 'next'
import { supplements } from '@/data/supplements'

const SUPPLEMENT_COUNT = supplements.length

export const metadata: Metadata = {
  title: 'How It Works | Evidence-Based Supplement Methodology',
  description:
    'Learn how Find Your Supplement uses PubMed research to generate personalized supplement recommendations. Our evidence-based methodology explained.',
  alternates: {
    canonical: 'https://findyoursupplement.co/about/',
  },
  openGraph: {
    title: 'How It Works | Find Your Supplement',
    description:
      'Our evidence-based methodology for personalized supplement recommendations. Learn how our scoring algorithm uses PubMed research.',
    url: 'https://findyoursupplement.co/about/',
    type: 'website',
  },
}

const methodologySteps = [
  {
    step: '01',
    title: 'You answer a short quiz',
    desc: 'Four steps covering your health goals, diet type, lifestyle factors (sun exposure, exercise, alcohol, caffeine, stress), and optional symptoms. No account required. Takes under 2 minutes.',
  },
  {
    step: '02',
    title: 'We score each supplement',
    desc: `Our engine evaluates ${SUPPLEMENT_COUNT} supplements across four dimensions: your diet (strongest signal), lifestyle factors, reported symptoms, and stated goals. Each dimension is weighted based on its clinical diagnostic accuracy in the PubMed literature.`,
  },
  {
    step: '03',
    title: 'Results are ranked by relevance',
    desc: "Supplements are ranked by a relevance score (0–100) normalized to the data you've provided. High priority (≥60) means strong multi-dimensional support. Medium (30–59) means moderate relevance. Low (<30) is notable but not critical.",
  },
  {
    step: '04',
    title: 'Evidence tiers contextualize quality',
    desc: 'Each supplement is tagged with an evidence tier reflecting underlying research quality: Strong = meta-analyses and RCTs, Moderate = multiple controlled trials, Limited = small trials, Weak = preliminary or mechanistic evidence only.',
  },
]

const privacyPoints = [
  {
    title: 'No account, no tracking',
    desc: 'You never create an account. We never set cookies for tracking. Your quiz answers are processed entirely in your browser using JavaScript.',
  },
  {
    title: 'No server storage',
    desc: "Your health profile never leaves your device. It lives in sessionStorage — a temporary in-browser store — and is cleared when you close the tab.",
  },
  {
    title: 'No data sold, ever',
    desc: 'We have no ad network, no analytics pipeline, and no data broker relationships. The business model is Amazon affiliate commissions only.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does Find Your Supplement work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `You take a free 2-minute quiz about your health goals, diet, lifestyle, and symptoms. Our scoring engine evaluates ${SUPPLEMENT_COUNT} supplements across four dimensions — diet, lifestyle, symptoms, and goals — weighted by clinical diagnostic accuracy from PubMed research. Results are ranked by relevance score (0–100) and each supplement is tagged with an evidence tier (Strong, Moderate, Limited, or Weak).`,
      },
    },
    {
      '@type': 'Question',
      name: 'Is Find Your Supplement free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, completely free. No account, no subscription, no paywall. We earn a small commission through the Amazon Associates affiliate program when you purchase supplements through our links, at no extra cost to you.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my health data private?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your quiz answers are processed entirely in your browser using JavaScript. Your health profile never leaves your device — it lives in sessionStorage and is cleared when you close the tab. We never store, sell, or share your health data.',
      },
    },
    {
      '@type': 'Question',
      name: 'What do the evidence tiers (Strong, Moderate, Limited, Weak) mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Strong evidence means the supplement is backed by meta-analyses and systematic RCTs (the gold standard). Moderate evidence means multiple controlled trials with consistent findings. Limited evidence means small trials where more research is needed. Weak evidence means preliminary research from in-vitro, animal studies, or very small human trials.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I replace my doctor with this quiz?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. This tool is for informational and educational purposes only. It is not medical advice and should not replace consultation with a qualified healthcare professional. Always speak to your doctor before starting any supplement regimen, especially if you are pregnant, nursing, or taking medications.',
      },
    },
  ],
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://findyoursupplement.co/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'How It Works',
      item: 'https://findyoursupplement.co/about/',
    },
  ],
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Hero */}
      <div className="bg-surface border-b border-border py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal/10 border border-teal/20 text-teal text-xs font-medium mb-5">
            About the Project
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">
            Evidence-based. Privacy-first. Free, always.
          </h1>
          <p className="text-text-secondary text-base leading-relaxed max-w-2xl">
            Find Your Supplement is a personalized supplement recommendation engine built on PubMed research.
            It started as a mobile app and now has a web version so anyone can access it instantly, without
            downloading anything.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-16">

        {/* The problem */}
        <section>
          <h2 className="text-2xl font-bold text-text mb-4">The problem we're solving</h2>
          <div className="prose">
            <p>
              The supplement industry is a $177 billion market filled with marketing claims, proprietary
              blends, and influencer promotions. Most people don&apos;t know which supplements they actually need —
              and end up spending money on things that do nothing for their specific situation.
            </p>
            <p>
              The science, however, is clear. Certain nutrients are systematically deficient in certain diets.
              Lifestyle factors like low sun exposure, intense exercise, or chronic stress create specific
              nutritional demands. Symptoms can point to likely deficiencies. None of this is secret — it&apos;s all
              published in peer-reviewed literature.
            </p>
            <p>
              We built this tool to translate that research into simple, personalized recommendations — without
              selling you anything.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section>
          <h2 className="text-2xl font-bold text-text mb-2">How the engine works</h2>
          <p className="text-text-secondary text-sm mb-8">
            Our algorithm is a weighted, multi-dimensional scoring system calibrated against PubMed
            systematic reviews and clinical diagnostic accuracy data.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {methodologySteps.map((s) => (
              <div key={s.step} className="bg-surface border border-border rounded-xl p-5 relative">
                <span className="text-text-tertiary font-mono text-xs absolute top-4 right-5">{s.step}</span>
                <h3 className="text-text font-semibold text-sm mb-2 pr-8">{s.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Evidence tiers */}
        <section>
          <h2 className="text-2xl font-bold text-text mb-4">Evidence tiers explained</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                tier: 'Strong',
                color: 'bg-grade-a/10 border-grade-a/30 text-grade-a',
                title: 'Meta-analyses & systematic RCTs',
                desc: 'The gold standard. Multiple high-quality randomized controlled trials, often synthesized in systematic reviews and meta-analyses.',
              },
              {
                tier: 'Moderate',
                color: 'bg-grade-b/10 border-grade-b/30 text-grade-b',
                title: 'Multiple controlled trials',
                desc: 'Several well-designed RCTs with consistent findings, or a smaller number of large-scale trials.',
              },
              {
                tier: 'Limited',
                color: 'bg-grade-c/10 border-grade-c/30 text-grade-c',
                title: 'Small or emerging trials',
                desc: 'Some clinical evidence exists but is limited in scale, duration, or consistency. More research needed.',
              },
              {
                tier: 'Weak',
                color: 'bg-grade-d/10 border-grade-d/30 text-grade-d',
                title: 'Preliminary research',
                desc: 'Mostly in-vitro, animal studies, or very small human trials. Mechanistically plausible but not yet well-established clinically.',
              },
            ].map((g) => (
              <div key={g.tier} className={`flex gap-4 p-4 rounded-xl border ${g.color}`}>
                <span className="text-base font-bold flex-shrink-0 self-center whitespace-nowrap">{g.tier}</span>
                <div>
                  <p className="font-semibold text-sm mb-1">{g.title}</p>
                  <p className="text-xs leading-relaxed opacity-80">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy */}
        <section>
          <h2 className="text-2xl font-bold text-text mb-2">Privacy first</h2>
          <p className="text-text-secondary text-sm mb-6">
            Your health data is personal. We treat it that way.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {privacyPoints.map((p) => (
              <div key={p.title} className="bg-surface border border-border rounded-xl p-5">
                <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-text font-semibold text-sm mb-2">{p.title}</h3>
                <p className="text-text-secondary text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Business model */}
        <section className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-text mb-3">How we make money (transparency)</h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            This site is free and has no subscription. Revenue comes exclusively from the Amazon Associates
            affiliate program. When you click &ldquo;Buy on Amazon&rdquo; and make a purchase, we earn a small
            commission (typically 1–4%) at no extra cost to you.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            Our recommendations are based entirely on your quiz responses and the scientific literature —
            not on commission rates or brand partnerships. We link to the supplement category on Amazon
            (e.g., &ldquo;Vitamin D3 supplement&rdquo;) so you can choose the product that best fits your needs and
            budget. We don&apos;t push specific brands.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-text mb-3">Try it yourself</h2>
          <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
            The quiz takes under 2 minutes. No account, no email, no credit card.
          </p>
          <Link
            href="/quiz"
            className="inline-block bg-teal hover:bg-teal-light text-bg font-semibold text-base px-10 py-4 rounded-xl transition-colors shadow-lg shadow-teal/20"
          >
            Take the Free Quiz →
          </Link>
        </section>
      </div>
    </div>
  )
}
