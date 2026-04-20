'use client'

import type { TopProduct } from '@/types'

interface Props {
  products: TopProduct[]
  supplementName: string
}

const AMAZON_TAG = 'insquire-20'

function scoreColor(score: number): string {
  // Match the app's palette semantics
  if (score >= 85) return 'text-teal border-teal bg-teal/10'
  if (score >= 70) return 'text-grade-b border-grade-b bg-grade-b/10'
  if (score >= 55) return 'text-grade-c border-grade-c bg-grade-c/10'
  return 'text-text-tertiary border-border bg-surface-alt'
}

function amazonUrl(product: TopProduct): string {
  if (product.asin) {
    return `https://www.amazon.com/dp/${product.asin}?tag=${AMAZON_TAG}`
  }
  const q = `${product.brand} ${product.productName}`
  return `https://www.amazon.com/s?k=${encodeURIComponent(q)}&tag=${AMAZON_TAG}`
}

export default function TopProductsCard({ products, supplementName }: Props) {
  if (!products || products.length === 0) return null
  const top = products.slice(0, 3)

  return (
    <div className="mt-4">
      <div className="flex items-baseline justify-between mb-2">
        <h4 className="text-text font-semibold text-sm">Where to buy</h4>
        <span className="text-text-tertiary text-xs">
          Top {top.length} by objective quality score
        </span>
      </div>

      <div className="space-y-2">
        {top.map((p) => (
          <a
            key={`${p.brand}-${p.productName}`}
            href={amazonUrl(p)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block bg-surface border border-border rounded-lg p-3 hover:border-teal transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-text-tertiary text-sm font-mono pt-0.5">
                #{p.rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-text-secondary text-xs font-semibold uppercase tracking-wide">
                  {p.brand}
                </div>
                <div className="text-text text-sm font-medium leading-tight mt-0.5 truncate">
                  {p.productName}
                </div>
              </div>
              <div
                className={`flex-shrink-0 border-2 rounded px-2 py-0.5 ${scoreColor(p.totalScore)}`}
              >
                <span className="text-base font-bold">{Math.round(p.totalScore)}</span>
                <span className="text-xs opacity-70">/100</span>
              </div>
            </div>

            {p.certifications.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2 ml-7">
                {p.certifications.slice(0, 3).map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 bg-teal/10 text-teal text-xs font-semibold rounded px-2 py-0.5"
                  >
                    ✓ {c}
                  </span>
                ))}
              </div>
            )}

            <div className="text-text-tertiary text-xs mt-2 ml-7">
              Lab {Math.round(p.labVerification)}/40 · Dose {Math.round(p.doseMatch)}/30 · Form{' '}
              {Math.round(p.formAccuracy)}/20 · Mfg {Math.round(p.manufacturing)}/10
            </div>

            <div className="flex items-center gap-1 mt-2 ml-7 pt-2 border-t border-border">
              <span className="text-teal text-xs font-semibold flex-1">Buy on Amazon →</span>
            </div>
          </a>
        ))}
      </div>

      <p className="text-text-tertiary text-xs italic text-center mt-2 leading-snug">
        Scored by third-party lab testing, clinical dose match, ingredient form,
        and manufacturing transparency. Excludes user reviews and brand reputation by design.
      </p>
    </div>
  )
}
