/**
 * Web Recommendation Engine
 *
 * Adapted from the mobile app engine (v4) for the web quiz.
 * Web version uses: Goals, Diet, Lifestyle, Symptoms, Age/Sex
 * (Blood work and genetics are app-only features)
 *
 * Dimension weights calibrated from PubMed literature:
 *   Diet:      20  (vegan diets: 93–95% B12 deficiency prevalence)
 *   Lifestyle: 15  (PubMed-backed: sun exposure, exercise, alcohol, caffeine, stress)
 *   Symptoms:  10  (sensitivity <80%, high overlap between conditions)
 *   Age/Sex:    8  (CoQ10 declines after 40, iron needs differ by sex, etc.)
 *   Goals:      5  (user preference, not clinical signal)
 */

import { supplements } from '@/data/supplements'
import {
  QuizProfile,
  WebSupplement,
  SupplementRecommendation,
  RecommendationReason,
  DietType,
  EvidenceGrade,
  Priority,
} from '@/types'
import {
  evidenceStrengthScore,
  clinicalTrialScore,
  safetyScore,
  availabilityScore,
  computeEvidenceGrade,
  computeEvidenceByCondition,
  hasEvidenceCache,
} from './evidenceScorer'

const WEIGHTS = {
  diet: 20,
  lifestyle: 15,
  symptoms: 10,
  ageSex: 8,
  goals: 5,
} as const

const CORROBORATION_BONUS_RATE = 0.12
const CORROBORATION_MIN_DIMENSIONS = 2

// ─── Diet boost/suppress maps (PubMed-derived) ────────────────────────────────

// All entries audited 2026-04-28 — see docs/boost-map-evidence-audit.md
// for citation per entry. Removed: paleo→B12/D3 (paleo includes meat,
// no specific D link), pescatarian→B12/Iron/Zn (fish/eggs/dairy adequate
// for these), mediterranean→B12/D3 (Mediterranean is nutrient-replete),
// keto→Probiotics (only weak inferential evidence).
const DIET_BOOST: Record<string, string[]> = {
  carnivore: ['Vitamin C', 'Magnesium', 'Methylfolate (5-MTHF)', 'Probiotics', 'Calcium'],
  vegan: ['Vitamin B12', 'Omega-3 (Fish Oil / Algae)', 'Iron', 'Zinc', 'Vitamin D3', 'Calcium', 'Creatine Monohydrate'],
  vegetarian: ['Vitamin B12', 'Omega-3 (Fish Oil / Algae)', 'Iron', 'Zinc', 'Vitamin D3', 'Calcium', 'Creatine Monohydrate'],
  keto: ['Vitamin C', 'Methylfolate (5-MTHF)', 'Magnesium', 'Calcium'],
  paleo: ['Calcium'],
  pescatarian: ['Creatine Monohydrate'],
  mediterranean: [],
}

const DIET_SUPPRESS: Record<string, string[]> = {
  carnivore: ['Vitamin B12', 'Iron', 'Zinc', 'Creatine Monohydrate'],
  vegan: ['Vitamin C'],
  vegetarian: ['Vitamin C'],
  keto: ['Vitamin B12', 'Iron'],
  paleo: ['Vitamin C', 'Iron', 'Zinc', 'Magnesium'],
  pescatarian: ['Omega-3 (Fish Oil / Algae)'],
  mediterranean: ['Vitamin C', 'Magnesium'],
}

const HIGH_RISK_DIETS: DietType[] = ['vegan', 'vegetarian', 'carnivore']
const MODERATE_RISK_DIETS: DietType[] = ['keto', 'paleo', 'pescatarian']

// ─── Lifestyle boost maps ─────────────────────────────────────────────────────

type Magnitude = 'high' | 'medium' | 'low'

