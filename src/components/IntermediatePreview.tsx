'use client'

/**
 * IntermediatePreview — surfaces top 3 supplement recommendations between
 * quiz steps so users see value incrementally as they answer more questions.
 *
 * Accepts the user's accumulated-so-far quiz state, builds recommendations
 * with whatever data is present (the engine already handles partial
 * profiles + renormalizes available dimensions), and shows:
 *   - Top 3 supplements with their recommended form + Amazon link
 *   - Diff indicators vs. the previous preview (added / moved up)
 *   - "These may be inaccurate — keep going for better results" disclaimer
 */

import { useMemo } from 'react'
import type {
  QuizProfile,
  SupplementRecommendation,
  TopProduct,
  Sex,
  Goal,
  DietType,
  SunExposure,
  ExerciseType,
  AlcoholConsumption,
  CaffeineIntake,
  StressLevel,
  Symptom,
} from '@/types'
import { buildRecommendations } from '@/engine/recommendationEngine'
import evidenceCacheRaw from '@/data/evidenceCache.json'

const topProductsMap =
  (evidenceCacheRaw as { topProducts?: Record<string, Record<string, TopProduct[]>> }).topProducts || {}

/** Pick the single best product for a given supplement + form. Returns the
 *  per-form #1 if available, otherwise the cross-form fallback #1. */
function pickBestProduct(supplementName: string, formName?: string): TopProduct | null {
  const byForm = topProductsMap[supplementName]
  if (!byForm) return null
  const forForm = formName ? byForm[formName] : undefined
  const list = (forForm && forForm.length > 0) ? forForm : byForm['_all']
  return list && list[0] ? list[0] : null
}

/** Short human-readable reason the scored #1 product was picked. Pulls from
 *  whatever objective signals we have — certifications (most trust-worthy
 *  differentiator), then dose match, then form match, then "top score". */
function whyThisProduct(product: TopProduct): string {
  const certs = product.certifications || []
  if (certs.length > 0) {
    const best = certs.find((c) => ['USP', 'NSF', 'Informed-Sport', 'ConsumerLab-Pass'].includes(c))
    if (best) return `Top pick — ${best}-verified by an independent lab`
    return `Top pick — ${certs[0]}-certified`
  }
  if (product.totalScore >= 85) return 'Top pick — highest match on clinical dose, form, and manufacturing'
  if (product.totalScore >= 70) return 'Top pick — strong match on form and dosing'
  return 'Top pick by our quality score'
}

interface PartialAnswers {
  age?: number
  sex?: Sex | null
  goals?: Goal[]
  dietType?: DietType | null
  sunExposure?: SunExposure | null
  exerciseType?: ExerciseType[]
  alcoholConsumption?: AlcoholConsumption | null
  caffeineIntake?: CaffeineIntake | null
  stressLevel?: StressLevel | null
  symptoms?: Symptom[]
  medications?: string[]
}

interface Props {
  answers: PartialAnswers
  previousTopSupplements?: string[]
  stepLabel: string
  disclaimer?: string
  /** Set true on the last preview to swap disclaimer into the download-app CTA */
  showFinalCta?: boolean
}

const AMAZON_TAG = 'insquire-20'

function buildPartialProfile(a: PartialAnswers): QuizProfile {
  return {
    age: a.age,
    sex: a.sex ?? undefined,
    goals: a.goals ?? [],
    dietType: (a.dietType ?? 'omnivore') as DietType,
    sunExposure: (a.sunExposure ?? 'some') as SunExposure,
    exerciseType: a.exerciseType ?? [],
    alcoholConsumption: (a.alcoholConsumption ?? 'none') as AlcoholConsumption,
    caffeineIntake: (a.caffeineIntake ?? 'none') as CaffeineIntake,
    stressLevel: (a.stressLevel ?? 'moderate') as StressLevel,
    symptoms: a.symptoms ?? [],
    medications: a.medications ?? [],
  }
}

function amazonSearchUrl(brand: string, product: string): string {
  return `https://www.amazon.com/s?k=${encodeURIComponent(brand + ' ' + product)}&tag=${AMAZON_TAG}`
}

