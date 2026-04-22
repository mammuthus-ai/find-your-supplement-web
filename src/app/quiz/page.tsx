'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { trackQuizStart, trackQuizStepComplete, trackQuizComplete } from '@/lib/analytics'
import IntermediatePreview from '@/components/IntermediatePreview'
import { buildRecommendations } from '@/engine/recommendationEngine'
import type {
  Goal,
  DietType,
  Symptom,
  Sex,
  SunExposure,
  ExerciseType,
  AlcoholConsumption,
  CaffeineIntake,
  StressLevel,
  QuizProfile,
} from '@/types'

// ─── Step data ────────────────────────────────────────────────────────────────

// Biological sex drives several engine boosts (iron/folate for women of
// reproductive age, etc.). Keep UI binary — it maps directly to the
// underlying data model. Users who don't identify in either category
// can skip the question by not selecting; engine treats no selection
// same as "male" (zero boosts), which is the conservative default.
const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
]

const GOALS: { value: Goal; label: string; emoji: string }[] = [
  { value: 'energy', label: 'Energy', emoji: '⚡' },
  { value: 'sleep', label: 'Sleep', emoji: '😴' },
  { value: 'muscle', label: 'Muscle & Strength', emoji: '💪' },
  { value: 'focus', label: 'Focus & Memory', emoji: '🧠' },
  { value: 'longevity', label: 'Longevity', emoji: '🌿' },
  { value: 'immunity', label: 'Immunity', emoji: '🛡️' },
  { value: 'mood', label: 'Mood', emoji: '☀️' },
  { value: 'weight_loss', label: 'Weight Loss', emoji: '⚖️' },
]

// Vegan and vegetarian trigger IDENTICAL engine behavior (same 7 boosts, same
// 1 suppress), so they're merged into one UI chip. Internally the selection
// stores "vegan" — conservative for engine matching.
const DIETS: { value: DietType; label: string; desc: string; emoji: string }[] = [
  { value: 'omnivore', label: 'Omnivore', desc: 'Eat everything', emoji: '🍽️' },
  { value: 'vegan', label: 'Plant-based', desc: 'Vegan or vegetarian', emoji: '🌱' },
  { value: 'keto', label: 'Keto', desc: 'High fat, low carb', emoji: '🥑' },
  { value: 'paleo', label: 'Paleo', desc: 'Whole foods, no grains', emoji: '🥩' },
  { value: 'pescatarian', label: 'Pescatarian', desc: 'Fish but no meat', emoji: '🐟' },
  { value: 'mediterranean', label: 'Mediterranean', desc: 'Olive oil, fish, veg', emoji: '🫒' },
  { value: 'carnivore', label: 'Carnivore', desc: 'Mostly animal foods', emoji: '🥓' },
  { value: 'other', label: 'Other', desc: "Doesn't fit a category", emoji: '🍴' },
]

// ─── Grouped symptoms (Option B) ─────────────────────────────────────────────
// 21 raw Symptom tokens reduced to 13 merged chips across 5 sections. Each
// chip selects ONE OR MORE underlying tokens so the engine keeps full
// precision — a user ticking "Brain Fog / Poor Memory" adds both brain_fog
// AND poor_memory to the profile, giving the engine identical signal to
// the old separate chips. Chips are intentionally ordered by frequency of
// mention across our userbase (top-ranked first within each section).

interface SymptomGroupItem {
  /** Unique UI key (merged token; used for the chip's selected state) */
  key: string
  /** Human label shown on the chip */
  label: string
  /** Emoji prefix */
  emoji: string
  /** Underlying Symptom tokens this chip represents in the engine profile */
  tokens: Symptom[]
}
interface SymptomGroup {
  id: string
  title: string
  emoji: string
  items: SymptomGroupItem[]
}

