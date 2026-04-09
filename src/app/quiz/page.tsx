'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { trackQuizStart, trackQuizStepComplete, trackQuizComplete } from '@/lib/analytics'
import type {
  Goal,
  DietType,
  Symptom,
  SunExposure,
  ExerciseType,
  AlcoholConsumption,
  CaffeineIntake,
  StressLevel,
  QuizProfile,
} from '@/types'

// ─── Step data ────────────────────────────────────────────────────────────────

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

const DIETS: { value: DietType; label: string; desc: string }[] = [
  { value: 'omnivore', label: 'Omnivore', desc: 'Eat everything' },
  { value: 'vegetarian', label: 'Vegetarian', desc: 'No meat, yes dairy/eggs' },
  { value: 'vegan', label: 'Vegan', desc: 'No animal products' },
  { value: 'keto', label: 'Keto', desc: 'High fat, low carb' },
  { value: 'paleo', label: 'Paleo', desc: 'Whole foods, no grains' },
  { value: 'pescatarian', label: 'Pescatarian', desc: 'Fish but no meat' },
  { value: 'mediterranean', label: 'Mediterranean', desc: 'Olive oil, fish, veg' },
  { value: 'carnivore', label: 'Carnivore', desc: 'Mostly animal foods' },
  { value: 'other', label: 'Other', desc: "Doesn't fit a category" },
]

const SYMPTOMS: { value: Symptom; label: string }[] = [
  { value: 'fatigue', label: 'Fatigue / Low Energy' },
  { value: 'poor_sleep', label: 'Poor Sleep' },
  { value: 'brain_fog', label: 'Brain Fog' },
  { value: 'joint_pain', label: 'Joint Pain' },
  { value: 'frequent_illness', label: 'Get Sick Often' },
  { value: 'anxiety', label: 'Anxiety / Worry' },
  { value: 'hair_loss', label: 'Hair Loss / Thinning' },
  { value: 'digestive_issues', label: 'Digestive Issues' },
  { value: 'low_mood', label: 'Low Mood / Depression' },
  { value: 'muscle_weakness', label: 'Muscle Weakness' },
  { value: 'poor_memory', label: 'Poor Memory' },
  { value: 'dry_skin', label: 'Dry Skin' },
  { value: 'acid_reflux', label: 'Acid Reflux / GERD' },
]

const SUN_OPTIONS: { value: SunExposure; label: string; desc: string }[] = [
  { value: 'very_little', label: 'Very little', desc: 'Mostly indoors, always use SPF' },
  { value: 'some', label: 'Some', desc: '15–30 min outdoors most days' },
  { value: 'a_lot', label: 'A lot', desc: 'Outdoors most of the day' },
]

const EXERCISE_OPTIONS: { value: ExerciseType; label: string; desc: string }[] = [
  { value: 'none', label: 'None / Very little', desc: 'Mostly sedentary' },
  { value: 'cardio', label: 'Cardio', desc: 'Running, cycling, swimming' },
  { value: 'weight_training', label: 'Weight training', desc: 'Lifting, resistance' },
  { value: 'both', label: 'Both', desc: 'Cardio + weights' },
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

const TOTAL_STEPS = 4

export default function QuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  const [goals, setGoals] = useState<Goal[]>([])
  const [dietType, setDietType] = useState<DietType | null>(null)
  const [sunExposure, setSunExposure] = useState<SunExposure>('some')
  const [exerciseType, setExerciseType] = useState<ExerciseType>('none')
  const [alcoholConsumption, setAlcoholConsumption] = useState<AlcoholConsumption>('none')
  const [caffeineIntake, setCaffeineIntake] = useState<CaffeineIntake>('none')
  const [stressLevel, setStressLevel] = useState<StressLevel>('moderate')
  const [symptoms, setSymptoms] = useState<Symptom[]>([])

  function toggleGoal(g: Goal) {
    setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]))
  }

  function toggleSymptom(s: Symptom) {
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }

  function canProceed() {
    if (step === 1) return goals.length > 0
    if (step === 2) return dietType !== null
    return true
  }

  useEffect(() => { trackQuizStart() }, [])

  function handleNext() {
    const stepNames = ['goals', 'diet', 'lifestyle', 'symptoms']
    trackQuizStepComplete(step, stepNames[step - 1] || 'unknown')
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      handleSubmit()
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep((s) => s - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function handleSubmit() {
    const profile: QuizProfile = {
      goals,
      dietType: dietType!,
      sunExposure,
      exerciseType,
      alcoholConsumption,
      caffeineIntake,
      stressLevel,
      symptoms,
    }
    sessionStorage.setItem('quizProfile', JSON.stringify(profile))
    trackQuizComplete(goals, dietType!)
    router.push('/results')
  }

  return (
    <div className="min-h-screen bg-bg py-8 sm:py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Step 1: Goals */}
        {step === 1 && (
          <div>
            <StepHeader
              step={1}
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

        {/* Step 2: Diet */}
        {step === 2 && (
          <div>
            <StepHeader
              step={2}
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
                  label={d.label}
                  desc={d.desc}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Lifestyle */}
        {step === 3 && (
          <div>
            <StepHeader
              step={3}
              total={TOTAL_STEPS}
              title="Tell us about your lifestyle"
              subtitle="These factors influence which nutrients your body needs more of."
            />

            <div className="space-y-7">
              {/* Sun exposure */}
              <div>
                <h3 className="text-text font-semibold text-sm mb-3">
                  ☀️ Sun exposure
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

              {/* Exercise */}
              <div>
                <h3 className="text-text font-semibold text-sm mb-3">
                  🏋️ Exercise type
                </h3>
                <div className="flex flex-col gap-2">
                  {EXERCISE_OPTIONS.map((o) => (
                    <SingleSelectCard
                      key={o.value}
                      selected={exerciseType === o.value}
                      onSelect={() => setExerciseType(o.value)}
                      label={o.label}
                      desc={o.desc}
                    />
                  ))}
                </div>
              </div>

              {/* Alcohol */}
              <div>
                <h3 className="text-text font-semibold text-sm mb-3">
                  🍷 Alcohol consumption
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
              <div>
                <h3 className="text-text font-semibold text-sm mb-3">
                  ☕ Caffeine intake
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
              <div>
                <h3 className="text-text font-semibold text-sm mb-3">
                  🧘 Stress level
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
          </div>
        )}

        {/* Step 4: Symptoms */}
        {step === 4 && (
          <div>
            <StepHeader
              step={4}
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
                  label={s.label}
                />
              ))}
            </div>
            <p className="text-text-tertiary text-xs mt-4">
              You can skip this step — symptom data is optional.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
          <button
            onClick={handleBack}
            className={`text-sm font-medium px-5 py-2.5 rounded-xl border border-border text-text-secondary hover:text-text hover:border-text-secondary transition-colors ${
              step === 1 ? 'invisible' : ''
            }`}
          >
            ← Back
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
            {step === TOTAL_STEPS ? 'Get My Results →' : 'Continue →'}
          </button>
        </div>

        {/* Skip for symptoms step */}
        {step === 4 && (
          <div className="text-center mt-3">
            <button
              onClick={handleSubmit}
              className="text-text-tertiary hover:text-text-secondary text-xs underline transition-colors"
            >
              Skip symptoms and see results
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
