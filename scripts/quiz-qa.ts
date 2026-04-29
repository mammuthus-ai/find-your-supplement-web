/**
 * quiz-qa.ts
 *
 * Synthetic-persona regression test for the recommendation engine.
 *
 * Why: the recommendation engine has a lot of moving parts (symptom matches,
 * goal matches, evidence cache lookups, condition humanization). Bugs hide in
 * specific input combinations — e.g. Probiotics getting labeled "for joint
 * pain" because its highest-meta cache entry is "inflammation" and the user
 * happens to have picked joint_pain.
 *
 * This script generates a representative set of personas, runs the engine
 * against each, and applies heuristic rules to flag suspicious outputs.
 *
 * Run:  npm run qa
 * Output: report goes to docs/quiz-qa-report.md (and stdout summary)
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import { buildRecommendations } from '../src/engine/recommendationEngine'
import type {
  QuizProfile,
  Symptom,
  Goal,
  DietType,
  Sex,
  SunExposure,
  ExerciseType,
  AlcoholConsumption,
  CaffeineIntake,
  StressLevel,
  SupplementRecommendation,
} from '../src/types'

// ─── Persona generation ──────────────────────────────────────────────────────

const ALL_SYMPTOMS: Symptom[] = [
  'fatigue', 'poor_sleep', 'brain_fog', 'joint_pain', 'frequent_illness',
  'anxiety', 'hair_loss', 'digestive_issues', 'low_mood', 'muscle_weakness',
  'poor_memory', 'dry_skin', 'acid_reflux', 'constipation', 'ibs',
  'bloating', 'nausea', 'apo_b_elevated', 'ldl_elevated', 'hdl_low',
  'triglycerides_high',
]
const ALL_GOALS: Goal[] = [
  'energy', 'sleep', 'muscle', 'focus', 'longevity', 'immunity', 'mood', 'weight_loss',
]
const ALL_DIETS: DietType[] = [
  'omnivore', 'vegetarian', 'vegan', 'keto', 'paleo',
  'pescatarian', 'mediterranean', 'carnivore', 'other',
]

interface Persona {
  id: string
  description: string
  profile: QuizProfile
}

const baseProfile = (overrides: Partial<QuizProfile> = {}): QuizProfile => ({
  age: 35,
  sex: 'female' as Sex,
  goals: [],
  dietType: 'omnivore' as DietType,
  sunExposure: 'some' as SunExposure,
  exerciseType: [] as ExerciseType[],
  alcoholConsumption: 'none' as AlcoholConsumption,
  caffeineIntake: 'none' as CaffeineIntake,
  stressLevel: 'moderate' as StressLevel,
  symptoms: [],
  medications: [],
  ...overrides,
})

function generatePersonas(): Persona[] {
  const personas: Persona[] = []

  // 1. Single-symptom personas
  for (const sym of ALL_SYMPTOMS) {
    personas.push({
      id: `sym:${sym}`,
      description: `Single symptom: ${sym}`,
      profile: baseProfile({ symptoms: [sym] }),
    })
  }

  // 2. Single-goal personas
  for (const goal of ALL_GOALS) {
    personas.push({
      id: `goal:${goal}`,
      description: `Single goal: ${goal}`,
      profile: baseProfile({ goals: [goal] }),
    })
  }

  // 3. Single-diet personas
  for (const diet of ALL_DIETS) {
    personas.push({
      id: `diet:${diet}`,
      description: `Diet only: ${diet}`,
      profile: baseProfile({ dietType: diet }),
    })
  }

  // 4. Common multi-symptom combinations users actually pick
  const SYMPTOM_PAIRS: { syms: Symptom[]; label: string }[] = [
    { syms: ['joint_pain', 'muscle_weakness'], label: 'Joint pain + muscle weakness' },
    { syms: ['hair_loss', 'brittle_nails' as Symptom], label: 'Hair loss + brittle nails' },
    { syms: ['low_mood', 'anxiety'], label: 'Low mood + anxiety' },
    { syms: ['fatigue', 'brain_fog'], label: 'Fatigue + brain fog' },
    { syms: ['acid_reflux', 'dry_skin', 'joint_pain'], label: 'GERD + dry skin + joint pain (user reported)' },
    { syms: ['bloating', 'ibs', 'constipation'], label: 'Gut chaos' },
    { syms: ['ldl_elevated', 'apo_b_elevated', 'triglycerides_high'], label: 'Lipid panel issues' },
    { syms: ['poor_sleep', 'anxiety', 'fatigue'], label: 'Insomnia loop' },
    { syms: ['frequent_illness', 'fatigue'], label: 'Sick & tired' },
  ]
  for (const { syms, label } of SYMPTOM_PAIRS) {
    personas.push({
      id: `combo:${syms.join('+')}`,
      description: label,
      profile: baseProfile({ symptoms: syms.filter((s) => ALL_SYMPTOMS.includes(s)) }),
    })
  }

  // 5. Realistic combined personas
  personas.push({
    id: 'realistic:vegan-female-35',
    description: 'Vegan female, 35, low energy + brain fog',
    profile: baseProfile({
      sex: 'female', age: 35, dietType: 'vegan',
      symptoms: ['fatigue', 'brain_fog'], goals: ['energy', 'focus'],
    }),
  })
  personas.push({
    id: 'realistic:older-male-statin',
    description: 'Male, 60, on statins, elevated LDL',
    profile: baseProfile({
      sex: 'male', age: 60,
      symptoms: ['ldl_elevated', 'apo_b_elevated', 'fatigue', 'muscle_weakness'],
      medications: ['atorvastatin'], goals: ['longevity', 'energy'],
    }),
  })
  personas.push({
    id: 'realistic:athlete-male-30',
    description: 'Male athlete, 30, weight training, high stress',
    profile: baseProfile({
      sex: 'male', age: 30,
      exerciseType: ['weight_training'], stressLevel: 'high',
      symptoms: ['poor_sleep', 'muscle_weakness'], goals: ['muscle', 'sleep'],
    }),
  })
  personas.push({
    id: 'realistic:postmeno-65',
    description: 'Post-menopausal female, 65, bone health focus',
    profile: baseProfile({
      sex: 'female', age: 65,
      sunExposure: 'very_little',
      symptoms: ['joint_pain', 'muscle_weakness'], goals: ['longevity'],
    }),
  })

  return personas
}

// ─── Heuristic rules ─────────────────────────────────────────────────────────

interface Issue {
  personaId: string
  personaDesc: string
  severity: 'high' | 'medium' | 'low'
  rule: string
  detail: string
  rank: number
  supplement: string
}

interface PersonaResult {
  personaId: string
  personaDesc: string
  top3Names: string[]
  issues: Issue[]
}

/** Symptom synonyms in cache-condition strings. Used to validate that a
 *  cache condition is actually relevant to a user-picked symptom. */