const SYMPTOM_GROUPS: SymptomGroup[] = [
  {
    id: 'mind_mood', title: 'Mind & Mood', emoji: '🧠',
    items: [
      { key: 'fatigue',            label: 'Fatigue / Low Energy',     emoji: '😴', tokens: ['fatigue'] },
      { key: 'brain_fog_memory',   label: 'Brain Fog / Poor Memory',  emoji: '🌫️', tokens: ['brain_fog', 'poor_memory'] },
      { key: 'mood',               label: 'Low Mood or Anxious',      emoji: '😔', tokens: ['low_mood', 'anxiety'] },
      { key: 'poor_sleep',         label: 'Poor Sleep',               emoji: '🌙', tokens: ['poor_sleep'] },
    ],
  },
  {
    id: 'immunity_appearance', title: 'Immunity & Appearance', emoji: '🛡️',
    items: [
      { key: 'frequent_illness',   label: 'Get Sick Often',           emoji: '🤧', tokens: ['frequent_illness'] },
      { key: 'hair_skin',          label: 'Hair Loss or Dry Skin',     emoji: '💇', tokens: ['hair_loss', 'dry_skin'] },
    ],
  },
  {
    id: 'movement', title: 'Joints & Muscles', emoji: '💪',
    items: [
      { key: 'joint_muscle',       label: 'Joint Pain or Muscle Weakness', emoji: '🦴', tokens: ['joint_pain', 'muscle_weakness'] },
    ],
  },
  {
    id: 'digestive', title: 'Digestive', emoji: '🔥',
    items: [
      { key: 'acid_reflux',        label: 'Acid Reflux / GERD',       emoji: '🔥', tokens: ['acid_reflux'] },
      { key: 'constipation',       label: 'Constipation',             emoji: '🚽', tokens: ['constipation'] },
      { key: 'ibs',                label: 'IBS',                      emoji: '🌊', tokens: ['ibs'] },
      { key: 'bloating_nausea',    label: 'Bloating / Nausea',        emoji: '🎈', tokens: ['bloating', 'nausea'] },
    ],
  },
  {
    id: 'cardio', title: 'Heart & Cholesterol', emoji: '🫀',
    items: [
      { key: 'high_cholesterol',   label: 'High Cholesterol (LDL / ApoB)', emoji: '🫀', tokens: ['ldl_elevated', 'apo_b_elevated'] },
      { key: 'hdl_low',            label: 'Low HDL Cholesterol',      emoji: '🫀', tokens: ['hdl_low'] },
      { key: 'triglycerides_high', label: 'High Triglycerides',       emoji: '🫀', tokens: ['triglycerides_high'] },
    ],
  },
]

// Only `very_little` triggers the Vitamin D3 boost — "some" and "a lot"
// get no engine treatment differently. Binary: do you get 15+ min of sun
// most days or not.
const SUN_OPTIONS: { value: SunExposure; label: string; desc: string }[] = [
  { value: 'some',        label: 'Yes', desc: 'At least 15 minutes of direct sun most days' },
  { value: 'very_little', label: 'No',  desc: 'Mostly indoors, or always covered up' },
]

const EXERCISE_OPTIONS: { value: ExerciseType; label: string; desc: string }[] = [
  { value: 'cardio', label: 'Cardio', desc: 'Running, cycling, swimming' },
  { value: 'weight_training', label: 'Weight training', desc: 'Lifting, resistance' },
]

// Engine gives IDENTICAL boost lists (Methylfolate, B12, Mg, Zn, D3, NAC)
// for both "moderate" (3-7/week) and "heavy" (8+/week) drinking. Anything
// below 3/week gets zero. So the honest binary threshold is 3+/week, not
// 8+/week, which preserves current behavior for moderate drinkers.
const ALCOHOL_OPTIONS: { value: AlcoholConsumption; label: string; desc: string }[] = [
  { value: 'heavy', label: 'Yes', desc: '3 or more drinks per week' },
  { value: 'none',  label: 'No',  desc: '2 or fewer drinks per week, or none at all' },
]

// Caffeine-mediated depletion (Magnesium + Iron absorption) kicks in at
// roughly 150+ mg/day, regardless of source. Captured as binary.
// Equivalents shown in description so tea / energy-drink / pre-workout
// users map themselves correctly.
const CAFFEINE_OPTIONS: { value: CaffeineIntake; label: string; desc: string }[] = [
  { value: 'heavy', label: 'Yes', desc: '1.5+ cups of coffee daily — or 3+ cups of tea, an energy drink, or a pre-workout scoop' },
  { value: 'none',  label: 'No',  desc: '1 cup of coffee a day or less, or none at all' },
]