// Magnitudes audited 2026-04-28 — see docs/boost-map-evidence-audit.md.
// Downgraded: sun→Mg (high→low, mechanistic only), ex_wt→Mg (high→medium,
// sweat-loss is real but not high-magnitude), ex_wt→Zn (medium→low,
// observational only), ex_cardio→D3 (medium→low, indirect via reduced sun),
// ex_cardio→Mg (high→medium), ex_both→Mg (high→medium),
// stress→B12 (medium→low, weak evidence), stress→Zn (medium→low, acute-only).
const LIFESTYLE_BOOST: Record<string, { supplement: string; magnitude: Magnitude }[]> = {
  sun_very_little: [
    { supplement: 'Vitamin D3', magnitude: 'high' },
    { supplement: 'Magnesium', magnitude: 'low' },
  ],
  exercise_weight_training: [
    { supplement: 'Creatine Monohydrate', magnitude: 'high' },
    { supplement: 'Collagen Peptides', magnitude: 'medium' },
    { supplement: 'Magnesium', magnitude: 'medium' },
    { supplement: 'Zinc', magnitude: 'low' },
  ],
  exercise_cardio: [
    { supplement: 'Iron', magnitude: 'high' },
    { supplement: 'Vitamin D3', magnitude: 'low' },
    { supplement: 'Omega-3 (Fish Oil / Algae)', magnitude: 'medium' },
    { supplement: 'Magnesium', magnitude: 'medium' },
  ],
  exercise_both: [
    { supplement: 'Creatine Monohydrate', magnitude: 'high' },
    { supplement: 'Iron', magnitude: 'high' },
    { supplement: 'Magnesium', magnitude: 'medium' },
    { supplement: 'Zinc', magnitude: 'low' },
    { supplement: 'Vitamin D3', magnitude: 'low' },
    { supplement: 'Omega-3 (Fish Oil / Algae)', magnitude: 'medium' },
    { supplement: 'Collagen Peptides', magnitude: 'medium' },
  ],
  alcohol_moderate: [
    { supplement: 'Methylfolate (5-MTHF)', magnitude: 'high' },
    { supplement: 'Vitamin B12', magnitude: 'high' },
    { supplement: 'Magnesium', magnitude: 'high' },
    { supplement: 'Zinc', magnitude: 'medium' },
    { supplement: 'Vitamin D3', magnitude: 'medium' },
    { supplement: 'NAC (N-Acetyl Cysteine)', magnitude: 'high' },
  ],
  alcohol_heavy: [
    { supplement: 'Methylfolate (5-MTHF)', magnitude: 'high' },
    { supplement: 'Vitamin B12', magnitude: 'high' },
    { supplement: 'Magnesium', magnitude: 'high' },
    { supplement: 'Zinc', magnitude: 'medium' },
    { supplement: 'Vitamin D3', magnitude: 'medium' },
    { supplement: 'NAC (N-Acetyl Cysteine)', magnitude: 'high' },
  ],
  caffeine_moderate: [
    { supplement: 'Magnesium', magnitude: 'medium' },
    { supplement: 'Iron', magnitude: 'low' },
  ],
  caffeine_heavy: [
    { supplement: 'Magnesium', magnitude: 'medium' },
    { supplement: 'Iron', magnitude: 'low' },
  ],
  stress_high: [
    { supplement: 'Ashwagandha (KSM-66)', magnitude: 'high' },
    { supplement: 'Magnesium', magnitude: 'high' },
    { supplement: 'Vitamin B12', magnitude: 'low' },
    { supplement: 'Vitamin C', magnitude: 'medium' },
    { supplement: 'Zinc', magnitude: 'low' },
    { supplement: 'Probiotics', magnitude: 'medium' },
  ],
  stress_very_high: [
    { supplement: 'Ashwagandha (KSM-66)', magnitude: 'high' },
    { supplement: 'Magnesium', magnitude: 'high' },
    { supplement: 'Vitamin B12', magnitude: 'low' },
    { supplement: 'Vitamin C', magnitude: 'medium' },
    { supplement: 'Zinc', magnitude: 'low' },
    { supplement: 'Probiotics', magnitude: 'medium' },
  ],
}

const MAGNITUDE_SCORE: Record<Magnitude, number> = {
  high: 3,
  medium: 2,
  low: 1,
}

// ─── Age/Sex boost maps (PubMed-derived) ─────────────────────────────────────