const SYMPTOM_TO_CONDITIONS: Record<Symptom, string[]> = {
  fatigue: ['fatigue', 'energy'],
  poor_sleep: ['sleep', 'insomnia'],
  brain_fog: ['cognitive function', 'cognition', 'focus', 'brain'],
  joint_pain: ['joint pain', 'inflammation', 'osteoarthritis', 'arthritis'],
  frequent_illness: ['immune function', 'immunity', 'infection'],
  anxiety: ['anxiety', 'stress'],
  hair_loss: ['hair', 'alopecia'],
  digestive_issues: ['digestive health', 'gerd', 'gastroesophageal reflux', 'dyspepsia'],
  low_mood: ['depression', 'mood'],
  muscle_weakness: ['muscle strength', 'sarcopenia', 'muscle'],
  poor_memory: ['memory', 'cognitive function', 'cognition'],
  dry_skin: ['skin', 'dermatitis', 'inflammation'],
  acid_reflux: ['gerd', 'gastroesophageal reflux', 'reflux', 'dyspepsia'],
  constipation: ['constipation', 'bowel', 'digestive health'],
  ibs: ['irritable bowel syndrome', 'ibs', 'digestive health'],
  bloating: ['bloating', 'dyspepsia', 'digestive health'],
  nausea: ['nausea', 'dyspepsia', 'digestive health'],
  apo_b_elevated: ['apolipoprotein b', 'apob', 'heart health'],
  ldl_elevated: ['ldl cholesterol', 'hypercholesterolemia', 'heart health'],
  hdl_low: ['hdl cholesterol', 'heart health'],
  triglycerides_high: ['hypertriglyceridemia', 'triglycerides', 'heart health'],
}

