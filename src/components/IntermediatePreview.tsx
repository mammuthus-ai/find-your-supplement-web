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

/** Evidence grade → display label + Tailwind classes for the badge. */
const GRADE_LABELS: Record<string, string> = {
  A: 'Strong',
  B: 'Moderate',
  C: 'Limited',
  D: 'Weak',
}
function gradeStyles(g?: string): string {
  return {
    A: 'bg-grade-a/10 text-grade-a border-grade-a/40',
    B: 'bg-grade-b/10 text-grade-b border-grade-b/40',
    C: 'bg-grade-c/10 text-grade-c border-grade-c/40',
    D: 'bg-grade-d/10 text-grade-d border-grade-d/40',
  }[g || 'C'] || 'bg-surface-alt text-text-secondary border-border'
}

/** Extract just the form descriptor from a full form name. E.g.
 *  "Magnesium glycinate" + "Magnesium" → "glycinate"
 *  "Vitamin C ascorbic acid" + "Vitamin C" → "ascorbic acid"
 *  "Methylfolate (5-MTHF)" + "Methylfolate (5-MTHF)" → "" (form === supplement)
 *  Returns null if there's nothing meaningful to add. */
function extractFormDescriptor(formName: string | undefined, suppName: string): string | null {
  if (!formName) return null
  const f = formName.trim()
  const s = suppName.trim()
  if (f.toLowerCase() === s.toLowerCase()) return null
  // Strip the supplement-name prefix when present
  const lowerF = f.toLowerCase()
  const lowerS = s.toLowerCase()
  let descriptor = f
  if (lowerF.startsWith(lowerS + ' ')) {
    descriptor = f.slice(s.length + 1).trim()
  } else if (lowerF.startsWith(lowerS)) {
    descriptor = f.slice(s.length).trim()
  }
  // Strip leading punctuation
  descriptor = descriptor.replace(/^[\(\)\-\,\.\s]+/, '').replace(/[\(\)\s]+$/, '').trim()
  return descriptor || null
}

/** Map each user symptom/goal to the cache condition keywords that should
 *  count as "evidence for this user input". Used to pick the primary
 *  evidence entry when the cache has multiple conditions per supplement. */
const SYMPTOM_TO_CACHE: Record<string, string[]> = {
  fatigue: ['fatigue', 'energy'],
  poor_sleep: ['sleep', 'insomnia'],
  brain_fog: ['cognitive', 'cognition', 'brain'],
  joint_pain: ['joint pain', 'osteoarthritis', 'arthritis'],
  frequent_illness: ['immune', 'infection'],
  anxiety: ['anxiety', 'stress'],
  hair_loss: ['hair', 'alopecia'],
  digestive_issues: ['digestive', 'gerd', 'gastroesophageal', 'dyspepsia'],
  low_mood: ['depression', 'mood'],
  muscle_weakness: ['muscle strength', 'sarcopenia', 'muscle'],
  poor_memory: ['memory', 'cognitive'],
  dry_skin: ['skin', 'dermatitis'],
  acid_reflux: ['gerd', 'gastroesophageal', 'reflux', 'dyspepsia', 'digestive'],
  constipation: ['constipation', 'bowel', 'digestive'],
  ibs: ['irritable bowel', 'ibs', 'digestive'],
  bloating: ['bloating', 'dyspepsia', 'digestive'],
  nausea: ['nausea', 'dyspepsia', 'digestive'],
  apo_b_elevated: ['apolipoprotein', 'apob', 'heart'],
  ldl_elevated: ['ldl', 'hypercholesterolemia', 'heart'],
  hdl_low: ['hdl', 'heart'],
  triglycerides_high: ['hypertriglyceridemia', 'triglycerides', 'heart'],
}
const GOAL_TO_CACHE: Record<string, string[]> = {
  energy: ['fatigue', 'energy'],
  sleep: ['sleep', 'insomnia'],
  muscle: ['muscle strength', 'sarcopenia', 'muscle'],
  focus: ['cognitive', 'focus'],
  longevity: ['longevity', 'mortality', 'heart'],
  immunity: ['immune'],
  mood: ['depression', 'mood'],
  weight_loss: ['weight loss', 'obesity'],
}

/** Diet-boost lists hard-coded here so we can label why a supplement was
 *  included when it didn't match a user-picked symptom or goal. Mirrors
 *  DIET_BOOST in recommendationEngine.ts (post-audit version). */