const AGE_BOOSTS: { minAge: number; supplement: string; magnitude: Magnitude; reason: string }[] = [
  { minAge: 40, supplement: 'CoQ10 (Ubiquinol)', magnitude: 'high', reason: 'CoQ10 synthesis declines significantly after 40' },
  { minAge: 40, supplement: 'Collagen Peptides', magnitude: 'medium', reason: 'Collagen production declines with age' },
  { minAge: 40, supplement: 'Melatonin', magnitude: 'medium', reason: 'Melatonin production drops after 40' },
  { minAge: 50, supplement: 'Calcium', magnitude: 'medium', reason: 'Calcium needs increase after 50; absorption declines with age' },
  { minAge: 50, supplement: 'Vitamin D3', magnitude: 'medium', reason: 'Vitamin D synthesis decreases with age' },
  { minAge: 50, supplement: 'Magnesium', magnitude: 'medium', reason: 'Magnesium absorption decreases with age and dietary intake tends to drop' },
  { minAge: 60, supplement: 'Creatine Monohydrate', magnitude: 'medium', reason: 'Combats age-related sarcopenia' },
  { minAge: 60, supplement: 'Vitamin B12', magnitude: 'medium', reason: 'B12 absorption decreases with age' },
]

const SEX_BOOSTS: { sex: string; supplement: string; magnitude: Magnitude; maxAge?: number; reason: string }[] = [
  { sex: 'female', supplement: 'Iron', magnitude: 'high', maxAge: 50, reason: 'Women of reproductive age need more iron due to menstruation' },
  { sex: 'female', supplement: 'Methylfolate (5-MTHF)', magnitude: 'high', maxAge: 45, reason: 'Folate is critical for women of childbearing age' },
  { sex: 'female', supplement: 'Calcium', magnitude: 'medium', reason: 'Women need more calcium, especially post-menopause when bone density drops rapidly' },
  { sex: 'female', supplement: 'Vitamin D3', magnitude: 'medium', reason: 'Women are at higher risk for vitamin D deficiency' },
  { sex: 'female', supplement: 'Magnesium', magnitude: 'medium', reason: 'Women are more likely to be magnesium deficient, especially post-menopause' },
]

// ─── Boost eligibility ───────────────────────────────────────────────────────

/** Return the set of supplement names that any of the user's diet,
 *  lifestyle, age, or sex inputs would boost. Used by the relevance
 *  filter so users with high-stress + low-sun (etc.) get the relevant
 *  supplements surfaced even when symptom matches are sparse. */
function computeBoostEligibleSupplements(profile: QuizProfile): Set<string> {
  const eligible = new Set<string>()

  // Diet
  for (const name of DIET_BOOST[profile.dietType] ?? []) eligible.add(name)

  // Lifestyle keys
  const lifestyleKeys: string[] = []
  if (profile.sunExposure === 'very_little') lifestyleKeys.push('sun_very_little')
  const exercises = profile.exerciseType ?? []
  if (exercises.includes('weight_training')) lifestyleKeys.push('exercise_weight_training')
  if (exercises.includes('cardio')) lifestyleKeys.push('exercise_cardio')
  if (exercises.includes('weight_training') && exercises.includes('cardio')) lifestyleKeys.push('exercise_both')
  if (profile.alcoholConsumption === 'moderate') lifestyleKeys.push('alcohol_moderate')
  else if (profile.alcoholConsumption === 'heavy') lifestyleKeys.push('alcohol_heavy')
  if (profile.caffeineIntake === 'moderate') lifestyleKeys.push('caffeine_moderate')
  else if (profile.caffeineIntake === 'heavy') lifestyleKeys.push('caffeine_heavy')
  if (profile.stressLevel === 'high') lifestyleKeys.push('stress_high')
  else if (profile.stressLevel === 'very_high') lifestyleKeys.push('stress_very_high')
  for (const key of lifestyleKeys) {
    for (const b of LIFESTYLE_BOOST[key] ?? []) eligible.add(b.supplement)
  }

  // Age
  if (profile.age && profile.age > 0) {
    for (const b of AGE_BOOSTS) {
      if (profile.age >= b.minAge) eligible.add(b.supplement)
    }
  }

  // Sex
  if (profile.sex) {
    for (const b of SEX_BOOSTS) {
      if (b.sex !== profile.sex) continue
      if (b.maxAge && profile.age && profile.age > b.maxAge) continue
      eligible.add(b.supplement)
    }
  }

  return eligible
}

