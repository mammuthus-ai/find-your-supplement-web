import type { EvidenceCache, EvidenceEntry, EvidenceGrade, Goal, Symptom } from '@/types'

// Try to load the evidence cache at build time
let cache: EvidenceCache | null = null
try {
  cache = require('@/data/evidenceCache.json') as EvidenceCache
} catch {
  // Cache not yet built — fallback to no evidence scoring
}

// ─── Condition mapping ──────────────────────────────────────────────────────

// Map quiz goals/symptoms to evidence cache condition strings
const GOAL_CONDITIONS: Record<Goal, string[]> = {
  energy: ['energy', 'fatigue'],
  sleep: ['sleep'],
  muscle: ['muscle strength'],
  focus: ['cognitive function', 'focus'],
  longevity: ['longevity', 'heart health'],
  immunity: ['immune function', 'immunity'],
  mood: ['mood', 'depression', 'anxiety'],
  weight_loss: ['weight loss'],
}

const SYMPTOM_CONDITIONS: Record<Symptom, string[]> = {
  fatigue: ['fatigue', 'energy'],
  poor_sleep: ['sleep'],
  brain_fog: ['cognitive function', 'focus'],
  joint_pain: ['joint pain', 'inflammation'],
  frequent_illness: ['immune function', 'immunity'],
  anxiety: ['anxiety', 'mood'],
  hair_loss: ['hair loss'],
  digestive_issues: ['digestive health'],
  low_mood: ['mood', 'depression'],
  muscle_weakness: ['muscle strength'],
  poor_memory: ['cognitive function'],
  dry_skin: ['inflammation'],
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getEntries(supplementName: string): EvidenceEntry[] {
  if (!cache) return []
  // Normalize name for lookup (cache keys may differ slightly)
  for (const key of Object.keys(cache.entries)) {
    if (supplementName.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(supplementName.toLowerCase().split(' ')[0])) {
      return cache.entries[key]
    }
  }
  return cache.entries[supplementName] || []
}

function getRelevantEntries(
  supplementName: string,
  goals: Goal[],
  symptoms: Symptom[]
): EvidenceEntry[] {
  const entries = getEntries(supplementName)
  if (entries.length === 0) return []

  const targetConditions = new Set<string>()
  for (const g of goals) {
    for (const c of GOAL_CONDITIONS[g] || []) targetConditions.add(c)
  }
  for (const s of symptoms) {
    for (const c of SYMPTOM_CONDITIONS[s] || []) targetConditions.add(c)
  }

  return entries.filter(e => targetConditions.has(e.condition))
}

// ─── Scoring Functions ──────────────────────────────────────────────────────

/**
 * Layer 2: Evidence Strength Score (0-25)
 * Based on PubMed article counts, RCTs, meta-analyses, and citation scores.
 */
export function evidenceStrengthScore(
  supplementName: string,
  goals: Goal[],
  symptoms: Symptom[]
): number {
  const relevant = getRelevantEntries(supplementName, goals, symptoms)
  if (relevant.length === 0) return 0

  // Aggregate across all relevant conditions
  const totalRCTs = relevant.reduce((s, e) => s + e.rctCount, 0)
  const totalMAs = relevant.reduce((s, e) => s + e.metaAnalysisCount, 0)
  const avgCitations = relevant.length > 0
    ? relevant.reduce((s, e) => s + e.citationScore, 0) / relevant.length
    : 0

  let score = 0

  // Meta-analysis strength
  if (totalMAs >= 3) score += 10
  else if (totalMAs >= 1) score += 6

  // RCT base
  if (totalRCTs >= 20) score += 8
  else if (totalRCTs >= 5) score += 5
  else if (totalRCTs >= 1) score += 2

  // Citation bonus (up to 5 points)
  score += Math.min(avgCitations / 100, 5)

  return Math.min(Math.round(score), 25)
}

/**
 * Layer 3: Clinical Trial Score (0-15)
 * Based on ClinicalTrials.gov data.
 */
export function clinicalTrialScore(
  supplementName: string,
  goals: Goal[],
  symptoms: Symptom[]
): number {
  const relevant = getRelevantEntries(supplementName, goals, symptoms)
  if (relevant.length === 0) return 0

  const totalCompleted = relevant.reduce((s, e) => s + e.trialData.completed, 0)
  const totalPositive = relevant.reduce((s, e) => s + e.trialData.positive, 0)
  const totalPhase3 = relevant.reduce((s, e) => s + e.trialData.phase3Plus, 0)

  let score = 0

  // Phase 3+ trial bonus
  if (totalPhase3 > 0) score += 6

  // Positive outcome rate
  if (totalCompleted > 0) {
    const positiveRate = totalPositive / totalCompleted
    score += positiveRate * 9
  }

  return Math.min(Math.round(score), 15)
}

/**
 * Layer 4: Safety Score (0-15)
 * Starts at 15 and penalizes based on adverse events.
 */
export function safetyScore(supplementName: string): number {
  const entries = getEntries(supplementName)
  if (entries.length === 0) return 15 // Default: safe (no data = no red flags)

  const adverseEvents = entries[0]?.safety?.adverseEventCount || 0

  let penalty = 0
  if (adverseEvents > 1000) penalty += 5
  else if (adverseEvents > 100) penalty += 2

  const warnings = entries[0]?.safety?.interactionWarnings?.length || 0
  if (warnings > 3) penalty += 3
  else if (warnings > 0) penalty += 1

  return Math.max(15 - penalty, 0)
}

/**
 * Layer 5: Product Availability Score (0-10)
 * Based on DSLD product count.
 */
export function availabilityScore(supplementName: string): number {
  const entries = getEntries(supplementName)
  if (entries.length === 0) return 5 // Default: assume moderate availability

  const productCount = entries[0]?.productCount || 0

  if (productCount >= 50) return 10
  if (productCount >= 10) return 7
  if (productCount >= 1) return 4
  return 0
}

/**
 * Compute dynamic evidence grade based on evidence + trial data.
 */
export function computeEvidenceGrade(
  supplementName: string,
  goals: Goal[],
  symptoms: Symptom[]
): EvidenceGrade {
  const evidence = evidenceStrengthScore(supplementName, goals, symptoms)
  const trials = clinicalTrialScore(supplementName, goals, symptoms)
  const combined = evidence + trials

  if (combined >= 30) return 'A'
  if (combined >= 20) return 'B'
  if (combined >= 10) return 'C'
  return 'D'
}

/**
 * Check if the evidence cache is loaded and available.
 */
export function hasEvidenceCache(): boolean {
  return cache !== null && Object.keys(cache.entries).length > 0
}
