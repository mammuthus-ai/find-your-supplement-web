import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center">
                <span className="text-bg font-bold text-sm">Fx</span>
              </div>
              <span className="font-semibold text-text">
                Find Your<span className="text-teal"> Supplement</span>
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
              Evidence-based, personalized supplement recommendations. No subscriptions,
              no upsells — just science-backed guidance and Amazon affiliate links.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-text font-semibold text-sm mb-3">Navigation</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/quiz', label: 'Take the Quiz' },
                { href: '/blog', label: 'Blog' },
                { href: '/about', label: 'About' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-text text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-text font-semibold text-sm mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-text-tertiary text-sm">
                  Affiliate Disclosure
                </span>
              </li>
              <li className="text-text-tertiary text-xs leading-relaxed">
                This site participates in the Amazon Associates program. We earn from qualifying purchases
                at no extra cost to you.
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-text-tertiary text-xs">
            © {new Date().getFullYear()} Find Your Supplement. All rights reserved.
          </p>
          <p className="text-text-tertiary text-xs max-w-md">
            <strong className="text-text-secondary">Medical Disclaimer:</strong>{' '}
            Content is for informational purposes only. Always consult a qualified healthcare provider before
            starting any supplement regimen.
          </p>
        </div>
      </div>
    </footer>
  )
}