// ─── Scoring functions ────────────────────────────────────────────────────────

function goalsScore(
  supp: WebSupplement,
  profile: QuizProfile,
): { pts: number; reasons: RecommendationReason[] } {
  const reasons: RecommendationReason[] = []
  let pts = 0
  for (const goal of profile.goals) {
    if (supp.goalsSupported.includes(goal)) {
      pts += 5
      reasons.push({
        type: 'goal',
        label: `Supports your goal: ${goal.replace(/_/g, ' ')}`,
        detail: `${supp.name} has clinical evidence for supporting ${goal.replace(/_/g, ' ')}.`,
      })
    }
  }
  return { pts: Math.min(pts, WEIGHTS.goals), reasons }
}

function symptomsScore(
  supp: WebSupplement,
  profile: QuizProfile,
): { pts: number; reasons: RecommendationReason[] } {
  const reasons: RecommendationReason[] = []
  let pts = 0
  for (const sym of profile.symptoms) {
    if (supp.deficiencySymptoms.includes(sym)) {
      pts += 5
      reasons.push({
        type: 'symptom',
        label: `Addresses symptom: ${sym.replace(/_/g, ' ')}`,
        detail: `${sym.replace(/_/g, ' ')} can be a sign that ${supp.name} may help.`,
      })
    }
  }
  return { pts: Math.min(pts, WEIGHTS.symptoms), reasons }
}

function dietScore(
  supp: WebSupplement,
  profile: QuizProfile,
): { pts: number; reasons: RecommendationReason[] } {
  const reasons: RecommendationReason[] = []
  let pts = 0

  const boostList = DIET_BOOST[profile.dietType] ?? []
  const suppressList = DIET_SUPPRESS[profile.dietType] ?? []

  if (boostList.includes(supp.name)) {
    pts = HIGH_RISK_DIETS.includes(profile.dietType)
      ? 25
      : MODERATE_RISK_DIETS.includes(profile.dietType)
        ? 20
        : 10
    reasons.push({
      type: 'diet',
      label: `${profile.dietType} diet deficiency risk`,
      detail: `${supp.name} is commonly deficient in ${profile.dietType} diets (PubMed evidence).`,
    })
  } else if (suppressList.includes(supp.name)) {
    pts = -10
    reasons.push({
      type: 'diet',
      label: `Adequate from ${profile.dietType} diet`,
      detail: `${supp.name} is already abundant in a ${profile.dietType} diet — supplementation unlikely needed.`,
    })
  }

  return { pts: Math.min(pts, WEIGHTS.diet), reasons }
}

function lifestyleScore(
  supp: WebSupplement,
  profile: QuizProfile,
): { pts: number; reasons: RecommendationReason[] } {
  const reasons: RecommendationReason[] = []
  let pts = 0

  const activeKeys: string[] = []

  if (profile.sunExposure === 'very_little') activeKeys.push('sun_very_little')

  const exercises = profile.exerciseType ?? []
  if (exercises.includes('weight_training')) activeKeys.push('exercise_weight_training')
  if (exercises.includes('cardio')) activeKeys.push('exercise_cardio')
  if (exercises.includes('weight_training') && exercises.includes('cardio')) activeKeys.push('exercise_both')

  if (profile.alcoholConsumption === 'moderate') activeKeys.push('alcohol_moderate')
  else if (profile.alcoholConsumption === 'heavy') activeKeys.push('alcohol_heavy')

  if (profile.caffeineIntake === 'moderate') activeKeys.push('caffeine_moderate')
  else if (profile.caffeineIntake === 'heavy') activeKeys.push('caffeine_heavy')

  if (profile.stressLevel === 'high') activeKeys.push('stress_high')
  else if (profile.stressLevel === 'very_high') activeKeys.push('stress_very_high')

  const labelParts: string[] = []

  for (const key of activeKeys) {
    const boosts = LIFESTYLE_BOOST[key] ?? []
    for (const boost of boosts) {
      if (boost.supplement === supp.name) {
        pts += MAGNITUDE_SCORE[boost.magnitude]
        const readableKey = key
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase())
        if (!labelParts.includes(readableKey)) labelParts.push(readableKey)
      }
    }
  }

  if (pts > 0 && labelParts.length > 0) {
    reasons.push({
      type: 'lifestyle',
      label: `Lifestyle factor: ${labelParts.join(', ')}`,
      detail: `${supp.name} is supported by your lifestyle profile (PubMed evidence).`,
    })
  }

  return { pts: Math.min(pts, WEIGHTS.lifestyle), reasons }
}

