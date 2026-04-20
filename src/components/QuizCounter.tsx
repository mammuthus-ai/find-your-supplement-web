'use client'

import { useEffect, useState } from 'react'
import { getPublicStat } from '@/lib/publicStats'

interface QuizCounterProps {
  className?: string
}

/**
 * Social-proof widget that shows the real number of people who have
 * completed the quiz, read live from Supabase public_stats.quiz_completions.
 *
 * The /results page calls incrementPublicStat('quiz_completions') on mount,
 * so every genuine completion bumps the counter. Renders nothing while
 * loading (avoids layout shift) or if the fetch fails.
 */
export default function QuizCounter({ className = '' }: QuizCounterProps) {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    getPublicStat('quiz_completions').then((n) => {
      if (!cancelled && typeof n === 'number') setCount(n)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Don't render fake or placeholder state while loading / on failure
  if (count === null || count < 1) return null

  return (
    <p className={`text-text-secondary text-sm ${className}`}>
      <span className="text-teal font-semibold">{count.toLocaleString('en-US')}+</span>{' '}
      people have found their supplements
    </p>
  )
}