const DIET_BOOST_LOOKUP: Record<string, string[]> = {
  carnivore: ['Vitamin C', 'Magnesium', 'Methylfolate (5-MTHF)', 'Probiotics', 'Calcium'],
  vegan: ['Vitamin B12', 'Omega-3 (Fish Oil / Algae)', 'Iron', 'Zinc', 'Vitamin D3', 'Calcium', 'Creatine Monohydrate'],
  vegetarian: ['Vitamin B12', 'Omega-3 (Fish Oil / Algae)', 'Iron', 'Zinc', 'Vitamin D3', 'Calcium', 'Creatine Monohydrate'],
  keto: ['Vitamin C', 'Methylfolate (5-MTHF)', 'Magnesium', 'Calcium'],
  paleo: ['Calcium'],
  pescatarian: ['Creatine Monohydrate'],
  mediterranean: [],
}

/** Return a short label explaining WHY a supplement was included when
 *  it doesn't address any user-picked symptom or goal directly. The
 *  most likely trigger is the diet boost; we check that first because
 *  it's user-visible. Returns null if we can't pinpoint a clear cause. */
function describeBoostContext(
  suppName: string,
  answers: PartialAnswers,
): string | null {
  const diet = answers.dietType
  if (diet && DIET_BOOST_LOOKUP[diet]?.includes(suppName)) {
    const dietLabels: Record<string, string> = {
      carnivore: 'carnivore diet',
      vegan: 'plant-based diet',
      vegetarian: 'plant-based diet',
      keto: 'keto diet',
      paleo: 'paleo diet',
      pescatarian: 'pescatarian diet',
      mediterranean: 'Mediterranean diet',
    }
    return `Recommended for your ${dietLabels[diet] ?? diet}`
  }
  // Lifestyle / age / sex inclusions could be added here too, but the
  // most common diet-boost case is enough for now.
  return 'Recommended for your profile'
}

/** Pick the cache entry whose condition string most plausibly answers
 *  "what is this supplement strong for, given the user's actual concerns".
 *  Prefers entries that match a user-picked symptom/goal AND that the
 *  supplement legitimately addresses. */
function pickPrimaryEvidence<T extends { condition: string }>(
  evList: readonly T[],
  symptoms: Symptom[],
  goals: Goal[],
  suppSymptoms: readonly Symptom[],
): T | undefined {
  if (evList.length === 0) return undefined
  // Build the set of cache-keyword aliases from the user's matched inputs
  // (only those the supplement actually covers in deficiencySymptoms).
  const userMatches = symptoms.filter((s) => suppSymptoms.includes(s))
  const aliases = new Set<string>()
  for (const s of userMatches) (SYMPTOM_TO_CACHE[s] ?? []).forEach((a) => aliases.add(a))
  for (const g of goals) (GOAL_TO_CACHE[g] ?? []).forEach((a) => aliases.add(a))
  if (aliases.size > 0) {
    const hit = evList.find((e) => {
      const c = e.condition.toLowerCase()
      return Array.from(aliases).some((a) => c.includes(a))
    })
    if (hit) return hit
  }
  return evList[0]
}

/** Join an array as a human-readable list: ["a"] → "a", ["a","b"] → "a and b",
 *  ["a","b","c"] → "a, b, and c". */
function joinHuman(parts: string[]): string {
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`
  return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`
}

/** Map engine-internal condition strings (PubMed-y terminology) back to the
 *  user-facing symptom or goal label the user actually picked in the quiz.
 *  E.g. internally we matched on "inflammation" but the user selected
 *  "joint pain" — show them their term, not ours.
 *
 *  Returns the original condition unchanged if no user input mapped to it. */