const GOAL_TO_CONDITIONS: Record<Goal, string[]> = {
  energy: ['fatigue', 'energy'],
  sleep: ['sleep', 'insomnia'],
  muscle: ['muscle strength', 'sarcopenia', 'muscle'],
  focus: ['cognitive function', 'focus'],
  longevity: ['longevity', 'all-cause mortality', 'heart health'],
  immunity: ['immune function', 'immunity'],
  mood: ['depression', 'mood'],
  weight_loss: ['weight loss', 'obesity'],
}

/** True if the cache condition is plausibly relevant to a user-picked
 *  symptom or goal. */
function isRelevantCondition(
  condition: string,
  symptoms: Symptom[],
  goals: Goal[],
): boolean {
  const c = condition.toLowerCase()
  for (const s of symptoms) {
    if (SYMPTOM_TO_CONDITIONS[s].some((alias) => c.includes(alias.toLowerCase()))) return true
  }
  for (const g of goals) {
    if (GOAL_TO_CONDITIONS[g].some((alias) => c.includes(alias.toLowerCase()))) return true
  }
  return false
}

function evaluatePersona(persona: Persona): PersonaResult {
  const profile = persona.profile
  const recs = buildRecommendations(profile).slice(0, 3)
  const issues: Issue[] = []
  const top3Names = recs.map((r) => r.supplement.name)

  for (const rec of recs) {
    const supp = rec.supplement
    const supSyms = supp.deficiencySymptoms ?? []
    const supGoals = ((supp as { goalsSupported?: Goal[] }).goalsSupported ?? []) as Goal[]
    const matchedSymptoms = profile.symptoms.filter((s) => supSyms.includes(s))
    const matchedGoals = profile.goals.filter((g) => supGoals.includes(g))
    const totalMatches = matchedSymptoms.length + matchedGoals.length

    // RULE 1: top-3 supplement with zero matches when user has provided
    // ≥1 symptom or goal — unexpected promotion.
    if (totalMatches === 0 && (profile.symptoms.length + profile.goals.length) > 0) {
      issues.push({
        personaId: persona.id,
        personaDesc: persona.description,
        severity: 'medium',
        rule: 'unexpected-promotion',
        detail: `${supp.name} appears in top 3 with no matched symptoms or goals (user picked ${[...profile.symptoms, ...profile.goals].join(', ') || 'nothing'})`,
        rank: rec.rank,
        supplement: supp.name,
      })
    }

    // RULE 2: primary evidence condition is irrelevant to user's actual
    // inputs AND is not a symptom this supplement covers.
    const primaryEv = rec.evidenceByCondition?.[0]
    if (primaryEv && profile.symptoms.length + profile.goals.length > 0) {
      const cond = primaryEv.condition.toLowerCase()
      const relevant = isRelevantCondition(cond, profile.symptoms, profile.goals)
      const supplementCovers = supSyms.some((s) =>
        SYMPTOM_TO_CONDITIONS[s]?.some((alias) => cond.includes(alias.toLowerCase()))
      )
      if (!relevant && !supplementCovers && cond !== 'general') {
        issues.push({
          personaId: persona.id,
          personaDesc: persona.description,
          severity: 'medium',
          rule: 'irrelevant-primary-evidence',
          detail: `${supp.name} primary cache condition "${primaryEv.condition}" doesn't map to user's inputs or this supplement's symptoms`,
          rank: rec.rank,
          supplement: supp.name,
        })
      }
    }

    // RULE 3: "Why this supplement" reasons mention a symptom the user
    // did not pick. Inspects rec.reasons of type 'symptom'.
    for (const r of rec.reasons ?? []) {
      if (r.type !== 'symptom') continue
      const symptomInLabel = (r.label || '').toLowerCase().replace(/^addresses symptom:\s*/i, '').replace(/\s/g, '_').trim() as Symptom
      if (profile.symptoms.length > 0 && !profile.symptoms.includes(symptomInLabel)) {
        issues.push({
          personaId: persona.id,
          personaDesc: persona.description,
          severity: 'high',
          rule: 'reason-mentions-unpicked-symptom',
          detail: `${supp.name} reason "${r.label}" references symptom "${symptomInLabel}" not in user's symptoms (${profile.symptoms.join(', ')})`,
          rank: rec.rank,
          supplement: supp.name,
        })
      }
    }

    // RULE 4: All top-3 carry evidence grade D — likely cache miss.
    // (Checked once outside loop, see below)
  }

  // RULE 4: across the top 3
  if (recs.length === 3 && recs.every((r) => (r.evidenceByCondition?.[0]?.grade ?? r.evidenceGrade) === 'D')) {
    issues.push({
      personaId: persona.id,
      personaDesc: persona.description,
      severity: 'low',
      rule: 'all-grade-d',
      detail: `All top-3 supplements have evidence grade D — likely cache lookup miss for this combination`,
      rank: 0,
      supplement: top3Names.join(', '),
    })
  }

  return { personaId: persona.id, personaDesc: persona.description, top3Names, issues }
}

