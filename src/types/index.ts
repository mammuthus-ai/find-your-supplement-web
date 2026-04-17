export type Sex = 'male' | 'female' | 'other' | 'prefer_not_to_say'

export type Goal =
  | 'energy'
  | 'sleep'
  | 'muscle'
  | 'focus'
  | 'longevity'
  | 'immunity'
  | 'mood'
  | 'weight_loss'

export type DietType =
  | 'omnivore'
  | 'vegetarian'
  | 'vegan'
  | 'keto'
  | 'paleo'
  | 'pescatarian'
  | 'mediterranean'
  | 'carnivore'
  | 'other'

export type Symptom =
  | 'fatigue'
  | 'poor_sleep'
  | 'brain_fog'
  | 'joint_pain'
  | 'frequent_illness'
  | 'anxiety'
  | 'hair_loss'
  | 'digestive_issues'
  | 'low_mood'
  | 'muscle_weakness'
  | 'poor_memory'
  | 'dry_skin'
  | 'acid_reflux'
  | 'constipation'
  | 'ibs'
  | 'bloating'
  | 'nausea'
  | 'apo_b_elevated'
  | 'ldl_elevated'
  | 'hdl_low'
  | 'triglycerides_high'

export type SunExposure = 'very_little' | 'some' | 'a_lot'
export type ExerciseType = 'none' | 'cardio' | 'weight_training'
export type AlcoholConsumption = 'none' | 'light' | 'moderate' | 'heavy'
export type CaffeineIntake = 'none' | 'light' | 'moderate' | 'heavy'
export type StressLevel = 'low' | 'moderate' | 'high' | 'very_high'
export type EvidenceGrade = 'A' | 'B' | 'C' | 'D'
export type Priority = 'high' | 'medium' | 'low'

export interface QuizProfile {
  age?: number
  sex?: Sex
  goals: Goal[]
  dietType: DietType
  sunExposure: SunExposure
  exerciseType: ExerciseType[]
  alcoholConsumption: AlcoholConsumption
  caffeineIntake: CaffeineIntake
  stressLevel: StressLevel
  symptoms: Symptom[]
  medications: string[]
}

export interface DrugInteraction {
  drug: string
  severity: 'high' | 'moderate' | 'low'
  description: string
}

export interface WebSupplement {
  id: string
  name: string
  description: string
  evidenceGrade: EvidenceGrade
  goalsSupported: Goal[]
  deficiencySymptoms: Symptom[]
  safeUpperLimit: string
  drugInteractions: DrugInteraction[]
  pubmedCitation: string
  nihUrl: string
  recommendedForms?: string[]
  forms?: SupplementForm[]
  typicalDose?: string
}

export interface SupplementForm {
  name: string
  bestFor: string[]
  bioavailability: 'high' | 'medium' | 'low'
  amazonSearch: string
  warning?: string | null
  priority: number
}

export interface RecommendationReason {
  type: 'goal' | 'symptom' | 'diet' | 'lifestyle'
  label: string
  detail: string
}

export interface SupplementRecommendation {
  supplement: WebSupplement
  score: number
  rank: number
  priority: Priority
  reasons: RecommendationReason[]
  evidenceGrade: EvidenceGrade
  warnings: string[]
}

// ─── Evidence Cache Types (from free APIs) ──────────────────────────────────

export interface TrialData {
  completed: number
  positive: number
  phase3Plus: number
}

export interface SafetyData {
  safeUpperLimit: string
  adverseEventCount: number
  interactionWarnings: string[]
}

export interface EvidenceEntry {
  supplement: string
  condition: string
  pubmedCount: number
  rctCount: number
  metaAnalysisCount: number
  citationScore: number
  trialData: TrialData
  safety: SafetyData
  productCount: number
  lastUpdated: string
}

export interface EvidenceCache {
  version: string
  generatedAt: string
  entries: Record<string, EvidenceEntry[]>
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  readTime: string
  content: string
}
