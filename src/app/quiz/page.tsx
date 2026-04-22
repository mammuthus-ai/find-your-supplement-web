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

const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Non-binary / Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
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

const DIETS: { value: DietType; label: string; desc: string; emoji: string }[] = [
  { value: 'omnivore', label: 'Omnivore', desc: 'Eat everything', emoji: '🍽️' },
  { value: 'vegetarian', label: 'Vegetarian', desc: 'No meat, yes dairy/eggs', emoji: '🥬' },
  { value: 'vegan', label: 'Vegan', desc: 'No animal products', emoji: '🌱' },
  { value: 'keto', label: 'Keto', desc: 'High fat, low carb', emoji: '🥑' },
  { value: 'paleo', label: 'Paleo', desc: 'Whole foods, no grains', emoji: '🥩' },
  { value: 'pescatarian', label: 'Pescatarian', desc: 'Fish but no meat', emoji: '🐟' },
  { value: 'mediterranean', label: 'Mediterranean', desc: 'Olive oil, fish, veg', emoji: '🫒' },
  { value: 'carnivore', label: 'Carnivore', desc: 'Mostly animal foods', emoji: '🥓' },
  { value: 'other', label: 'Other', desc: "Doesn't fit a category", emoji: '🍴' },
]

const SYMPTOMS: { value: Symptom; label: string; emoji: string }[] = [
  { value: 'fatigue', label: 'Fatigue / Low Energy', emoji: '😴' },
  { value: 'poor_sleep', label: 'Poor Sleep', emoji: '🌙' },
  { value: 'brain_fog', label: 'Brain Fog', emoji: '🌫️' },
  { value: 'joint_pain', label: 'Joint Pain', emoji: '🦴' },
  { value: 'frequent_illness', label: 'Get Sick Often', emoji: '🤧' },
  { value: 'anxiety', label: 'Anxiety / Worry', emoji: '😰' },
  { value: 'hair_loss', label: 'Hair Loss / Thinning', emoji: '💇' },
  { value: 'digestive_issues', label: 'Digestive Issues', emoji: '🫁' },
  { value: 'low_mood', label: 'Low Mood / Depression', emoji: '😔' },
  { value: 'muscle_weakness', label: 'Muscle Weakness', emoji: '💪' },
  { value: 'poor_memory', label: 'Poor Memory', emoji: '🧠' },
  { value: 'dry_skin', label: 'Dry Skin', emoji: '🏜️' },
  { value: 'acid_reflux', label: 'Acid Reflux / GERD', emoji: '🔥' },
  { value: 'constipation', label: 'Constipation', emoji: '🚽' },
  { value: 'ibs', label: 'IBS', emoji: '🌊' },
  { value: 'bloating', label: 'Bloating', emoji: '🎈' },
  { value: 'nausea', label: 'Nausea', emoji: '🤢' },
  { value: 'apo_b_elevated',     label: 'Elevated ApoB',        emoji: '🫀' },
  { value: 'ldl_elevated',       label: 'High LDL Cholesterol', emoji: '🫀' },
  { value: 'hdl_low',            label: 'Low HDL Cholesterol',  emoji: '🫀' },
  { value: 'triglycerides_high', label: 'High Triglycerides',   emoji: '🫀' },
]

const SUN_OPTIONS: { value: SunExposure; label: string; desc: string }[] = [
  { value: 'very_little', label: 'Very little', desc: 'Mostly indoors, always use SPF' },
  { value: 'some', label: 'Some', desc: '15–30 min outdoors most days' },
  { value: 'a_lot', label: 'A lot', desc: 'Outdoors most of the day' },
]

const EXERCISE_OPTIONS: { value: ExerciseType; label: string; desc: string }[] = [
  { value: 'cardio', label: 'Cardio', desc: 'Running, cycling, swimming' },
  { value: 'weight_training', label: 'Weight training', desc: 'Lifting, resistance' },
]