// ─── Report generation ──────────────────────────────────────────────────────

function generateReport(results: PersonaResult[]): { md: string; issueCount: number } {
  const allIssues = results.flatMap((r) => r.issues)
  const high = allIssues.filter((i) => i.severity === 'high')
  const medium = allIssues.filter((i) => i.severity === 'medium')
  const low = allIssues.filter((i) => i.severity === 'low')

  const lines: string[] = []
  lines.push('# Quiz QA Report')
  lines.push('')
  lines.push(`Generated: ${new Date().toISOString()}`)
  lines.push('')
  lines.push(`**Personas tested:** ${results.length}`)
  lines.push(`**Total issues:** ${allIssues.length} (${high.length} high · ${medium.length} medium · ${low.length} low)`)
  lines.push('')

  if (allIssues.length === 0) {
    lines.push('No issues detected. ✅')
  } else {
    // Group by rule
    const byRule = new Map<string, Issue[]>()
    for (const i of allIssues) {
      if (!byRule.has(i.rule)) byRule.set(i.rule, [])
      byRule.get(i.rule)!.push(i)
    }
    for (const [rule, issues] of Array.from(byRule.entries())) {
      lines.push(`## ${rule} (${issues.length})`)
      lines.push('')
      for (const issue of issues.slice(0, 30)) {
        lines.push(`- **[${issue.severity}]** persona \`${issue.personaId}\` — ${issue.detail}`)
      }
      if (issues.length > 30) lines.push(`  - …and ${issues.length - 30} more`)
      lines.push('')
    }
  }

  lines.push('## All persona top-3 outputs')
  lines.push('')
  lines.push('| Persona | Top 3 |')
  lines.push('|---|---|')
  for (const r of results) {
    lines.push(`| \`${r.personaId}\` — ${r.personaDesc} | ${r.top3Names.join(' · ') || '*(none)*'} |`)
  }

  return { md: lines.join('\n') + '\n', issueCount: allIssues.length }
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  const personas = generatePersonas()
  const results = personas.map(evaluatePersona)
  const { md, issueCount } = generateReport(results)

  const outDir = path.join(__dirname, '..', 'docs')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
  const outPath = path.join(outDir, 'quiz-qa-report.md')
  fs.writeFileSync(outPath, md)

  // Stdout summary
  const high = results.flatMap((r) => r.issues).filter((i) => i.severity === 'high').length
  const medium = results.flatMap((r) => r.issues).filter((i) => i.severity === 'medium').length
  const low = results.flatMap((r) => r.issues).filter((i) => i.severity === 'low').length
  console.log(`Quiz QA: ${personas.length} personas, ${issueCount} issues (${high} high / ${medium} medium / ${low} low)`)
  console.log(`Report: ${outPath}`)

  // Exit non-zero if any high-severity issues — useful for CI
  process.exit(high > 0 ? 1 : 0)
}

main()
