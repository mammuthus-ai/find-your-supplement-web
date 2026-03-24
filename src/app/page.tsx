import Link from 'next/link'
import { blogPosts } from '@/data/blogPosts'

const features = [
  {
    icon: '🎯',
    title: 'Tell Us About Yourself',
    desc: 'Answer a short quiz about your health goals, diet, lifestyle, and symptoms.',
  },
  {
    icon: '🔬',
    title: 'Evidence-Based Scoring',
    desc: 'Our engine weighs your answers against PubMed research to rank supplements by relevance.',
  },
  {
    icon: '🛒',
    title: 'Buy with Confidence',
    desc: "Shop directly on Amazon. We link to top-rated products — you're never overcharged.",
  },
]

const sampleSupplements = [
  { name: 'Vitamin D3', grade: 'A', goalTag: 'Immunity · Mood · Energy', gradeColor: 'bg-grade-a/20 text-grade-a border-grade-a/30' },
  { name: 'Magnesium Glycinate', grade: 'A', goalTag: 'Sleep · Stress · Recovery', gradeColor: 'bg-grade-a/20 text-grade-a border-grade-a/30' },
  { name: 'Omega-3 (Fish Oil)', grade: 'A', goalTag: 'Brain · Heart · Mood', gradeColor: 'bg-grade-a/20 text-grade-a border-grade-a/30' },
  { name: 'Ashwagandha KSM-66', grade: 'B', goalTag: 'Stress · Sleep · Muscle', gradeColor: 'bg-grade-b/20 text-grade-b border-grade-b/30' },
  { name: 'Creatine Monohydrate', grade: 'A', goalTag: 'Muscle · Focus · Energy', gradeColor: 'bg-grade-a/20 text-grade-a border-grade-a/30' },
  { name: 'NAC (N-Acetyl Cysteine)', grade: 'B', goalTag: 'Longevity · Immunity · Mood', gradeColor: 'bg-grade-b/20 text-grade-b border-grade-b/30' },
]

const trustPoints = [
  {
    icon: (
      <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: 'Evidence-Based Only',
    desc: 'Every recommendation is graded (A–D) based on PubMed research quality. No hype, no snake oil.',
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
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-teal/5 blur-3xl rounded-full" />
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
            No account required · 2 minutes · 15 supplements analyzed
          </p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="relative bg-surface border border-border rounded-xl p-6 card-hover"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <div className="absolute top-5 right-5 text-text-tertiary text-sm font-mono">
                0{i + 1}
              </div>
              <h3 className="text-text font-semibold text-base mb-2">{f.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
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
                15 science-backed supplements, each graded A–D on evidence quality.
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
                className="bg-bg border border-border rounded-xl p-4 flex items-start gap-3 card-hover"
              >
                <span
                  className={`flex-shrink-0 text-xs font-bold px-2 py-1 rounded border ${s.gradeColor}`}
                >
                  {s.grade}
                </span>
                <div>
                  <p className="text-text font-medium text-sm">{s.name}</p>
                  <p className="text-text-tertiary text-xs mt-0.5">{s.goalTag}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-text-tertiary text-xs text-center mt-6">
            Evidence grades: A = meta-analyses/RCTs · B = multiple RCTs · C = limited trials · D = preliminary
          </p>
        </div>
      </section>

      {/* ── Trust section ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-text mb-3">Why trust us?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trustPoints.map((t, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
                  {t.icon}
                </div>
                <h3 className="text-text font-semibold text-sm">{t.title}</h3>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-surface border border-teal/20 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-teal/5 blur-3xl" />
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
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-bg border border-border rounded-xl overflow-hidden card-hover group"
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
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