export default function IntermediatePreview({
  answers,
  previousTopSupplements = [],
  stepLabel,
  disclaimer,
  showFinalCta = false,
}: Props) {
  const top3 = useMemo<SupplementRecommendation[]>(() => {
    try {
      const profile = buildPartialProfile(answers)
      const recs = buildRecommendations(profile)
      return recs.slice(0, 3)
    } catch {
      return []
    }
  }, [answers])

  if (top3.length === 0) return null

  const prevSet = new Set(previousTopSupplements)

  return (
    <div className="mt-6 bg-surface border border-teal/40 rounded-xl overflow-hidden">
      <div className="bg-teal/5 border-b border-teal/30 px-4 py-3">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-text font-semibold text-sm">
            Based on your {stepLabel}
          </h3>
          <span className="text-text-tertiary text-xs">Top 3 picks · updated</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {top3.map((rec) => {
          const supp = rec.supplement
          const isNew = !prevSet.has(supp.name) && previousTopSupplements.length > 0
          const pickedForm =
            supp.forms && supp.forms.length > 0
              ? [...supp.forms].sort((a, b) => a.priority - b.priority)[0]
              : null

          // Look up the specific #1 product for this supplement+form pairing.
          const bestProduct = pickBestProduct(supp.name, pickedForm?.name)
          const reason = bestProduct ? whyThisProduct(bestProduct) : null

          // Buy URL: specific brand + product name (search still — ASINs unverified
          // until PA-API; brand-anchored search is more accurate than generic).
          const buyQuery = bestProduct
            ? `${bestProduct.brand} ${bestProduct.productName}`
            : (pickedForm?.amazonSearch
                ? decodeURIComponent(pickedForm.amazonSearch).replace(/\+/g, ' ')
                : supp.name)
          const buyUrl = `https://www.amazon.com/s?k=${encodeURIComponent(buyQuery)}&tag=${AMAZON_TAG}`

          return (
            <div
              key={supp.name}
              className="bg-surface-alt border border-border rounded-lg p-3"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-teal/20 border border-teal flex items-center justify-center text-teal text-xs font-bold">
                  {rec.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-text font-semibold text-sm truncate">
                      {supp.name}
                    </span>
                    {isNew ? (
                      <span className="text-xs bg-teal/20 text-teal font-semibold rounded px-1.5 py-0.5">
                        NEW
                      </span>
                    ) : null}
                  </div>
                  {bestProduct ? (
                    <div className="text-text-secondary text-xs mt-0.5">
                      <span className="font-semibold">{bestProduct.brand}</span>
                      <span> · {bestProduct.productName}</span>
                    </div>
                  ) : pickedForm?.name ? (
                    <div className="text-text-secondary text-xs truncate mt-0.5">
                      Recommended form: {pickedForm.name}
                    </div>
                  ) : null}
                </div>
                <a
                  href={buyUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex-shrink-0 bg-teal hover:bg-teal-light text-bg text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                >
                  Buy
                </a>
              </div>

              {/* Why this specific product */}
              {reason && (
                <div className="mt-2 pt-2 border-t border-border flex items-start gap-2">
                  <span className="text-teal text-xs flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-text-tertiary text-xs leading-snug">{reason}</span>
                </div>
              )}
              {!reason && rec.reasons && rec.reasons.length > 0 && (
                <div className="mt-2 pt-2 border-t border-border">
                  <span className="text-text-tertiary text-xs">
                    Why: {rec.reasons[0].label}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="px-4 pb-4">
        {showFinalCta ? (
          <div className="bg-teal/10 border border-teal/40 rounded-lg p-4 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📱</span>
              <p className="text-text text-sm font-bold">
                Unlock labs-grade precision in the app
              </p>
            </div>
            <p className="text-text-secondary text-xs leading-relaxed">
              Blood work + genetic data are our strongest signals. Download the app to
              upload your lab PDFs or 23andMe / AncestryDNA exports — recommendations
              refine automatically.
            </p>
          </div>
        ) : (
          <div className="bg-teal/10 border border-teal/40 rounded-lg px-4 py-3 flex items-center gap-3">
            <span className="text-2xl flex-shrink-0">⚡</span>
            <div className="flex-1 min-w-0">
              <p className="text-text text-sm font-bold leading-tight">
                Your picks get sharper with every answer
              </p>
              <p className="text-text-secondary text-xs mt-0.5">
                {disclaimer ?? 'Keep going — the next step usually reshuffles the top 3.'}
              </p>
            </div>
            <span className="text-teal text-xl flex-shrink-0">→</span>
          </div>
        )}
      </div>
    </div>
  )
}
