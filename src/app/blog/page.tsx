import Link from 'next/link'
import { blogPosts } from '@/data/blogPosts'

const categories = Array.from(new Set(blogPosts.map((p) => p.category)))

export const metadata = {
  title: 'Supplement Blog — Find Your Supplement',
  description:
    'Evidence-based supplement science, explained plainly. Deep dives, research reviews, and nutrition guides.',
}

export default function BlogPage() {
  const featured = blogPosts[0]
  const rest = blogPosts.slice(1)

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero */}
      <div className="bg-surface border-b border-border py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-3">Supplement Blog</h1>
          <p className="text-text-secondary text-base max-w-xl">
            Evidence-based supplement science, explained plainly. No hype — just PubMed-backed research.
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            {categories.map((cat) => (
              <span
                key={cat}
                className="text-xs px-3 py-1 rounded-full bg-teal/10 border border-teal/20 text-teal font-medium"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">

        {/* Featured post */}
        <div className="mb-12">
          <h2 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-4">
            Featured
          </h2>
          <Link
            href={`/blog/${featured.slug}`}
            className="block bg-surface border border-border rounded-2xl overflow-hidden card-hover group"
          >
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs text-teal font-medium bg-teal/10 px-2.5 py-1 rounded-full">
                  {featured.category}
                </span>
                <span className="text-text-tertiary text-xs">{featured.readTime}</span>
                <span className="text-text-tertiary text-xs">·</span>
                <span className="text-text-tertiary text-xs">
                  {new Date(featured.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-text leading-snug mb-3 group-hover:text-teal transition-colors">
                {featured.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed max-w-2xl">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-1.5 mt-5 text-teal text-sm font-medium">
                Read article
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Rest of posts */}
        <div>
          <h2 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-4">
            All Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-surface border border-border rounded-xl overflow-hidden card-hover group"
              >
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs text-teal font-medium bg-teal/10 px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-text-tertiary text-xs">{post.readTime}</span>
                  </div>
                  <h3 className="text-text font-semibold text-base leading-snug mb-2 group-hover:text-teal transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-text-tertiary text-xs">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="text-teal text-xs font-medium">Read →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 bg-surface border border-teal/20 rounded-2xl p-7 text-center">
          <h3 className="text-text font-bold text-lg mb-2">
            Ready to find your supplements?
          </h3>
          <p className="text-text-secondary text-sm mb-5">
            Take our free 2-minute quiz for personalized, evidence-based recommendations.
          </p>
          <Link
            href="/quiz"
            className="inline-block bg-teal hover:bg-teal-light text-bg font-semibold text-sm px-8 py-3 rounded-xl transition-colors"
          >
            Take the Free Quiz →
          </Link>
        </div>
      </div>
    </div>
  )
}