function humanizeCondition(
  condition: string,
  symptoms: Symptom[],
  goals: Goal[],
  /** Optional: only translate inflammation→symptom if the supplement
   *  actually addresses that symptom (i.e. it's in its deficiencySymptoms). */
  suppDeficiencySymptoms?: readonly Symptom[],
): string {
  const c = condition.toLowerCase()
  const has = (s: Symptom) => symptoms.includes(s)
  const wants = (g: Goal) => goals.includes(g)
  const supplementCovers = (s: Symptom) =>
    !suppDeficiencySymptoms || suppDeficiencySymptoms.includes(s)

  // Symptom-derived translations
  if (c === 'inflammation') {
    if (has('joint_pain') && supplementCovers('joint_pain')) return 'joint pain'
    if (has('dry_skin') && supplementCovers('dry_skin')) return 'skin health'
    return 'inflammation'
  }
  if (c === 'cognitive function' || c === 'focus') {
    if (has('brain_fog')) return 'brain fog'
    if (has('poor_memory')) return 'memory'
    if (wants('focus')) return 'focus'
    return 'cognitive performance'
  }
  if (c === 'muscle strength') {
    if (has('muscle_weakness')) return 'muscle weakness'
    if (wants('muscle')) return 'muscle support'
    return 'muscle support'
  }
  if (c === 'depression') {
    if (has('low_mood')) return 'low mood'
    return 'mood'
  }
  // 'mood' is a broad cache bucket the scraper uses for both depression and
  // anxiety evidence. Translate to the user's specific picked symptom when
  // the supplement legitimately covers it.
  if (c === 'mood') {
    if (has('anxiety') && supplementCovers('anxiety')) return 'anxiety'
    if (has('low_mood') && supplementCovers('low_mood')) return 'low mood'
    return 'mood'
  }
  if (c === 'fatigue') {
    return wants('energy') ? 'energy' : 'fatigue'
  }
  if (c === 'immune function') return 'immunity'
  if (c === 'heart health') return 'cardiovascular health'
  if (c === 'gerd' || c === 'gastroesophageal reflux') return 'acid reflux'
  if (c === 'apolipoprotein b' || c === 'apob') return 'ApoB cholesterol'
  if (c === 'ldl cholesterol' || c === 'hypercholesterolemia') return 'LDL cholesterol'
  if (c === 'hdl cholesterol') return 'HDL cholesterol'
  if (c === 'hypertriglyceridemia') return 'triglycerides'
  if (c === 'irritable bowel syndrome') return 'IBS'
  if (c === 'dyspepsia') {
    if (has('bloating')) return 'bloating'
    if (has('nausea')) return 'nausea'
    return 'dyspepsia'
  }

  // Default: return as-is (already user-friendly: 'joint pain', 'sleep', etc.)
  return condition
}

/** One-line summary of what the research looks like for this supplement's
 *  primary matched condition. Uses plain language ("research reviews",
 *  "clinical trials") instead of "meta-analyses" / "RCTs" since most users
 *  won't know those terms. Example: "Backed by 453 research reviews and
 *  495 clinical trials for acid reflux". */
function buildEvidenceSummary(e: {
  condition: string
  rctCount: number
  metaAnalysisCount: number
  pubmedCount: number
}, displayCondition: string): string {
  const parts: string[] = []
  if (e.metaAnalysisCount > 0) {
    parts.push(
      `${e.metaAnalysisCount} research review${e.metaAnalysisCount === 1 ? '' : 's'}`
    )
  }
  if (e.rctCount > 0) {
    parts.push(
      `${e.rctCount} clinical trial${e.rctCount === 1 ? '' : 's'}`
    )
  }
  if (parts.length === 0 && e.pubmedCount > 0) {
    parts.push(
      `${e.pubmedCount} published stud${e.pubmedCount === 1 ? 'y' : 'ies'}`
    )
  }
  if (parts.length === 0) return ''
  const joined = parts.length === 2 ? `${parts[0]} and ${parts[1]}` : parts.join(' and ')
  return `Backed by ${joined} for ${displayCondition}`
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
  /** Previous-step full ranking (supplement.name → rank). Lets us show
   *  per-card delta badges like "↑5", "NEW", or "↓3" so users see their
   *  answers actually changing the order. */
  previousRanking?: Record<string, number>
  stepLabel: string
  disclaimer?: string
  /** Set true on the last preview to swap disclaimer into the download-app CTA */
  showFinalCta?: boolean
}

/** Compute a delta badge for a supplement. Returns null if this is the
 *  first preview (no prior data) or if the supplement's position is
 *  unchanged and there was no notable history. */
function rankDelta(
  name: string,
  newRank: number,
  previousRanking: Record<string, number>,
): { label: string; kind: 'new' | 'up' | 'down' | 'same' } | null {
  if (Object.keys(previousRanking).length === 0) return null
  const prev = previousRanking[name]
  if (prev === undefined) return { label: 'NEW', kind: 'new' }
  const delta = prev - newRank
  if (delta > 0) return { label: `↑${delta}`, kind: 'up' }
  if (delta < 0) return { label: `↓${-delta}`, kind: 'down' }
  return { label: '=', kind: 'same' }
}

