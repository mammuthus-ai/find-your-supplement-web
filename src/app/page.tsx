import type { Metadata } from 'next'
import Link from 'next/link'
import { blogPosts } from '@/data/blogPosts'
import { supplements } from '@/data/supplements'
import QuizCounter from '@/components/QuizCounter'

const SUPPLEMENT_COUNT = supplements.length

export const metadata: Metadata = {
  title: 'Find Your Supplement | Free Personalized Supplement Quiz',
  description:
    'Take our free 2-minute quiz to discover which supplements your body actually needs. Evidence-based, personalized recommendations for energy, sleep, focus, immunity, and more.',
  alternates: {
    canonical: 'https://findyoursupplement.co/',
  },
  openGraph: {
    title: 'Find Your Supplement | Free Personalized Supplement Quiz',
    description:
      'Take our free 2-minute quiz to discover which supplements your body actually needs. Personalized, evidence-based recommendations.',
    url: 'https://findyoursupplement.co/',
    type: 'website',
  },
}

const features = [
  {
    icon: '🎯',
    title: 'Tell Us About Yourself',
    desc: 'Answer a short quiz about your health goals, diet, lifestyle, and symptoms.',
    image: '/images/tell-us-about-yourself.png',
  },
  {
    icon: '🔬',
    title: 'Evidence-Based Scoring',
    desc: 'Our engine weighs your answers against PubMed research to rank supplements by relevance.',
    image: '/images/evidence-based-scoring.png',
  },
  {
    icon: '🛒',
    title: 'Buy with Confidence',
    desc: "Shop directly on Amazon. We link to top-rated products — you're never overcharged.",
    image: '/images/buy-with-confidence.png',
  },
]

const sampleSupplements = [
  { name: 'Vitamin D3', emoji: '☀️', evidence: 'Strong', goalTag: 'Immunity · Mood · Energy', gradeColor: 'bg-grade-a/15 text-grade-a border-grade-a/30', borderColor: 'border-l-grade-a' },
  { name: 'Magnesium Glycinate', emoji: '🧪', evidence: 'Strong', goalTag: 'Sleep · Stress · Recovery', gradeColor: 'bg-grade-a/15 text-grade-a border-grade-a/30', borderColor: 'border-l-grade-a' },
  { name: 'Omega-3 (Fish Oil)', emoji: '🐟', evidence: 'Strong', goalTag: 'Brain · Heart · Mood', gradeColor: 'bg-grade-a/15 text-grade-a border-grade-a/30', borderColor: 'border-l-grade-a' },
  { name: 'Ashwagandha KSM-66', emoji: '🌿', evidence: 'Moderate', goalTag: 'Stress · Sleep · Muscle', gradeColor: 'bg-grade-b/15 text-grade-b border-grade-b/30', borderColor: 'border-l-grade-b' },
  { name: 'Creatine Monohydrate', emoji: '💪', evidence: 'Strong', goalTag: 'Muscle · Focus · Energy', gradeColor: 'bg-grade-a/15 text-grade-a border-grade-a/30', borderColor: 'border-l-grade-a' },
  { name: 'NAC (N-Acetyl Cysteine)', emoji: '🛡️', evidence: 'Moderate', goalTag: 'Longevity · Immunity · Mood', gradeColor: 'bg-grade-b/15 text-grade-b border-grade-b/30', borderColor: 'border-l-grade-b' },
]