const ALCOHOL_OPTIONS: { value: AlcoholConsumption; label: string; desc: string }[] = [
  { value: 'none', label: 'None', desc: "I don't drink" },
  { value: 'light', label: 'Light', desc: '1–2 drinks/week' },
  { value: 'moderate', label: 'Moderate', desc: '3–7 drinks/week' },
  { value: 'heavy', label: 'Heavy', desc: '8+ drinks/week' },
]

const CAFFEINE_OPTIONS: { value: CaffeineIntake; label: string; desc: string }[] = [
  { value: 'none', label: 'None', desc: 'No coffee or tea' },
  { value: 'light', label: 'Light', desc: '1 coffee/day or green tea' },
  { value: 'moderate', label: 'Moderate', desc: '2–3 coffees/day' },
  { value: 'heavy', label: 'Heavy', desc: '4+ coffees/day' },
]

const STRESS_OPTIONS: { value: StressLevel; label: string; desc: string }[] = [
  { value: 'low', label: 'Low', desc: 'Generally relaxed' },
  { value: 'moderate', label: 'Moderate', desc: 'Normal life stress' },
  { value: 'high', label: 'High', desc: 'Frequently stressed' },
  { value: 'very_high', label: 'Very high', desc: 'Chronically overwhelmed' },
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

  // Step 6: Symptoms
  const [symptoms, setSymptoms] = useState<Symptom[]>([])

  function toggleGoal(g: Goal) {
    setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]))
  }

  function toggleSymptom(s: Symptom) {
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }

  function toggleExercise(e: ExerciseType) {
    setExerciseTypes((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]))
  }

  function canProceed() {
    // NEW step order: 1=Symptoms (optional), 2=Diet, 3=Lifestyle, 4=Age/Sex, 5=Goals, 6=Medications (optional)
    if (step === 1) return true
    if (step === 2) return dietType !== null
    if (step === 3) return sunExposure !== null && alcoholConsumption !== null && caffeineIntake !== null && stressLevel !== null
    if (step === 4) return age.trim() !== '' && Number(age) > 0 && Number(age) < 120 && sex !== null
    if (step === 5) return goals.length > 0
    return true // step 6 (medications) is optional
  }

  // Track top-3 recommendation names at each step so IntermediatePreview
  // can show "NEW" badges for supplements that entered the top-3 with
  // the latest answer.
  const [prevTopNames, setPrevTopNames] = useState<string[]>([])

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
                  <span className="text-lg">☀️</span> Sun exposure
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
                  <span className="text-lg">🍷</span> Alcohol consumption
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
                  <span className="text-lg">☕</span> Caffeine intake
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
              onChange={(e) => setMedicationsText(e.target.value)}
              placeholder="e.g. levothyroxine, metformin, warfarin"
              rows={3}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-text-tertiary focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal resize-none"
            />
            <p className="text-text-tertiary text-xs mt-2">
              Enter medication names separated by commas, or leave blank if none.
            </p>
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

        {/* Step 6: Symptoms */}
        {phase === 'question' && step === 1 && (
          <div>
            <StepHeader
              step={step}
              total={TOTAL_STEPS}
              title="Any symptoms you'd like to address?"
              subtitle="Select all that apply. Symptoms help identify likely deficiencies. Skip if none apply."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SYMPTOMS.map((s) => (
                <MultiSelectChip
                  key={s.value}
                  selected={symptoms.includes(s.value)}
                  onToggle={() => toggleSymptom(s.value)}
                  emoji={s.emoji}
                  label={s.label}
                />
              ))}
            </div>
            <p className="text-text-tertiary text-xs mt-4">
              You can skip this step — symptom data is optional.
            </p>
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
              step === 1 ? 'invisible' : ''
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

        {/* Skip option for optional steps */}
        {(step === 6 || step === 1) && (
          <div className="text-center mt-3">
            <button
              onClick={step === TOTAL_STEPS ? handleSubmit : handleNext}
              className="text-text-tertiary hover:text-text-secondary text-xs underline transition-colors"
            >
              {step === 6 ? 'Skip — I don\u0027t take any medications' : 'Skip symptoms and see results'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