function deltaStyles(kind: 'new' | 'up' | 'down' | 'same'): string {
  return {
    new:  'bg-teal/20 text-teal',
    up:   'bg-grade-a/20 text-grade-a',
    down: 'bg-surface-alt text-text-tertiary',
    same: 'bg-surface-alt text-text-tertiary',
  }[kind]
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
  previousRanking = {},
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
          const delta = rankDelta(supp.name, rec.rank, previousRanking)
          const pickedForm =
            supp.forms && supp.forms.length > 0
              ? [...supp.forms].sort((a, b) => a.priority - b.priority)[0]
              : null

          // Look up the specific #1 product for this supplement+form pairing.
          const bestProduct = pickBestProduct(supp.name, pickedForm?.name)
          const reason = bestProduct ? whyThisProduct(bestProduct) : null

          // Primary evidence: pick the cached condition that lines up with
          // a symptom/goal the user actually picked. Falls back to the first
          // cache entry if no clean mapping exists.
          const userSyms = (answers.symptoms ?? []) as Symptom[]
          const userGoals = (answers.goals ?? []) as Goal[]
          const suppSymptoms = (supp.deficiencySymptoms ?? []) as readonly Symptom[]
          const suppGoals = (supp.goalsSupported ?? []) as readonly Goal[]

          // Direct relevance: does this supplement address something the
          // user explicitly picked? If not, it's here only because of a
          // diet/lifestyle/age/sex boost — and we should label it that
          // way rather than implying it treats one of their symptoms.
          const symptomMatch = userSyms.some((s) => suppSymptoms.includes(s))
          const goalMatch = userGoals.some((g) => suppGoals.includes(g))
          const userRelevantSupp = symptomMatch || goalMatch

          const evList = rec.evidenceByCondition ?? []
          const primaryEvidence = userRelevantSupp
            ? pickPrimaryEvidence(evList, userSyms, userGoals, suppSymptoms)
            : undefined  // diet-only inclusion — don't pull a misleading condition
          const evidenceGrade = primaryEvidence?.grade ?? rec.evidenceGrade
          const displayCondition = primaryEvidence
            ? humanizeCondition(primaryEvidence.condition, userSyms, userGoals, suppSymptoms)
            : ''
          const evidenceSummary = primaryEvidence
            ? buildEvidenceSummary(primaryEvidence, displayCondition)
            : null

          // For diet/lifestyle-only inclusions, surface a different
          // explanation: which input triggered the boost.
          const boostContext = userRelevantSupp
            ? null
            : describeBoostContext(supp.name, answers)

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
              {/* Header row: number, supplement name + form, evidence badge */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-teal/20 border border-teal flex items-center justify-center text-teal text-xs font-bold">
                  {rec.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-text font-semibold text-sm">
                      {supp.name}
                      {(() => {
                        const formDesc = extractFormDescriptor(
                          bestProduct?.formName ?? pickedForm?.name,
                          supp.name,
                        )
                        return formDesc ? (
                          <span className="text-text-secondary font-medium"> ({formDesc})</span>
                        ) : null
                      })()}
                    </span>
                    {/* Evidence badge: context-aware. For supplements
                        included only via diet/lifestyle/age/sex boost,
                        show the trigger instead of a misleading
                        condition match. */}
                    {boostContext ? (
                      <span className="text-xs font-semibold rounded border px-1.5 py-0.5 bg-teal/10 text-teal border-teal/30">
                        {boostContext}
                      </span>
                    ) : (
                      <span
                        className={`text-xs font-semibold rounded border px-1.5 py-0.5 ${gradeStyles(evidenceGrade)}`}
                      >
                        Evidence: {GRADE_LABELS[evidenceGrade] ?? evidenceGrade}
                        {displayCondition ? ` for ${displayCondition}` : ''}
                      </span>
                    )}
                    {delta && delta.kind !== 'same' ? (
                      <span className={`text-xs font-semibold rounded px-1.5 py-0.5 ${deltaStyles(delta.kind)}`}>
                        {delta.label}
                      </span>
                    ) : null}
                  </div>
                  {/* Study summary — only shown when we have user-relevant
                      evidence. Diet-only inclusions don't get a misleading
                      study count attributed to a condition the user didn't pick. */}
                  {evidenceSummary ? (
                    <div className="text-text-tertiary text-xs mt-1">
                      📚 {evidenceSummary}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Recommended product row — labeled, sitting next to the Buy button */}
              {(bestProduct || pickedForm?.name) && (
                <div className="mt-3 pt-3 border-t border-border flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-text-secondary text-[10px] font-semibold uppercase tracking-wide">
                      Recommended product
                    </div>
                    {bestProduct ? (
                      <div className="text-text text-xs mt-0.5">
                        <span className="font-semibold">{bestProduct.brand}</span>
                        <span className="text-text-secondary"> · {bestProduct.productName}</span>
                      </div>
                    ) : pickedForm?.name ? (
                      <div className="text-text text-xs mt-0.5 truncate">
                        Form: {pickedForm.name}
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
              )}

              {/* Why-this-product only — "why this supplement" was duplicative
                  of the evidence badge + studies count above. */}
              {reason && (
                <div className="mt-2 pt-2 border-t border-border">
                  <div className="flex items-start gap-2">
                    <span className="text-teal text-xs flex-shrink-0 mt-0.5" aria-hidden>✓</span>
                    <span className="text-text-tertiary text-xs leading-snug">
                      <span className="font-semibold text-text-secondary">Why this product: </span>
                      {reason}
                    </span>
                  </div>
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
          </div>
        )}
      </div>
    </div>
  )
}
