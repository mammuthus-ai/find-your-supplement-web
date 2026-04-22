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
          // Pick best form if available, else use the first recommendedForm string
          const pickedForm =
            supp.forms && supp.forms.length > 0
              ? [...supp.forms].sort((a, b) => a.priority - b.priority)[0]
              : null
          const formLabel = pickedForm?.name || supp.recommendedForms?.[0] || supp.name
          const amazonQuery = pickedForm?.amazonSearch
            ? decodeURIComponent(pickedForm.amazonSearch).replace(/\+/g, ' ')
            : supp.name

          return (
            <div
              key={supp.name}
              className="flex items-start gap-3 bg-surface-alt border border-border rounded-lg p-3"
            >
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
                {formLabel !== supp.name && (
                  <div className="text-text-secondary text-xs truncate mt-0.5">
                    Recommended form: {formLabel}
                  </div>
                )}
                {rec.reasons && rec.reasons.length > 0 && (
                  <div className="text-text-tertiary text-xs mt-1 truncate">
                    {rec.reasons[0].label}
                  </div>
                )}
              </div>
              <a
                href={`https://www.amazon.com/s?k=${encodeURIComponent(amazonQuery)}&tag=${AMAZON_TAG}`}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex-shrink-0 bg-teal hover:bg-teal-light text-bg text-xs font-semibold px-3 py-1.5 rounded transition-colors"
              >
                Buy
              </a>
            </div>
          )
        })}
      </div>

      <div className="px-4 pb-4">
        {showFinalCta ? (
          <div className="bg-teal/10 border border-teal/30 rounded-lg p-3 mt-2">
            <p className="text-text text-sm font-semibold mb-1">
              Want even more accurate recommendations?
            </p>
            <p className="text-text-secondary text-xs leading-relaxed">
              Blood work + genetic data unlock labs-first scoring (our strongest signal).
              Download the app to upload your lab PDFs or 23andMe/AncestryDNA exports
              — your recommendations refine automatically.
            </p>
          </div>
        ) : (
          <p className="text-text-tertiary text-xs italic">
            {disclaimer ??
              'These early picks may shift as you answer more questions — keep going for a more precise match.'}
          </p>
        )}
      </div>
    </div>
  )
}
