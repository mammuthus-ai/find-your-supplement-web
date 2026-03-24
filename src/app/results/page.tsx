'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { buildRecommendations } from '@/engine/recommendationEngine'
import type { QuizProfile, SupplementRecommendation, Priority, EvidenceGrade } from '@/types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function priorityLabel(p: Priority) {
  return { high: 'High Priority', medium: 'Medium Priority', low: 'Lower Priority' }[p]
}

function priorityStyles(p: Priority) {
  return {
    high: 'bg-priority-high/10 text-priority-high border-priority-high/30',
    medium: 'bg-priority-medium/10 text-priority-medium border-priority-medium/30',
    low: 'bg-priority-low/10 text-priority-low border-priority-low/30',
  }[p]
}

function gradeStyles(g: EvidenceGrade) {
  return {
    A: 'bg-grade-a/10 text-grade-a border-grade-a/30',
    B: 'bg-grade-b/10 text-grade-b border-grade-b/30',
    C: 'bg-grade-c/10 text-grade-c border-grade-c/30',
    D: 'bg-grade-d/10 text-grade-d border-grade-d/30',
  }[g]
}

function gradeLabel(g: EvidenceGrade) {
  return {
    A: 'Grade A — Meta-analyses & RCTs',
    B: 'Grade B — Multiple RCTs',
    C: 'Grade C — Limited trials',
    D: 'Grade D — Preliminary evidence',
  }[g]
}

function amazonUrl(name: string) {
  return `https://www.amazon.com/s?k=${encodeURIComponent(name + ' supplement')}&tag=insquire-20`
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-surface-alt rounded-full overflow-hidden">
        <div
          className="h-full bg-teal rounded-full transition-all duration-700"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-teal text-xs font-semibold w-8 text-right">{score}</span>
    </div>
  )
}

// ─── Supplement card ──────────────────────────────────────────────────────────

