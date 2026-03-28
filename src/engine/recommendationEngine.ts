/**
 * Web Recommendation Engine
 *
 * Adapted from the mobile app engine (v4) for the web quiz.
 * Web version uses: Goals, Diet, Lifestyle, Symptoms
 * (Blood work and genetics are app-only features)
 *
 * Dimension weights calibrated from PubMed literature:
 *   Diet:      20  (vegan diets: 93–95% B12 deficiency prevalence)
 *   Lifestyle: 15  (PubMed-backed: sun exposure, exercise, alcohol, caffeine, stress)
 *   Symptoms:  10  (sensitivity <80%, high overlap between conditions)
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
  hasEvidenceCache,
} from './evidenceScorer'

const WEIGHTS = {
  diet: 20,
  lifestyle: 15,
  symptoms: 10,
  goals: 5,
} as const

const CORROBORATION_BONUS_RATE = 0.12
const CORROBORATION_MIN_DIMENSIONS = 2

// ─── Diet boost/suppress maps (PubMed-derived) ────────────────────────────────

const DIET_BOOST: Record<string, string[]> = {
  carnivore: ['Vitamin C', 'Magnesium', 'Methylfolate (5-MTHF)', 'Probiotics'],
  vegan: ['Vitamin B12', 'Omega-3 (Fish Oil / Algae)', 'Iron', 'Zinc', 'Vitamin D3', 'Creatine Monohydrate'],
  vegetarian: ['Vitamin B12', 'Omega-3 (Fish Oil / Algae)', 'Iron', 'Zinc', 'Vitamin D3', 'Creatine Monohydrate'],
  keto: ['Vitamin C', 'Methylfolate (5-MTHF)', 'Magnesium', 'Probiotics'],
  paleo: ['Vitamin D3', 'Vitamin B12'],
  pescatarian: ['Vitamin B12', 'Iron', 'Zinc', 'Creatine Monohydrate'],
  mediterranean: ['Vitamin D3', 'Vitamin B12'],
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

const LIFESTYLE_BOOST: Record<string, { supplement: string; magnitude: Magnitude }[]> = {
  sun_very_little: [
    { supplement: 'Vitamin D3', magnitude: 'high' },
    { supplement: 'Magnesium', magnitude: 'medium' },
  ],
  exercise_weight_training: [
    { supplement: 'Creatine Monohydrate', magnitude: 'high' },
    { supplement: 'Collagen Peptides', magnitude: 'medium' },
    { supplement: 'Magnesium', magnitude: 'high' },
    { supplement: 'Zinc', magnitude: 'medium' },
  ],
  exercise_cardio: [
    { supplement: 'Iron', magnitude: 'high' },
    { supplement: 'Vitamin D3', magnitude: 'medium' },
    { supplement: 'Omega-3 (Fish Oil / Algae)', magnitude: 'medium' },
    { supplement: 'Magnesium', magnitude: 'high' },
  ],
  exercise_both: [
    { supplement: 'Creatine Monohydrate', magnitude: 'high' },
    { supplement: 'Iron', magnitude: 'high' },
    { supplement: 'Magnesium', magnitude: 'high' },
    { supplement: 'Zinc', magnitude: 'medium' },
    { supplement: 'Vitamin D3', magnitude: 'medium' },
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
    { supplement: 'Vitamin B12', magnitude: 'medium' },
    { supplement: 'Vitamin C', magnitude: 'medium' },
    { supplement: 'Zinc', magnitude: 'medium' },
    { supplement: 'Probiotics', magnitude: 'medium' },
  ],
  stress_very_high: [
    { supplement: 'Ashwagandha (KSM-66)', magnitude: 'high' },
    { supplement: 'Magnesium', magnitude: 'high' },
    { supplement: 'Vitamin B12', magnitude: 'medium' },
    { supplement: 'Vitamin C', magnitude: 'medium' },
    { supplement: 'Zinc', magnitude: 'medium' },
    { supplement: 'Probiotics', magnitude: 'medium' },
  ],
}

const MAGNITUDE_SCORE: Record<Magnitude, number> = {
  high: 3,
  medium: 2,
  low: 1,
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

  if (profile.exerciseType === 'weight_training') activeKeys.push('exercise_weight_training')
  else if (profile.exerciseType === 'cardio') activeKeys.push('exercise_cardio')
  else if (profile.exerciseType === 'both') activeKeys.push('exercise_both')

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

function corroborationBonus(dietPts: number, lifestylePts: number, symptomPts: number, goalPts: number): number {
  const activeDims = [dietPts, lifestylePts, symptomPts, goalPts].filter((p) => p > 0).length
  if (activeDims < CORROBORATION_MIN_DIMENSIONS) return 0
  return (activeDims - CORROBORATION_MIN_DIMENSIONS + 1) * CORROBORATION_BONUS_RATE
}

function priorityFromScore(score: number): Priority {
  if (score >= 60) return 'high'
  if (score >= 30) return 'medium'
  return 'low'
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function buildRecommendations(profile: QuizProfile): SupplementRecommendation[] {
  const results: SupplementRecommendation[] = []

  const hasGoals = profile.goals.length > 0
  const hasSymptoms = profile.symptoms.length > 0
  const hasLifestyle =
    profile.sunExposure !== 'some' ||
    profile.exerciseType !== 'none' ||
    profile.alcoholConsumption !== 'none' ||
    profile.caffeineIntake !== 'none' ||
    profile.stressLevel !== 'low'

  const availableMax =
    WEIGHTS.diet +
    (hasLifestyle ? WEIGHTS.lifestyle : 0) +
    (hasSymptoms ? WEIGHTS.symptoms : 0) +
    (hasGoals ? WEIGHTS.goals : 0)

  const denominator = availableMax || 1

  for (const supp of supplements) {
    const goals = goalsScore(supp, profile)
    const symptoms = symptomsScore(supp, profile)
    const diet = dietScore(supp, profile)
    const lifestyle = lifestyleScore(supp, profile)

    const rawScore = goals.pts + symptoms.pts + diet.pts + lifestyle.pts
    if (rawScore <= 0) continue

    const allReasons: RecommendationReason[] = [
      ...diet.reasons,
      ...lifestyle.reasons,
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

      // Add evidence reason if significant
      if (evidence >= 15) {
        allReasons.push({
          type: 'goal',
          label: 'Strong research evidence',
          detail: `Backed by multiple meta-analyses and randomized controlled trials from PubMed`,
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

    results.push({
      supplement: supp,
      score,
      rank: 0,
      priority: priorityFromScore(score),
      reasons: allReasons,
      evidenceGrade: grade,
    })
  }

  results.sort((a, b) => b.score - a.score)
  results.forEach((r, i) => {
    r.rank = i + 1
  })

  return results
}