const trustPoints = [
  {
    icon: (
      <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: 'Evidence-Based Only',
    desc: 'Every recommendation is ranked by research quality — from strong to preliminary evidence. No hype, no snake oil.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Privacy First',
    desc: 'Your quiz answers stay in your browser. We never store, sell, or share your health data.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Free, Always',
    desc: 'No account. No subscription. No paywall. We earn a small Amazon affiliate commission if you buy.',
  },
]

export default function HomePage() {
  const recentPosts = blogPosts.slice(0, 3)

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background mesh gradient */}
        <div className="absolute inset-0 pointer-events-none gradient-mesh" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-teal/8 blur-3xl rounded-full" />
          <div className="absolute top-20 right-[10%] w-[300px] h-[300px] bg-grade-b/8 blur-3xl rounded-full" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal/10 border border-teal/20 text-teal text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
            Evidence-graded · Privacy-first · Free
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text leading-tight tracking-tight mb-6">
            Find the supplements{' '}
            <span className="gradient-text">your body actually needs</span>
          </h1>

          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Answer a 2-minute quiz about your health goals, diet, and lifestyle. Get
            personalized, science-backed supplement recommendations — ranked by evidence
            and relevance to <em>you</em>.
          </p>

          <QuizCounter className="mb-6" />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/quiz"
              className="w-full sm:w-auto bg-teal hover:bg-teal-light text-bg font-semibold text-base px-8 py-4 rounded-xl transition-colors shadow-lg shadow-teal/20"
            >
              Take the Free Quiz →
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto border border-border hover:border-text-secondary text-text-secondary hover:text-text font-medium text-base px-8 py-4 rounded-xl transition-colors"
            >
              How It Works
            </Link>
          </div>

          <p className="text-text-tertiary text-sm mt-4">
            No account required · 2 minutes · {SUPPLEMENT_COUNT} supplements analyzed
          </p>
        </div>
      </section>

      {/* ── Get the App ── */}
      <section className="bg-surface border-y border-border py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-text mb-2">
                Get the app for the full experience
              </h2>
              <p className="text-text-secondary max-w-md">
                Unlock all recommendations, dosage guidance, blood work analysis, and genetic insights. Available on iOS and Android.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href="https://apps.apple.com/app/find-your-supplement/id6761743777"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-text text-bg font-semibold px-6 py-3.5 rounded-xl hover:opacity-90 transition-opacity"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] leading-none opacity-80">Download on the</div>
                  <div className="text-base leading-tight">App Store</div>
                </div>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.findyoursupplement.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-text text-bg font-semibold px-6 py-3.5 rounded-xl hover:opacity-90 transition-opacity"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.3 2.3-8.636-8.632z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] leading-none opacity-80">Get it on</div>
                  <div className="text-base leading-tight">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-text mb-3">How it works</h2>
          <p className="text-text-secondary max-w-lg mx-auto">
            Our scoring engine is adapted from PubMed systematic reviews and meta-analyses.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connecting line on desktop */}
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          {features.map((f, i) => (
            <div
              key={i}
              className="relative bg-surface border border-border rounded-xl overflow-hidden card-hover"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={f.image}
                  alt={f.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-teal/15 border border-teal/25 flex items-center justify-center text-teal text-xs font-bold">
                    {i + 1}
                  </div>
                  <h3 className="text-text font-semibold text-base">{f.title}</h3>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sample supplements ── */}
      <section className="bg-surface border-y border-border py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text mb-1">
                Supplements we analyze
              </h2>
              <p className="text-text-secondary text-sm">
                {SUPPLEMENT_COUNT} science-backed supplements, each ranked by evidence quality.
              </p>
            </div>
            <Link
              href="/quiz"
              className="flex-shrink-0 bg-teal hover:bg-teal-light text-bg text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Get My Recommendations
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleSupplements.map((s) => (
              <div
                key={s.name}
                className={`bg-bg border border-border border-l-2 ${s.borderColor} rounded-xl p-4 flex items-start gap-3 card-hover`}
              >
                <span className="text-xl flex-shrink-0">{s.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-text font-medium text-sm">{s.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${s.gradeColor}`}>Evidence: {s.evidence}</span>
                  </div>
                  <p className="text-text-tertiary text-xs mt-1">{s.goalTag}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-text-tertiary text-xs text-center mt-6">
            Evidence tiers: Strong = meta-analyses &amp; RCTs · Moderate = multiple RCTs · Limited = small trials · Weak = early research
          </p>
        </div>
      </section>

      {/* ── Trust section ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-text mb-3">Why trust us?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trustPoints.map((t, i) => {
            const bgColors = ['bg-teal/10', 'bg-grade-b/10', 'bg-grade-a/10']
            const borderColors = ['border-teal/20', 'border-grade-b/20', 'border-grade-a/20']
            return (
              <div key={i} className="bg-surface border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-xl ${bgColors[i]} border ${borderColors[i]} flex items-center justify-center flex-shrink-0`}>
                    {t.icon}
                  </div>
                  <h3 className="text-text font-semibold text-sm">{t.title}</h3>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{t.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-surface border border-teal/20 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-72 h-48 bg-teal/8 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-40 bg-grade-b/8 blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold text-text mb-3">
              Ready to find your supplements?
            </h2>
            <p className="text-text-secondary mb-8 max-w-lg mx-auto">
              Takes 2 minutes. No account needed. Get personalized recommendations backed by PubMed research.
            </p>
            <Link
              href="/quiz"
              className="inline-block bg-teal hover:bg-teal-light text-bg font-semibold text-base px-10 py-4 rounded-xl transition-colors shadow-lg shadow-teal/20"
            >
              Start Free Quiz →
            </Link>
            <div className="flex items-center justify-center gap-4 mt-6">
              <a
                href="https://apps.apple.com/app/find-your-supplement/id6761743777"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-text text-sm underline underline-offset-2 transition-colors"
              >
                Download for iOS
              </a>
              <span className="text-text-tertiary">|</span>
              <a
                href="https://play.google.com/store/apps/details?id=com.findyoursupplement.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-text text-sm underline underline-offset-2 transition-colors"
              >
                Download for Android
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Blog preview ── */}
      <section className="bg-surface border-t border-border py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text mb-1">Latest from the Blog</h2>
              <p className="text-text-secondary text-sm">Supplement science, explained plainly.</p>
            </div>
            <Link
              href="/blog"
              className="text-teal hover:text-teal-light text-sm font-medium transition-colors"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentPosts.map((post) => {
              const categoryColors: Record<string, string> = {
                'Research Reviews': 'border-t-grade-a',
                'Deep Dives': 'border-t-grade-b',
                'Guides': 'border-t-teal',
                'Nutrition Science': 'border-t-priority-medium',
              }
              const topBorder = categoryColors[post.category] || 'border-t-teal'
              return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`block bg-bg border border-border border-t-2 ${topBorder} rounded-xl overflow-hidden card-hover group`}
              >
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-teal font-medium bg-teal/10 px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-text-tertiary text-xs">{post.readTime}</span>
                  </div>
                  <h3 className="text-text font-semibold text-sm leading-snug mb-2 group-hover:text-teal transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-text-secondary text-xs leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
                <div className="px-5 pb-4">
                  <span className="text-text-tertiary text-xs">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