// "high" and "very_high" trigger IDENTICAL engine boosts (Ashwagandha,
// Magnesium, B12, Vitamin C, Zinc). Merged into one "High" option.
const STRESS_OPTIONS: { value: StressLevel; label: string; desc: string }[] = [
  { value: 'low', label: 'Low', desc: 'Generally relaxed' },
  { value: 'moderate', label: 'Moderate', desc: 'Normal life stress' },
  { value: 'high', label: 'High', desc: 'Frequently or chronically stressed' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepHeader({ step, total, title, subtitle }: { step: number; total: number; title: string; subtitle: string }) {
  const pct = Math.round((step / total) * 100)
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-text-secondary text-xs font-medium">Step {step} of {total}</span>
        <span className="text-teal text-xs font-medium">{pct}%</span>
      </div>
      <div className="w-full h-1.5 bg-surface-alt rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-teal rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-text mb-2">{title}</h2>
      <p className="text-text-secondary text-sm">{subtitle}</p>
    </div>
  )
}

function MultiSelectChip({
  selected,
  onToggle,
  emoji,
  label,
}: {
  selected: boolean
  onToggle: () => void
  emoji?: string
  label: string
}) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
        selected
          ? 'bg-teal/10 border-teal text-teal'
          : 'bg-surface border-border text-text-secondary hover:border-text-tertiary hover:text-text'
      }`}
    >
      {emoji && <span className="text-base">{emoji}</span>}
      <span>{label}</span>
      {selected && (
        <svg className="w-4 h-4 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  )
}

function SingleSelectCard({
  selected,
  onSelect,
  label,
  desc,
}: {
  selected: boolean
  onSelect: () => void
  label: string
  desc: string
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all ${
        selected
          ? 'bg-teal/10 border-teal'
          : 'bg-surface border-border hover:border-text-tertiary'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${selected ? 'text-teal' : 'text-text'}`}>{label}</p>
          <p className="text-text-tertiary text-xs mt-0.5">{desc}</p>
        </div>
        <div
          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ml-3 transition-all ${
            selected ? 'border-teal bg-teal' : 'border-border'
          }`}
        />
      </div>
    </button>
  )
}

// ─── Main quiz component ──────────────────────────────────────────────────────

const TOTAL_STEPS = 6

type QuizPhase = 'question' | 'preview'

export default function QuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [phase, setPhase] = useState<QuizPhase>('question')

  // Step 1: Age & Sex
  const [age, setAge] = useState('')
  const [sex, setSex] = useState<Sex | null>(null)

  // Step 2: Goals
  const [goals, setGoals] = useState<Goal[]>([])

  // Step 3: Diet
  const [dietType, setDietType] = useState<DietType | null>(null)

  // Step 4: Lifestyle
  const [sunExposure, setSunExposure] = useState<SunExposure | null>(null)
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([])
  const [alcoholConsumption, setAlcoholConsumption] = useState<AlcoholConsumption | null>(null)
  const [caffeineIntake, setCaffeineIntake] = useState<CaffeineIntake | null>(null)
  const [stressLevel, setStressLevel] = useState<StressLevel | null>(null)

  // Step 5: Medications
  const [medicationsText, setMedicationsText] = useState('')
  const [noMedications, setNoMedications] = useState(false)

  // Step 6: Symptoms
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [noSymptoms, setNoSymptoms] = useState(false)

  function toggleGoal(g: Goal) {
    setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]))
  }

  function toggleSymptom(s: Symptom) {
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }

  /** Toggle a merged symptom group item — adds or removes all its underlying
   *  engine tokens at once so the recommendation engine gets identical signal
   *  to the pre-merge version. Also clears the "No symptoms" flag if user
   *  selects anything. */
  function toggleSymptomGroup(tokens: Symptom[]) {
    if (noSymptoms) setNoSymptoms(false)
    setSymptoms((prev) => {
      const allSelected = tokens.every((t) => prev.includes(t))
      if (allSelected) {
        return prev.filter((t) => !tokens.includes(t))
      }
      // Add any missing tokens (union, no duplicates)
      const set = new Set(prev)
      tokens.forEach((t) => set.add(t))
      return Array.from(set)
    })
  }

  function toggleExercise(e: ExerciseType) {
    setExerciseTypes((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]))
  }

  function canProceed() {
    // Step order: 1=Symptoms, 2=Diet, 3=Lifestyle, 4=Age/Sex, 5=Goals, 6=Medications
    // All steps require an explicit answer — no silent skips.
    if (step === 1) return symptoms.length > 0 || noSymptoms
    if (step === 2) return dietType !== null
    if (step === 3) return sunExposure !== null && alcoholConsumption !== null && caffeineIntake !== null && stressLevel !== null
    if (step === 4) return age.trim() !== '' && Number(age) > 0 && Number(age) < 120 && sex !== null
    if (step === 5) return goals.length > 0
    if (step === 6) return noMedications || medicationsText.trim().length > 0
    return true
  }

  // Track top-3 recommendation names at each step so IntermediatePreview
  // can show "NEW" badges for supplements that entered the top-3 with
  // the latest answer.
  // Previous-step ranking map (supplement.name → rank). Lets the
  // IntermediatePreview show per-supplement delta badges like "↑5" or NEW.
  const [prevRanking, setPrevRanking] = useState<Record<string, number>>({})
  // Previous answers snapshot — used to explain WHICH input caused a rank change.
  const [prevAnswers, setPrevAnswers] = useState<Record<string, unknown>>({})

  useEffect(() => { trackQuizStart() }, [])

  function handleNext() {
    // stepNames aligned with NEW ordering
    const stepNames = ['symptoms', 'diet', 'lifestyle', 'age_sex', 'goals', 'medications']

    // PREVIEW → next question: we were showing the preview for this step;
    // now advance to the next question (or submit if we just finished the
    // final step's preview).
    if (phase === 'preview') {
      if (step >= TOTAL_STEPS) {
        handleSubmit()
        return
      }
      setStep((s) => s + 1)
      setPhase('question')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // QUESTION → preview: the user just answered this step's question.
    // Track completion and, for steps 1-5, show the interstitial preview.
    trackQuizStepComplete(step, stepNames[step - 1] || 'unknown')

    // Count every user who completes step 1 (symptoms) toward the public
    // quiz-completion counter. One increment per quiz attempt — guarded
    // by sessionStorage so refreshing / going back doesn't double-count.
    if (step === 1 && typeof window !== 'undefined') {
      try {
        if (!sessionStorage.getItem('quiz_counted')) {
          sessionStorage.setItem('quiz_counted', '1')
          import('@/lib/publicStats').then((m) => m.incrementPublicStat('quiz_completions'))
        }
      } catch {
        // ignore storage / network errors
      }
    }

    // Steps 1-5 show a preview interstitial before moving on. Step 6
    // (medications) and any submit path skip straight to submit/next.
    if (step >= 1 && step <= 5) {
      setPhase('preview')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Snapshot the top-3 supplement names from the CURRENT step so the next
    // step's IntermediatePreview can highlight what changed. We build a
    // quick partial profile identical to what the preview will render.
    try {
      const snapshot = buildRecommendations({
        age: age ? Number(age) : undefined as any,
        sex: (sex ?? undefined) as any,
        goals,
        dietType: (dietType ?? 'omnivore') as DietType,
        sunExposure: (sunExposure ?? 'some') as SunExposure,
        exerciseType: exerciseTypes,
        alcoholConsumption: (alcoholConsumption ?? 'none') as AlcoholConsumption,
        caffeineIntake: (caffeineIntake ?? 'none') as CaffeineIntake,
        stressLevel: (stressLevel ?? 'moderate') as StressLevel,
        symptoms,
        medications: medicationsText.split(',').map((m) => m.trim()).filter(Boolean),
      })
      setPrevTopNames(snapshot.slice(0, 3).map((r) => r.supplement.name))
    } catch {
      // best-effort — if the engine can't run on the partial profile, just skip the diff
    }
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      handleSubmit()
    }
  }

  function handleBack() {
    // On a preview, Back returns to the question that generated it.
    if (phase === 'preview') {
      setPhase('question')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    // From question N, Back goes to preview of N-1 (where applicable) so
    // users see their intermediate picks again, or to question N-1 if no
    // preview was shown for that step.
    if (step > 1) {
      setStep((s) => s - 1)
      // If the previous step had a preview, show it; otherwise go straight
      // to its question. Steps 1-5 have previews.
      setPhase(step - 1 >= 1 && step - 1 <= 5 ? 'preview' : 'question')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function handleSubmit() {
    const profile: QuizProfile = {
      age: Number(age),
      sex: sex!,
      goals,
      dietType: dietType!,
      sunExposure: sunExposure!,
      exerciseType: exerciseTypes,
      alcoholConsumption: alcoholConsumption!,
      caffeineIntake: caffeineIntake!,
      stressLevel: stressLevel!,
      symptoms,
      medications: medicationsText
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean),
    }
    sessionStorage.setItem('quizProfile', JSON.stringify(profile))
    trackQuizComplete(goals, dietType!)
    router.push('/results')
  }

  return (
    <div className="min-h-screen bg-bg py-8 sm:py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Step 1: Age & Sex */}
        {phase === 'question' && step === 4 && (
          <div>
            <StepHeader
              step={step}
              total={TOTAL_STEPS}
              title="Tell us about yourself"
              subtitle="We personalise your supplement recommendations to your biology."
            />
            <div className="flex justify-center mb-6">
              <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-border">
                <img
                  src="/images/tell-us-about-yourself.png"
                  alt="Person taking a health quiz on their phone"
                  className="w-full h-auto"
                  loading="eager"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-text font-semibold text-sm mb-3">Your age</h3>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 34"
                  className="w-full sm:w-40 bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-text-tertiary focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                />
              </div>

              <div>
                <h3 className="text-text font-semibold text-sm mb-3">Biological sex</h3>
                <div className="flex flex-col gap-2">
                  {SEX_OPTIONS.map((o) => (
                    <SingleSelectCard
                      key={o.value}
                      selected={sex === o.value}
                      onSelect={() => setSex(o.value)}
                      label={o.label}
                      desc=""
                    />
                  ))}
                </div>
              </div>
            </div>

            {(!age || !sex) && (
              <p className="text-text-tertiary text-xs mt-4">Please enter your age and select your biological sex to continue.</p>
            )}
          </div>
        )}

        {/* Step 2: Goals */}
        {phase === 'question' && step === 5 && (
          <div>
            <StepHeader
              step={step}
              total={TOTAL_STEPS}
              title="What are your health goals?"
              subtitle="Select all that apply. We'll prioritize supplements that match your goals."
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {GOALS.map((g) => (
                <MultiSelectChip
                  key={g.value}
                  selected={goals.includes(g.value)}
                  onToggle={() => toggleGoal(g.value)}
                  emoji={g.emoji}
                  label={g.label}
                />
              ))}
            </div>
            {goals.length === 0 && (
              <p className="text-text-tertiary text-xs mt-4">Select at least one goal to continue.</p>
            )}
          </div>
        )}

        {/* Step 3: Diet */}
        {phase === 'question' && step === 2 && (
          <div>
            <StepHeader
              step={step}
              total={TOTAL_STEPS}
              title="What's your diet type?"
              subtitle="Your diet determines which nutrients you're likely missing. This is the strongest signal in our engine."
            />
            <div className="flex flex-col gap-2.5">
              {DIETS.map((d) => (
                <SingleSelectCard
                  key={d.value}
                  selected={dietType === d.value}
                  onSelect={() => setDietType(d.value)}
                  label={`${d.emoji} ${d.label}`}
                  desc={d.desc}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Lifestyle */}
        {phase === 'question' && step === 3 && (
          <div>
            <StepHeader
              step={step}
              total={TOTAL_STEPS}
              title="Tell us about your lifestyle"
              subtitle="These factors influence which nutrients your body needs more of."
            />

            <div className="space-y-6">
              {/* Sun exposure */}
              <div className="bg-surface/50 border border-border rounded-xl p-4">
                <h3 className="text-text font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="text-lg">☀️</span> Do you get at least 15 minutes of sun most days?
                </h3>
                <div className="flex flex-col gap-2">
                  {SUN_OPTIONS.map((o) => (
                    <SingleSelectCard
                      key={o.value}
                      selected={sunExposure === o.value}
                      onSelect={() => setSunExposure(o.value)}
                      label={o.label}
                      desc={o.desc}
                    />
                  ))}
                </div>
              </div>

              {/* Exercise (multi-select) */}
              <div className="bg-surface/50 border border-border rounded-xl p-4">
                <h3 className="text-text font-semibold text-sm mb-1 flex items-center gap-2">
                  <span className="text-lg">🏋️</span> Exercise type
                </h3>
                <p className="text-text-tertiary text-xs mb-3">Select all that apply, or leave empty if sedentary.</p>
                <div className="flex flex-col gap-2">
                  {EXERCISE_OPTIONS.map((o) => (
                    <MultiSelectChip
                      key={o.value}
                      selected={exerciseTypes.includes(o.value)}
                      onToggle={() => toggleExercise(o.value)}
                      label={`${o.label} — ${o.desc}`}
                    />
                  ))}
                </div>
              </div>

              {/* Alcohol */}
              <div className="bg-surface/50 border border-border rounded-xl p-4">
                <h3 className="text-text font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="text-lg">🍷</span> Do you drink alcohol regularly (3+ drinks per week)?
                </h3>
                <div className="flex flex-col gap-2">
                  {ALCOHOL_OPTIONS.map((o) => (
                    <SingleSelectCard
                      key={o.value}
                      selected={alcoholConsumption === o.value}
                      onSelect={() => setAlcoholConsumption(o.value)}
                      label={o.label}
                      desc={o.desc}
                    />
                  ))}
                </div>
              </div>

              {/* Caffeine */}
              <div className="bg-surface/50 border border-border rounded-xl p-4">
                <h3 className="text-text font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="text-lg">☕</span> Do you drink more than 1.5 cups of coffee daily?
                </h3>
                <div className="flex flex-col gap-2">
                  {CAFFEINE_OPTIONS.map((o) => (
                    <SingleSelectCard
                      key={o.value}
                      selected={caffeineIntake === o.value}
                      onSelect={() => setCaffeineIntake(o.value)}
                      label={o.label}
                      desc={o.desc}
                    />
                  ))}
                </div>
              </div>

              {/* Stress */}
              <div className="bg-surface/50 border border-border rounded-xl p-4">
                <h3 className="text-text font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="text-lg">😰</span> Stress level
                </h3>
                <div className="flex flex-col gap-2">
                  {STRESS_OPTIONS.map((o) => (
                    <SingleSelectCard
                      key={o.value}
                      selected={stressLevel === o.value}
                      onSelect={() => setStressLevel(o.value)}
                      label={o.label}
                      desc={o.desc}
                    />
                  ))}
                </div>
              </div>
            </div>
            {!canProceed() && (
              <p className="text-text-tertiary text-xs mt-4">Please answer all sections above to continue.</p>
            )}
          </div>
        )}

        {/* Step 5: Medications */}
        {phase === 'question' && step === 6 && (
          <div>
            <StepHeader
              step={step}
              total={TOTAL_STEPS}
              title="Do you take any medications?"
              subtitle="We'll check for potential interactions with recommended supplements."
            />
            <textarea
              value={medicationsText}
              onChange={(e) => {
                setMedicationsText(e.target.value)
                if (e.target.value.trim().length > 0 && noMedications) setNoMedications(false)
              }}
              placeholder="e.g. levothyroxine, metformin, warfarin"
              rows={3}
              disabled={noMedications}
              className={`w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-text-tertiary focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal resize-none ${
                noMedications ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            />
            <p className="text-text-tertiary text-xs mt-2">
              Separate multiple medications with commas.
            </p>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => {
                  const next = !noMedications
                  setNoMedications(next)
                  if (next) setMedicationsText('')
                }}
                className={`w-full text-sm font-medium px-4 py-3 rounded-xl border transition-all ${
                  noMedications
                    ? 'bg-teal/10 border-teal text-teal'
                    : 'bg-surface border-border text-text-secondary hover:border-text-tertiary hover:text-text'
                }`}
              >
                {noMedications ? '✓ ' : ''}I don't take any medications
              </button>
            </div>
            <div className="flex items-center gap-2 bg-surface-alt rounded-lg px-3 py-2 mt-3">
              <svg className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-text-tertiary text-xs">
                Medication data is never stored on our servers and stays in your browser session only.
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Symptoms — grouped for scannability */}
        {phase === 'question' && step === 1 && (
          <div>
            <StepHeader
              step={step}
              total={TOTAL_STEPS}
              title="What symptoms can we help with?"
              subtitle="Pick anything that sounds like you — this is our strongest signal."
            />

            <div className="space-y-5">
              {SYMPTOM_GROUPS.map((group) => (
                <div key={group.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">{group.emoji}</span>
                    <h3 className="text-text font-semibold text-sm">{group.title}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {group.items.map((item) => (
                      <MultiSelectChip
                        key={item.key}
                        selected={item.tokens.every((t) => symptoms.includes(t))}
                        onToggle={() => toggleSymptomGroup(item.tokens)}
                        emoji={item.emoji}
                        label={item.label}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Explicit opt-out — replaces the former "skip this step" link.
                Mutually exclusive with any symptom selection. */}
            <div className="mt-6 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  const next = !noSymptoms
                  setNoSymptoms(next)
                  if (next) setSymptoms([])
                }}
                className={`w-full text-sm font-medium px-4 py-3 rounded-xl border transition-all ${
                  noSymptoms
                    ? 'bg-teal/10 border-teal text-teal'
                    : 'bg-surface border-border text-text-secondary hover:border-text-tertiary hover:text-text'
                }`}
              >
                {noSymptoms ? '✓ ' : ''}I'm feeling healthy — no symptoms right now
              </button>
            </div>
          </div>
        )}

        {/* Intermediate preview — a separate interstitial page between
            question steps. Shown ONLY in `preview` phase; the question
            panels above are hidden in this phase (guarded by
            `phase === 'question'`). */}
        {phase === 'preview' && step >= 1 && step <= 5 && (
          <IntermediatePreview
            answers={{
              age: age ? Number(age) : undefined,
              sex,
              goals,
              dietType,
              sunExposure,
              exerciseType: exerciseTypes,
              alcoholConsumption,
              caffeineIntake,
              stressLevel,
              symptoms,
            }}
            previousTopSupplements={prevTopNames}
            stepLabel={
              step === 1 ? 'symptoms'
                : step === 2 ? 'symptoms + diet'
                : step === 3 ? 'lifestyle (plus everything so far)'
                : step === 4 ? 'age & sex (plus everything so far)'
                : 'goals (plus everything so far)'
            }
            showFinalCta={step === 5}
          />
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
          <button
            onClick={handleBack}
            className={`text-sm font-medium px-5 py-2.5 rounded-xl border border-border text-text-secondary hover:text-text hover:border-text-secondary transition-colors ${
              step === 1 && phase === 'question' ? 'invisible' : ''
            }`}
          >
            &larr; Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`text-sm font-semibold px-8 py-2.5 rounded-xl transition-colors ${
              canProceed()
                ? 'bg-teal hover:bg-teal-light text-bg'
                : 'bg-surface border border-border text-text-tertiary cursor-not-allowed'
            }`}
          >
            {phase === 'preview'
              ? (step === 5 ? 'One last step \u2192' : 'Next question \u2192')
              : step === TOTAL_STEPS
                ? 'Get My Results \u2192'
                : step === 5
                  ? 'See My Top Picks \u2192'
                  : 'Continue \u2192'}
          </button>
        </div>

      </div>
    </div>
  )
}