function ageSexScore(
  supp: WebSupplement,
  profile: QuizProfile,
): { pts: number; reasons: RecommendationReason[] } {
  const reasons: RecommendationReason[] = []
  let pts = 0

  const age = profile.age
  const sex = profile.sex

  if (age && age > 0) {
    for (const boost of AGE_BOOSTS) {
      if (age >= boost.minAge && boost.supplement === supp.name) {
        pts += MAGNITUDE_SCORE[boost.magnitude]
        reasons.push({
          type: 'lifestyle',
          label: `Age-related need`,
          detail: boost.reason,
        })
      }
    }
  }

  if (sex) {
    for (const boost of SEX_BOOSTS) {
      if (boost.sex === sex && boost.supplement === supp.name) {
        if (boost.maxAge && age && age > boost.maxAge) continue
        pts += MAGNITUDE_SCORE[boost.magnitude]
        reasons.push({
          type: 'lifestyle',
          label: `Recommended for your profile`,
          detail: boost.reason,
        })
      }
    }
  }

  return { pts: Math.min(pts, WEIGHTS.ageSex), reasons }
}

function checkWarnings(supp: WebSupplement, profile: QuizProfile): string[] {
  const warnings: string[] = []
  const meds = profile.medications ?? []
  if (meds.length === 0) return warnings

  for (const med of meds) {
    for (const interaction of supp.drugInteractions) {
      if (interaction.drug.toLowerCase().includes(med.toLowerCase())) {
        warnings.push(
          `${interaction.severity.toUpperCase()} interaction with ${med}: ${interaction.description}`
        )
      }
    }
  }
  return warnings
}

function corroborationBonus(dietPts: number, lifestylePts: number, symptomPts: number, goalPts: number): number {
  const activeDims = [dietPts, lifestylePts, symptomPts, goalPts].filter((p) => p > 0).length
  if (activeDims < CORROBORATION_MIN_DIMENSIONS) return 0
  return (activeDims - CORROBORATION_MIN_DIMENSIONS + 1) * CORROBORATION_BONUS_RATE
}

// Rank-aware priority assignment. Top supplements for THIS user are always
// "high" (with a score floor to avoid noise), regardless of absolute score.
// The engine already renormalizes to the dimensions present for each user;
// this keeps the priority label meaningful for users without labs/genetics.
const PRIORITY_HIGH_MIN_SCORE = 25
const PRIORITY_MEDIUM_MIN_SCORE = 10

function assignRankedPriorities(results: SupplementRecommendation[]): void {
  if (results.length === 0) return
  const n = results.length
  const highCutoff = Math.max(3, Math.min(6, Math.ceil(n * 0.15)))
  const medCutoff = highCutoff + Math.max(3, Math.ceil(n * 0.30))
  for (let i = 0; i < results.length; i++) {
    const r = results[i]
    const rank = i + 1
    if (rank <= highCutoff && r.score >= PRIORITY_HIGH_MIN_SCORE) {
      r.priority = 'high'
    } else if (rank <= medCutoff && r.score >= PRIORITY_MEDIUM_MIN_SCORE) {
      r.priority = 'medium'
    } else {
      r.priority = 'low'
    }
  }
}

