import Link from 'next/link'
import { blogPosts } from '@/data/blogPosts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — Evidence-Based Supplement Guides',
  description:
    'Research-backed articles on supplements, vitamins, and nutrition. Deep dives into the science behind the supplements you take.',
  alternates: { canonical: 'https://findyoursupplement.co/blog/' },
  openGraph: {
    title: 'Blog — Evidence-Based Supplement Guides | Find Your Supplement',
    description:
      'Research-backed articles on supplements, vitamins, and nutrition. Deep dives into the science behind the supplements you take.',
    url: 'https://findyoursupplement.co/blog/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Evidence-Based Supplement Guides',
    description:
      'Research-backed articles on supplements, vitamins, and nutrition. Deep dives into the science behind the supplements you take.',
  },
}

export default function BlogPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const categories = Array.from(new Set(blogPosts.map((p) => p.category)))

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="bg-surface border-b border-border py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-3">Blog</h1>
          <p className="text-text-secondary text-base leading-relaxed max-w-2xl">
            Evidence-based guides, research reviews, and practical advice on
            supplements, vitamins, and nutrition — backed by PubMed studies.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((cat) => (
              <span
                key={cat}
                className="text-xs text-teal font-medium bg-teal/10 px-2.5 py-1 rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Post grid */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid gap-5 sm:grid-cols-2">
          {sorted.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-surface border border-border rounded-xl p-5 hover:border-teal/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-teal font-medium bg-teal/10 px-2 py-0.5 rounded-full">
                  {post.category}
                </span>
                <span className="text-text-tertiary text-xs">{post.readTime}</span>
              </div>
              <h2 className="text-text font-semibold text-base leading-snug mb-2 group-hover:text-teal transition-colors line-clamp-2">
                {post.title}
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed line-clamp-2 mb-3">
                {post.excerpt}
              </p>
              <time className="text-text-tertiary text-xs">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-text-secondary text-sm mb-4">
            Want personalized recommendations based on the latest research?
          </p>
          <Link
            href="/quiz"
            className="inline-block bg-teal hover:bg-teal-light text-bg font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
          >
            Take the Free Quiz →
          </Link>
        </div>
      </div>
    </div>
  )
}