function SupplementCard({ rec }: { rec: SupplementRecommendation }) {
  const [expanded, setExpanded] = useState(false)
  const { supplement: supp, score, rank, priority, reasons, evidenceGrade } = rec

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden card-hover">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 min-w-0">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-surface-alt border border-border flex items-center justify-center text-text-tertiary text-xs font-mono">
              {rank}
            </span>
            <div className="min-w-0">
              <h3 className="text-text font-semibold text-base leading-tight">{supp.name}</h3>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${priorityStyles(priority)}`}>
                  {priorityLabel(priority)}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded border ${gradeStyles(evidenceGrade)}`}>
                  Evidence {evidenceGrade}
                </span>
              </div>
            </div>
          </div>

          <a
            href={amazonUrl(supp.name)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex-shrink-0 flex items-center gap-1.5 bg-[#FF9900] hover:bg-[#E68900] text-black text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
            </svg>
            Buy on Amazon
          </a>
        </div>

        {/* Score bar */}
        <ScoreBar score={score} />

        {/* Description */}
        <p className="text-text-secondary text-sm leading-relaxed mt-3 line-clamp-2">
          {supp.description}
        </p>
      </div>

      {/* Why this supplement */}
      {reasons.length > 0 && (
        <div className="border-t border-border">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-5 py-3 text-xs font-medium text-text-secondary hover:text-text hover:bg-surface-alt transition-colors"
          >
            <span>Why this is recommended for you ({reasons.length} reason{reasons.length !== 1 ? 's' : ''})</span>
            <svg
              className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expanded && (
            <div className="px-5 pb-4 space-y-2.5">
              {reasons.map((r, i) => (
                <div key={i} className="flex gap-2.5">
                  <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 ${
                    r.type === 'diet' ? 'bg-grade-a' :
                    r.type === 'lifestyle' ? 'bg-teal' :
                    r.type === 'symptom' ? 'bg-priority-medium' :
                    'bg-grade-b'
                  }`} />
                  <div>
                    <p className="text-text text-xs font-medium">{r.label}</p>
                    <p className="text-text-tertiary text-xs mt-0.5">{r.detail}</p>
                  </div>
                </div>
              ))}

              {/* Evidence info */}
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-text-tertiary text-xs">{gradeLabel(evidenceGrade)}</span>
                <a
                  href={supp.nihUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal hover:text-teal-light text-xs underline transition-colors"
                >
                  NIH source →
                </a>
              </div>

              {/* Safe upper limit */}
              {supp.safeUpperLimit && (
                <div className="bg-surface-alt rounded-lg px-3 py-2.5">
                  <p className="text-text-tertiary text-xs">
                    <span className="text-text-secondary font-medium">Safe upper limit: </span>
                    {supp.safeUpperLimit}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Results grouped by priority ─────────────────────────────────────────────

function PriorityGroup({
  priority,
  recs,
}: {
  priority: Priority
  recs: SupplementRecommendation[]
}) {
  if (recs.length === 0) return null

  const dotColor = {
    high: 'bg-priority-high',
    medium: 'bg-priority-medium',
    low: 'bg-priority-low',
  }[priority]

  const label = {
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Lower Priority',
  }[priority]

  const desc = {
    high: 'Strongest match for your profile — consider these first.',
    medium: 'Relevant to your profile — worth considering.',
    low: 'Some relevance — nice-to-have based on your answers.',
  }[priority]

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2.5 mb-2">
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        <h2 className="text-text font-semibold text-base">{label}</h2>
        <span className="text-text-tertiary text-xs">{recs.length} supplement{recs.length !== 1 ? 's' : ''}</span>
      </div>
      <p className="text-text-tertiary text-xs mb-4 ml-4">{desc}</p>
      <div className="flex flex-col gap-3">
        {recs.map((rec) => (
          <SupplementCard key={rec.supplement.id} rec={rec} />
        ))}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<SupplementRecommendation[] | null>(null)
  const [profile, setProfile] = useState<QuizProfile | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('quizProfile')
    if (!raw) {
      router.replace('/quiz')
      return
    }
    try {
      const p: QuizProfile = JSON.parse(raw)
      setProfile(p)
      const recs = buildRecommendations(p)
      setRecommendations(recs)
    } catch {
      router.replace('/quiz')
    }
  }, [router])

  if (!recommendations || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-teal border-t-transparent rounded-full animate-spin" />
          <p className="text-text-secondary text-sm">Analyzing your profile…</p>
        </div>
      </div>
    )
  }

  const high = recommendations.filter((r) => r.priority === 'high')
  const medium = recommendations.filter((r) => r.priority === 'medium')
  const low = recommendations.filter((r) => r.priority === 'low')

  const goalLabels = profile.goals.map((g) => g.replace(/_/g, ' ')).join(', ')

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="bg-surface border-b border-border py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal/10 border border-teal/20 text-teal text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-teal" />
            {recommendations.length} supplements analyzed
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">
            Your personalized recommendations
          </h1>
          {goalLabels && (
            <p className="text-text-secondary text-sm">
              Based on your goals: <span className="text-text capitalize">{goalLabels}</span>
              {profile.dietType && (
                <> · <span className="capitalize">{profile.dietType}</span> diet</>
              )}
            </p>
          )}

          {/* Summary pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {high.length > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-priority-high/10 text-priority-high border border-priority-high/20">
                {high.length} high priority
              </span>
            )}
            {medium.length > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-priority-medium/10 text-priority-medium border border-priority-medium/20">
                {medium.length} medium priority
              </span>
            )}
            {low.length > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-priority-low/10 text-priority-low border border-priority-low/20">
                {low.length} lower priority
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Disclaimer */}
        <div className="bg-surface-alt border border-border rounded-xl px-4 py-3 mb-8 flex gap-3">
          <svg className="w-4 h-4 text-text-tertiary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-text-tertiary text-xs leading-relaxed">
            These recommendations are for informational purposes only and are not medical advice. Always consult
            a qualified healthcare provider before starting any new supplement, especially if you take medications or have health conditions.
          </p>
        </div>

        {recommendations.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-secondary text-base mb-4">
              No strong matches found for your profile.
            </p>
            <Link href="/quiz" className="text-teal hover:text-teal-light text-sm underline">
              Retake the quiz
            </Link>
          </div>
        ) : (
          <>
            <PriorityGroup priority="high" recs={high} />
            <PriorityGroup priority="medium" recs={medium} />
            <PriorityGroup priority="low" recs={low} />
          </>
        )}

        {/* Retake / disclaimer */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-text-secondary text-sm font-medium mb-1">Want to refine your results?</p>
            <p className="text-text-tertiary text-xs">
              For more precise recommendations, the iOS/Android app supports blood work and genetic data.
            </p>
          </div>
          <Link
            href="/quiz"
            className="flex-shrink-0 border border-border hover:border-teal text-text-secondary hover:text-teal text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            Retake Quiz
          </Link>
        </div>

        {/* Affiliate disclosure */}
        <p className="text-text-tertiary text-xs text-center mt-8">
          Amazon affiliate links use tag <code className="font-mono">insquire-20</code>. We earn a small
          commission on qualifying purchases at no extra cost to you.
        </p>
      </div>
    </div>
  )
}
