import Link from 'next/link'
import { notFound } from 'next/navigation'
import { blogPosts, getBlogPost } from '@/data/blogPosts'
import type { Metadata } from 'next'
import LeadMagnetPopup from '@/components/LeadMagnetPopup'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPost(params.slug)
  if (!post) return { title: 'Not Found' }
  const url = `https://findyoursupplement.shop/blog/${post.slug}/`
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: 'article',
      publishedTime: post.date,
      authors: ['Find Your Supplement'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

function renderMarkdown(content: string) {
  // Simple paragraph/heading splitter — good enough for our static blog content
  const lines = content.trim().split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()

    if (!line) {
      i++
      continue
    }

    if (line.startsWith('## ')) {
      elements.push(<h2 key={i}>{line.slice(3)}</h2>)
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i}>{line.slice(4)}</h3>)
    } else if (line.startsWith('| ')) {
      // Table — collect all rows
      const rows: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(lines[i].trim())
        i++
      }
      const [header, , ...body] = rows
      const headers = header.split('|').filter(Boolean).map((h) => h.trim())
      const bodyRows = body.map((r) => r.split('|').filter(Boolean).map((c) => c.trim()))
      elements.push(
        <table key={`table-${i}`}>
          <thead>
            <tr>{headers.map((h, j) => <th key={j}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {bodyRows.map((row, ri) => (
              <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      )
      continue
    } else if (line.startsWith('- ')) {
      // Collect list items
      const items: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().slice(2))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`}>
          {items.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
          ))}
        </ul>
      )
      continue
    } else if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      // Bold-only paragraph (section header style)
      elements.push(
        <p key={i} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
      )
    } else if (line.startsWith('*') && line.endsWith('*')) {
      elements.push(
        <p key={i}>
          <em dangerouslySetInnerHTML={{ __html: formatInline(line.slice(1, -1)) }} />
        </p>
      )
    } else {
      elements.push(
        <p key={i} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
      )
    }

    i++
  }

  return elements
}

function formatInline(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-teal hover:underline">$1</a>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="font-mono bg-surface-alt px-1 py-0.5 rounded text-xs">$1</code>')
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPost(params.slug)
  if (!post) notFound()

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3)

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://findyoursupplement.shop/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://findyoursupplement.shop/blog/',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://findyoursupplement.shop/blog/${post.slug}/`,
      },
    ],
  }

  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: 'Find Your Supplement',
      url: 'https://findyoursupplement.shop',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Find Your Supplement',
      url: 'https://findyoursupplement.shop',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://findyoursupplement.shop/blog/${post.slug}/`,
    },
    url: `https://findyoursupplement.shop/blog/${post.slug}/`,
    articleSection: post.category,
  }

  return (
    <div className="min-h-screen bg-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Breadcrumb */}
      <div className="border-b border-border bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-text transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-text-secondary truncate">{post.title}</span>
        </div>
      </div>

      {/* Article header */}
      <div className="bg-surface border-b border-border py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs text-teal font-medium bg-teal/10 px-2.5 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-text-tertiary text-xs">{post.readTime}</span>
            <span className="text-text-tertiary text-xs">·</span>
            <time className="text-text-tertiary text-xs">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text leading-snug mb-4">
            {post.title}
          </h1>
          <p className="text-text-secondary text-base leading-relaxed">{post.excerpt}</p>
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main content */}
          <article className="flex-1 min-w-0 prose">
            {renderMarkdown(post.content)}
          </article>

          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0 space-y-6">
            {/* CTA */}
            <div className="bg-surface border border-teal/20 rounded-xl p-5 sticky top-24">
              <p className="text-text font-semibold text-sm mb-2">
                Find your supplements
              </p>
              <p className="text-text-secondary text-xs leading-relaxed mb-4">
                Take our free 2-min quiz for personalized recommendations based on your goals, diet, and lifestyle.
              </p>
              <Link
                href="/quiz"
                className="block w-full bg-teal hover:bg-teal-light text-bg text-xs font-semibold text-center px-4 py-2.5 rounded-lg transition-colors"
              >
                Take Free Quiz →
              </Link>
            </div>

            {/* Related posts */}
            {related.length > 0 && (
              <div>
                <h3 className="text-text-tertiary text-xs font-semibold uppercase tracking-wider mb-3">
                  Related Articles
                </h3>
                <div className="space-y-3">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/blog/${r.slug}`}
                      className="block group"
                    >
                      <span className="text-xs text-teal mb-1 block">{r.category}</span>
                      <p className="text-text-secondary group-hover:text-text text-sm font-medium leading-snug transition-colors line-clamp-2">
                        {r.title}
                      </p>
                      <span className="text-text-tertiary text-xs">{r.readTime}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Medical disclaimer */}
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-text-tertiary text-xs leading-relaxed">
            <strong className="text-text-secondary">Medical Disclaimer:</strong>{' '}
            This article is for informational and educational purposes only. It is not intended as medical advice
            and should not replace consultation with a qualified healthcare professional. Always speak to your
            doctor before starting any supplement regimen, especially if you are pregnant, nursing, or taking
            medications.
          </p>
        </div>

        {/* Back to blog */}
        <div className="mt-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>
      </div>
      <LeadMagnetPopup />
    </div>
  )
}
