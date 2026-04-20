'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { buildRecommendations } from '@/engine/recommendationEngine'
import type { QuizProfile, SupplementRecommendation, Priority, EvidenceGrade, TopProduct } from '@/types'
import EmailCaptureCard from '@/components/EmailCaptureCard'
import MyStackCard from '@/components/MyStackCard'
import QuizCounter from '@/components/QuizCounter'
import TopProductsCard from '@/components/TopProductsCard'
import evidenceCacheRaw from '@/data/evidenceCache.json'

const topProductsMap = (evidenceCacheRaw as { topProducts?: Record<string, Record<string, TopProduct[]>> }).topProducts || {}
import { incrementPublicStat } from '@/lib/publicStats'
import { trackResultsView, trackSupplementExpand, trackAmazonClick } from '@/lib/analytics'

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
    A: 'Strong evidence — Meta-analyses & RCTs',
    B: 'Moderate evidence — Multiple RCTs',
    C: 'Limited evidence — Small trials',
    D: 'Weak evidence — Early/mechanistic research',
  }[g]
}

function gradeShortLabel(g: EvidenceGrade) {
  return {
    A: 'Evidence: Strong',
    B: 'Evidence: Moderate',
    C: 'Evidence: Limited',
    D: 'Evidence: Weak',
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

const FREE_LIMIT = 3 // Show top 3 fully, lock the rest

function LockedSupplementCard({ index }: { index: number }) {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden relative">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-surface-alt border border-border flex items-center justify-center text-text-tertiary text-xs font-mono">
            {index}
          </span>
          <div className="flex-1">
            <div className="h-4 w-40 bg-border/40 rounded mb-2" />
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-24 bg-border/30 rounded" />
              <div className="h-5 w-20 bg-border/30 rounded" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-surface/80">
        <div className="text-center px-6">
          <svg className="w-5 h-5 text-teal mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-text text-sm font-medium">
            Supplement #{index}
          </p>
          <p className="text-text-tertiary text-xs mt-1">
            Unlock full report with dosage, timing & evidence
          </p>
        </div>
      </div>
    </div>
  )
}

function SupplementCard({ rec }: { rec: SupplementRecommendation }) {
  const [expanded, setExpanded] = useState(false)
  const { supplement: supp, score, rank, priority, reasons, evidenceGrade, evidenceByCondition } = rec
  const primary = evidenceByCondition?.[0]
  const displayGrade = primary?.grade ?? evidenceGrade
  const displayContext = primary?.condition

  // Pick ONE specific form for this user based on their top matched condition.
  // Falls back to priority-1 form (generic best) if no condition match.
  const userTokens = new Set<string>()
  if (primary?.condition) userTokens.add(primary.condition.toLowerCase())
  for (const r of reasons) {
    const label = r.label.toLowerCase()
    // Surface symptom names from reason labels e.g. "Addresses symptom: sleep"
    const m = label.match(/symptom:\s*(\w[\w\s]*)/i)
    if (m) userTokens.add(m[1].trim())
    // Goal names
    const g = label.match(/goal:\s*(\w+)/i)
    if (g) userTokens.add(g[1].trim())
  }
  const pickedForm = (supp.forms && supp.forms.length > 0)
    ? [...supp.forms].sort((a, b) => {
        const aHit = a.bestFor.some(t => userTokens.has(t.toLowerCase())) ? 1 : 0
        const bHit = b.bestFor.some(t => userTokens.has(t.toLowerCase())) ? 1 : 0
        return bHit - aHit || a.priority - b.priority
      })[0]
    : null

  // Products scoped to the form the engine picked for this user — a glycinate-
  // recommended user sees glycinate products, not oxide. Falls back to the
  // cross-form top-3 ("_all") when the picked form has no direct-link products.
  const productsBySupp = topProductsMap[supp.name]
  const forForm = pickedForm?.name ? productsBySupp?.[pickedForm.name] : undefined
  const forAll = productsBySupp?._all
  const topProducts = (forForm && forForm.length > 0) ? forForm : forAll
  const topProductsFormLabel = (forForm && forForm.length > 0) ? pickedForm?.name : undefined

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
                <span className={`text-xs font-medium px-2 py-0.5 rounded border ${gradeStyles(displayGrade)}`}>
                  {gradeShortLabel(displayGrade)}
                  {displayContext ? ` for ${displayContext}` : ''}
                </span>
              </div>
            </div>
          </div>

          <a
            href={amazonUrl(pickedForm?.amazonSearch
              ? decodeURIComponent(pickedForm.amazonSearch).replace(/\+/g, ' ')
              : supp.name)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex-shrink-0 flex items-center gap-1.5 bg-[#FF9900] hover:bg-[#E68900] text-black text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            onClick={(e) => { e.stopPropagation(); trackAmazonClick(supp.name, rank) }}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
            </svg>
            Buy on Amazon
          </a>
        </div>

        {/* Score bar */}
        <ScoreBar score={score} />

        {/* Drug interaction warnings */}
        {rec.warnings && rec.warnings.length > 0 && (
          <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-red-600 text-xs font-semibold mb-1">Drug Interaction Warning</p>
                {rec.warnings.map((w, i) => (
                  <p key={i} className="text-red-500 text-xs leading-relaxed">{w}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Description — expanded/collapsed tied to the card's expand state */}
        <p className={`text-text-secondary text-sm leading-relaxed mt-3 ${expanded ? '' : 'line-clamp-3'}`}>
          {supp.description}
        </p>
      </div>

      {/* Why this supplement */}
      {reasons.length > 0 && (
        <div className="border-t border-border">
          <button
            onClick={() => { if (!expanded) trackSupplementExpand(supp.name, rank); setExpanded(!expanded) }}
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

              {/* Recommended forms & dosage */}
              {(supp.recommendedForms || supp.typicalDose) && (
                <div className="mt-3 pt-3 border-t border-border space-y-2">
                  {pickedForm ? (
                    <div className="bg-teal/5 border border-teal/10 rounded-lg px-3 py-2.5">
                      <p className="text-text-secondary text-xs">
                        <span className="text-teal font-semibold">Recommended form: </span>
                        {pickedForm.name}
                        {displayContext ? (
                          <span className="text-text-tertiary"> — best for {displayContext}</span>
                        ) : null}
                      </p>
                      {pickedForm.warning ? (
                        <p className="text-text-tertiary text-xs mt-1 italic">
                          ⚠ {pickedForm.warning}
                        </p>
                      ) : null}
                    </div>
                  ) : supp.recommendedForms && supp.recommendedForms.length > 0 ? (
                    <div className="bg-teal/5 border border-teal/10 rounded-lg px-3 py-2.5">
                      <p className="text-text-secondary text-xs">
                        <span className="text-teal font-semibold">Best forms: </span>
                        {supp.recommendedForms[0]}
                      </p>
                    </div>
                  ) : null}
                  {supp.typicalDose && (
                    <div className="bg-surface-alt rounded-lg px-3 py-2.5">
                      <p className="text-text-tertiary text-xs">
                        <span className="text-text-secondary font-medium">Typical dose: </span>
                        {supp.typicalDose}
                      </p>
                    </div>
                  )}
                </div>
              )}

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

              {/* Top 3 products, scoped to the form recommended for this user */}
              {topProducts && topProducts.length > 0 && (
                <TopProductsCard
                  products={topProducts}
                  supplementName={supp.name}
                  formName={topProductsFormLabel}
                />
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
        {recs.map((rec) =>
          rec.rank <= FREE_LIMIT ? (
            <SupplementCard key={rec.supplement.id} rec={rec} />
          ) : (
            <LockedSupplementCard key={rec.supplement.id} index={rec.rank} />
          )
        )}
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
      // Migration: handle old profiles with single-select exerciseType
      if (typeof p.exerciseType === 'string') {
        const ex = p.exerciseType as string
        if (ex === 'both') p.exerciseType = ['cardio', 'weight_training']
        else if (ex === 'none') p.exerciseType = []
        else p.exerciseType = [ex as 'cardio' | 'weight_training']
      }
      if (!p.medications) p.medications = []
      setProfile(p)
      const recs = buildRecommendations(p)
      setRecommendations(recs)
      incrementPublicStat('quiz_completions')
      trackResultsView(recs.length)
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

          <QuizCounter className="mt-2" />

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

            {/* Unlock CTA — shown after top 3 free results */}
            {recommendations.length > FREE_LIMIT && (
              <div className="bg-surface border border-teal/20 rounded-2xl p-6 sm:p-8 mb-10 text-center relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 bg-teal/8 blur-3xl" />
                </div>
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal/10 border border-teal/20 text-teal text-xs font-medium mb-4">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    {recommendations.length - FREE_LIMIT} more recommendations locked
                  </div>
                  <h3 className="text-text font-bold text-lg sm:text-xl mb-2">
                    Unlock your full supplement plan
                  </h3>
                  <p className="text-text-secondary text-sm mb-5 max-w-md mx-auto">
                    Get all {recommendations.length} recommendations with detailed dosage, timing guidance,
                    drug interaction alerts, and the full evidence breakdown.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href="https://apps.apple.com/app/find-your-supplement/id6761743777"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-teal hover:bg-teal-light text-bg font-semibold text-sm px-6 py-3 rounded-xl transition-colors shadow-lg shadow-teal/20"
                    >
                      Download the App
                    </a>
                    <p className="text-text-tertiary text-xs">
                      $4.99/mo — Cancel anytime
                    </p>
                  </div>
                </div>
              </div>
            )}

            <PriorityGroup priority="medium" recs={medium} />
            <PriorityGroup priority="low" recs={low} />
          </>
        )}

        {/* Email capture */}
        <div className="mb-10">
          <EmailCaptureCard
            quizGoals={profile.goals}
            dietType={profile.dietType}
          />
        </div>

        {/* Share your stack */}
        {recommendations.length > 0 && (
          <div className="mb-10">
            <MyStackCard
              recommendations={recommendations}
              goals={profile.goals}
            />
          </div>
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
