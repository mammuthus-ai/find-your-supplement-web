'use client'

import { useState } from 'react'
import type { SupplementRecommendation } from '@/types'

interface MyStackCardProps {
  recommendations: SupplementRecommendation[]
  goals: string[]
}

export default function MyStackCard({ recommendations, goals }: MyStackCardProps) {
  const [shared, setShared] = useState(false)
  const top5 = recommendations.slice(0, 5)

  const shareText = `My personalized supplement stack from Find Your Supplement:\n${top5
    .map((r, i) => `${i + 1}. ${r.supplement.name} (Evidence: ${r.evidenceGrade})`)
    .join('\n')}\n\nGet yours free: https://findyoursupplement.co/quiz`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Supplement Stack — Find Your Supplement',
          text: shareText,
          url: 'https://findyoursupplement.co/quiz',
        })
        setShared(true)
      } catch {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareText)
      setShared(true)
      setTimeout(() => setShared(false), 3000)
    }
  }

  const gradeColor = (g: string) =>
    ({ A: 'text-grade-a', B: 'text-grade-b', C: 'text-grade-c', D: 'text-grade-d' })[g] || 'text-text-secondary'

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      {/* Card header */}
      <div className="bg-surface-alt px-5 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-text font-semibold text-sm">My Supplement Stack</h3>
            <p className="text-text-tertiary text-xs mt-0.5">
              Based on: {goals.map((g) => g.replace(/_/g, ' ')).slice(0, 3).join(', ')}
              {goals.length > 3 ? ` +${goals.length - 3} more` : ''}
            </p>
          </div>
          <img
            src="/logo-512.png"
            alt="Find Your Supplement"
            width={32}
            height={32}
            className="flex-shrink-0 rounded-lg"
          />
        </div>
      </div>

      {/* Top 5 supplements */}
      <div className="p-4 space-y-2.5">
        {top5.map((rec, i) => (
          <div key={rec.supplement.id} className="flex items-center gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-surface-alt flex items-center justify-center text-text-tertiary text-xs font-mono">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-text text-sm font-medium truncate">{rec.supplement.name}</p>
            </div>
            <span className={`text-xs font-semibold ${gradeColor(rec.evidenceGrade)}`}>
              {rec.evidenceGrade}
            </span>
            <div className="w-12 h-1 bg-surface-alt rounded-full overflow-hidden flex-shrink-0">
              <div
                className="h-full bg-teal rounded-full"
                style={{ width: `${rec.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Share button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 bg-teal/10 hover:bg-teal/20 border border-teal/20 text-teal font-medium text-sm py-2.5 rounded-lg transition-colors"
        >
          {shared ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share my stack with a friend
            </>
          )}
        </button>
        <p className="text-text-tertiary text-[10px] text-center mt-2">
          Share & both get access to premium features
        </p>
      </div>

      {/* Footer */}
      <div className="bg-surface-alt px-4 py-2 border-t border-border">
        <p className="text-text-tertiary text-[10px] text-center">
          findyoursupplement.co — Science-backed supplement recommendations
        </p>
      </div>
    </div>
  )
}