function priorityFromScore(score: number): Priority {
  // Legacy fallback; retained for any lingering call sites.
  if (score >= 60) return 'high'
  if (score >= 30) return 'medium'
  return 'low'
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function buildRecommendations(profile: QuizProfile): SupplementRecommendation[] {
  const results: SupplementRecommendation[] = []

  const hasGoals = profile.goals.length > 0
  const hasSymptoms = profile.symptoms.length > 0
  const exercises = profile.exerciseType ?? []
  const hasLifestyle =
    profile.sunExposure !== 'some' ||
    exercises.length > 0 ||
    profile.alcoholConsumption !== 'none' ||
    profile.caffeineIntake !== 'none' ||
    profile.stressLevel !== 'low'
  const hasAgeSex = !!(profile.age && profile.age > 0) || !!(profile.sex && profile.sex !== 'prefer_not_to_say')

  const availableMax =
    WEIGHTS.diet +
    (hasLifestyle ? WEIGHTS.lifestyle : 0) +
    (hasSymptoms ? WEIGHTS.symptoms : 0) +
    (hasAgeSex ? WEIGHTS.ageSex : 0) +
    (hasGoals ? WEIGHTS.goals : 0)

  const denominator = availableMax || 1

  for (const supp of supplements) {
    const goals = goalsScore(supp, profile)
    const symptoms = symptomsScore(supp, profile)
    const diet = dietScore(supp, profile)
    const lifestyle = lifestyleScore(supp, profile)
    const ageSex = ageSexScore(supp, profile)

    const rawScore = goals.pts + symptoms.pts + diet.pts + lifestyle.pts + ageSex.pts
    if (rawScore <= 0) continue

    const allReasons: RecommendationReason[] = [
      ...diet.reasons,
      ...lifestyle.reasons,
      ...ageSex.reasons,
      ...symptoms.reasons,
      ...goals.reasons,
    ]

    let score: number
    let grade: EvidenceGrade

    if (hasEvidenceCache()) {
      // ─── Enhanced 6-layer scoring (with evidence cache) ─────────────
      // Layer 1: Profile relevance (0-25)
      const profileScore = Math.min(Math.round((rawScore / denominator) * 25), 25)

      // Layer 2: Evidence strength from PubMed/Semantic Scholar (0-25)
      const evidence = evidenceStrengthScore(supp.name, profile.goals, profile.symptoms)

      // Layer 3: Clinical trial data (0-15)
      const trials = clinicalTrialScore(supp.name, profile.goals, profile.symptoms)

      // Layer 4: Safety profile (0-15)
      const safety = safetyScore(supp.name)

      // Layer 5: Product availability (0-10)
      const availability = availabilityScore(supp.name)

      // Layer 6: Corroboration bonus
      const activeDimensions = [diet.pts, lifestyle.pts, symptoms.pts, goals.pts, evidence, trials]
        .filter(v => v > 0).length
      const bonus = activeDimensions >= CORROBORATION_MIN_DIMENSIONS
        ? (activeDimensions - CORROBORATION_MIN_DIMENSIONS + 1) * CORROBORATION_BONUS_RATE
        : 0

      let combined = profileScore + evidence + trials + safety + availability
      if (bonus > 0) combined = Math.min(combined * (1 + bonus), 100)

      score = Math.min(Math.round(combined), 100)
      grade = computeEvidenceGrade(supp.name, profile.goals, profile.symptoms)
      // Fallback: if no cache entries matched this user's goals/symptoms,
      // the dynamic grade is 'D' (Weak) by default. That would flag every
      // supplement the user didn't specifically target as weak, even
      // well-established ones. Fall back to the supplement's curated
      // baseline grade (supplements.json evidenceGrade) in that case.
      const relevantCacheHits = evidence + trials
      if (grade === 'D' && relevantCacheHits === 0 && supp.evidenceGrade) {
        grade = supp.evidenceGrade
      }

      // Add evidence reason tied to the per-user grade we actually display.
      // Previously this always said "Strong research evidence" even when the
      // user-facing badge was Moderate — confusing and contradictory.
      const gradeToLabel: Record<EvidenceGrade, string> = {
        A: 'Strong research evidence',
        B: 'Moderate research evidence',
        C: 'Limited research evidence',
        D: 'Weak research evidence',
      }
      const gradeToDetail: Record<EvidenceGrade, string> = {
        A: 'Backed by multiple meta-analyses and randomized controlled trials from PubMed',
        B: 'Backed by multiple randomized controlled trials from PubMed',
        C: 'Backed by small or mixed-result trials; more research is needed',
        D: 'Preliminary evidence only — largely mechanistic or observational',
      }
      if (evidence >= 10 || grade === 'A' || grade === 'B') {
        allReasons.push({
          type: 'goal',
          label: gradeToLabel[grade],
          detail: gradeToDetail[grade],
        })
      }
    } else {
      // ─── Fallback: original 4-dimension scoring (no cache) ──────────
      let normalized = (rawScore / denominator) * 100
      const bonus = corroborationBonus(diet.pts, lifestyle.pts, symptoms.pts, goals.pts)
      if (bonus > 0) normalized = Math.min(normalized * (1 + bonus), 100)
      score = Math.min(Math.round(normalized), 100)
      grade = supp.evidenceGrade as EvidenceGrade
    }

    const evidenceByCondition = hasEvidenceCache()
      ? computeEvidenceByCondition(supp.name, profile.goals, profile.symptoms)
          .map((e, i) => ({
            condition: e.condition,
            grade: e.grade,
            rctCount: e.rctCount,
            metaAnalysisCount: e.metaAnalysisCount,
            pubmedCount: e.pubmedCount,
            isPrimary: i === 0,
          }))
      : undefined

    results.push({
      supplement: supp,
      score,
      rank: 0,
      priority: priorityFromScore(score),
      reasons: allReasons,
      evidenceGrade: grade,
      evidenceByCondition,
      warnings: checkWarnings(supp, profile),
    })
  }

  results.sort((a, b) => b.score - a.score)

  // FIX (b): if the user has stated symptoms or goals, every top-3
  // candidate must address at least one of them. Prevents high-baseline
  // generalists (e.g. Methylfolate) from crowding into the top 3 of
  // unrelated single-symptom personas. Falls back to unfiltered results
  // if filtering would leave fewer than 3 supplements (rare; only happens
  // for very narrow input combinations).
  const hasUserInput = profile.symptoms.length + profile.goals.length > 0
  let ordered = results
  if (hasUserInput) {
    // Filter to supplements that legitimately address something the user
    // told us about. Six valid match dimensions — any one is sufficient:
    //   1. Symptom listed in supplement's deficiencySymptoms
    //   2. Goal listed in supplement's goalsSupported
    //   3. Diet boost — DIET_BOOST[user's diet] includes this supplement
    //      (e.g. carnivore → Vit C / Mg / Methylfolate / Probiotics / Ca
    //      because those are typically deficient on that diet)
    //   4. Lifestyle boost — LIFESTYLE_BOOST entries triggered by the
    //      user's active lifestyle (low sun, weight training, alcohol,
    //      caffeine, stress, etc.)
    //   5. Age boost — AGE_BOOSTS minAge ≤ user's age
    //   6. Sex boost — SEX_BOOSTS sex match, with optional maxAge
    // Falls back to unfiltered if filtering empties the list.
    const eligibleNames = computeBoostEligibleSupplements(profile)
    const filtered = results.filter((r) => {
      const symHit = profile.symptoms.some((s) => r.supplement.deficiencySymptoms.includes(s))
      const goalHit = profile.goals.some((g) => r.supplement.goalsSupported.includes(g))
      const boostHit = eligibleNames.has(r.supplement.name)
      return symHit || goalHit || boostHit
    })
    if (filtered.length > 0) ordered = filtered
  }
  ordered.forEach((r, i) => {
    r.rank = i + 1
  })
  assignRankedPriorities(ordered)

  return ordered
}
