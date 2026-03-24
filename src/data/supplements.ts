import { WebSupplement } from '@/types'

export const supplements: WebSupplement[] = [
  {
    id: 'vitamin_d3',
    name: 'Vitamin D3',
    description:
      'A fat-soluble vitamin synthesised in the skin upon UV-B exposure. Critical for calcium absorption, immune regulation, mood, and over 200 gene-expression pathways. Most people in northern latitudes are deficient.',
    evidenceGrade: 'A',
    goalsSupported: ['longevity', 'immunity', 'mood', 'energy'],
    deficiencySymptoms: ['fatigue', 'frequent_illness', 'low_mood', 'muscle_weakness', 'joint_pain'],
    safeUpperLimit: '4,000 IU/day for adults (NIH); up to 10,000 IU/day under medical supervision',
    drugInteractions: [
      {
        drug: 'thiazide diuretics',
        severity: 'moderate',
        description: 'May increase risk of hypercalcemia when combined with high-dose Vitamin D.',
      },
      {
        drug: 'corticosteroids',
        severity: 'moderate',
        description: 'Long-term corticosteroid use impairs Vitamin D metabolism.',
      },
    ],
    pubmedCitation: 'PMID: 33278150',
    nihUrl: 'https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/',
  },
  {
    id: 'magnesium_glycinate',
    name: 'Magnesium',
    description:
      'An essential mineral involved in over 300 enzymatic reactions including ATP production, DNA synthesis, muscle contraction, and nerve transmission. Magnesium glycinate is the best-tolerated form for most people.',
    evidenceGrade: 'A',
    goalsSupported: ['sleep', 'focus', 'longevity', 'energy', 'mood'],
    deficiencySymptoms: ['poor_sleep', 'muscle_weakness', 'anxiety', 'fatigue', 'poor_memory'],
    safeUpperLimit: '350 mg/day supplemental (NIH UL); higher doses under supervision can cause diarrhea',
    drugInteractions: [
      {
        drug: 'antibiotics (fluoroquinolones)',
        severity: 'moderate',
        description: 'Magnesium can chelate certain antibiotics, reducing their absorption. Take 2+ hours apart.',
      },
    ],
    pubmedCitation: 'PMID: 28264064',
    nihUrl: 'https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/',
  },
  {
    id: 'omega3',
    name: 'Omega-3 (Fish Oil / Algae)',
    description:
      'Long-chain polyunsaturated fatty acids EPA and DHA essential for brain structure, cardiovascular health, and anti-inflammatory signalling. Vegans should choose algae-derived DHA/EPA.',
    evidenceGrade: 'A',
    goalsSupported: ['longevity', 'focus', 'mood', 'energy'],
    deficiencySymptoms: ['low_mood', 'poor_memory', 'brain_fog', 'dry_skin', 'joint_pain'],
    safeUpperLimit: '3,000 mg EPA+DHA/day from supplements (FDA GRAS)',
    drugInteractions: [
      {
        drug: 'warfarin',
        severity: 'high',
        description:
          'High-dose omega-3 (>3 g/day) may potentiate anticoagulant effects; monitor INR closely.',
      },
    ],
    pubmedCitation: 'PMID: 30674433',
    nihUrl: 'https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/',
  },
  {
    id: 'zinc',
    name: 'Zinc',
    description:
      'A trace mineral required for immune function, protein synthesis, wound healing, and DNA synthesis. Deficiency is common in vegetarians and vegans due to phytate inhibition.',
    evidenceGrade: 'A',
    goalsSupported: ['immunity', 'muscle', 'energy'],
    deficiencySymptoms: ['frequent_illness', 'hair_loss', 'poor_memory'],
    safeUpperLimit: '40 mg/day for adults',
    drugInteractions: [
      {
        drug: 'antibiotics (quinolones/tetracyclines)',
        severity: 'moderate',
        description: 'Zinc can reduce antibiotic absorption. Take 2 hours apart.',
      },
    ],
    pubmedCitation: 'PMID: 29699272',
    nihUrl: 'https://ods.od.nih.gov/factsheets/Zinc-HealthProfessional/',
  },
  {
    id: 'b12_methylcobalamin',
    name: 'Vitamin B12',
    description:
      'A water-soluble vitamin essential for red blood cell formation, neurological function, and DNA synthesis. Methylcobalamin is the bioactive form. Deficiency is nearly universal in long-term vegans.',
    evidenceGrade: 'A',
    goalsSupported: ['energy', 'focus', 'mood', 'longevity'],
    deficiencySymptoms: ['fatigue', 'brain_fog', 'poor_memory', 'low_mood'],
    safeUpperLimit: 'No established UL; water-soluble and generally safe at high doses',
    drugInteractions: [
      {
        drug: 'metformin',
        severity: 'moderate',
        description: 'Long-term metformin use reduces B12 absorption; regular monitoring recommended.',
      },
      {
        drug: 'proton pump inhibitors',
        severity: 'moderate',
        description: 'Stomach acid is needed for B12 absorption; PPI users should supplement.',
      },
    ],
    pubmedCitation: 'PMID: 33805492',
    nihUrl: 'https://ods.od.nih.gov/factsheets/VitaminB12-HealthProfessional/',
  },
  {
    id: 'methylfolate',
    name: 'Methylfolate (5-MTHF)',
    description:
      'The bioactive form of folate that bypasses MTHFR enzyme impairment. Critical for methylation, neurotransmitter synthesis, and homocysteine regulation.',
    evidenceGrade: 'B',
    goalsSupported: ['mood', 'focus', 'longevity', 'energy'],
    deficiencySymptoms: ['low_mood', 'fatigue', 'brain_fog', 'poor_memory', 'anxiety'],
    safeUpperLimit: '1,000 mcg/day of folic acid form (NIH UL); methylfolate UL not established',
    drugInteractions: [
      {
        drug: 'methotrexate',
        severity: 'high',
        description:
          'Folate supplementation can reduce methotrexate efficacy in cancer treatment; discuss with oncologist.',
      },
    ],
    pubmedCitation: 'PMID: 27951521',
    nihUrl: 'https://ods.od.nih.gov/factsheets/Folate-HealthProfessional/',
  },
  {
    id: 'vitamin_c',
    name: 'Vitamin C',
    description:
      'A potent water-soluble antioxidant essential for collagen synthesis, immune function, iron absorption, and neurotransmitter production.',
    evidenceGrade: 'A',
    goalsSupported: ['immunity', 'energy', 'longevity'],
    deficiencySymptoms: ['frequent_illness', 'fatigue', 'joint_pain', 'dry_skin'],
    safeUpperLimit: '2,000 mg/day for adults',
    drugInteractions: [
      {
        drug: 'warfarin',
        severity: 'moderate',
        description: 'Very high doses (>1 g) may reduce warfarin efficacy in some patients.',
      },
    ],
    pubmedCitation: 'PMID: 29099763',
    nihUrl: 'https://ods.od.nih.gov/factsheets/VitaminC-HealthProfessional/',
  },
  {
    id: 'coq10',
    name: 'CoQ10 (Ubiquinol)',
    description:
      'A fat-soluble antioxidant and essential cofactor in mitochondrial ATP synthesis. Levels decline with age and are depleted by statin medications.',
    evidenceGrade: 'B',
    goalsSupported: ['energy', 'longevity', 'focus'],
    deficiencySymptoms: ['fatigue', 'muscle_weakness', 'brain_fog'],
    safeUpperLimit: '1,200 mg/day has been used safely in clinical trials',
    drugInteractions: [
      {
        drug: 'statins',
        severity: 'moderate',
        description: 'Statins deplete CoQ10; supplementation can help address statin-associated myopathy.',
      },
      {
        drug: 'warfarin',
        severity: 'moderate',
        description: 'CoQ10 may slightly reduce warfarin effectiveness; monitor INR.',
      },
    ],
    pubmedCitation: 'PMID: 26432661',
    nihUrl: 'https://www.nccih.nih.gov/health/coenzyme-q10',
  },
  {
    id: 'ashwagandha',
    name: 'Ashwagandha (KSM-66)',
    description:
      'An adaptogenic root with strong clinical evidence for reducing cortisol, improving stress resilience, boosting testosterone, and enhancing sleep quality. KSM-66 is the most clinically studied extract.',
    evidenceGrade: 'B',
    goalsSupported: ['sleep', 'mood', 'energy', 'muscle'],
    deficiencySymptoms: ['anxiety', 'poor_sleep', 'fatigue'],
    safeUpperLimit: '600–1,200 mg/day KSM-66 extract; typical cycle 8–12 weeks on, 4 weeks off',
    drugInteractions: [
      {
        drug: 'thyroid medications',
        severity: 'moderate',
        description: 'Ashwagandha can raise thyroid hormone levels; may require dose adjustment.',
      },
      {
        drug: 'sedatives/benzodiazepines',
        severity: 'moderate',
        description: 'Additive CNS depressant effects; use with caution.',
      },
    ],
    pubmedCitation: 'PMID: 31975514',
    nihUrl: 'https://www.nccih.nih.gov/health/ashwagandha',
  },
  {
    id: 'creatine',
    name: 'Creatine Monohydrate',
    description:
      'The most evidence-backed ergogenic supplement. Replenishes ATP in fast-twitch muscle fibres, increasing strength and power output. Also has cognitive benefits and is neuroprotective.',
    evidenceGrade: 'A',
    goalsSupported: ['muscle', 'focus', 'energy'],
    deficiencySymptoms: ['muscle_weakness', 'fatigue', 'poor_memory'],
    safeUpperLimit: '3–5 g/day maintenance; loading phase 20 g/day for 5 days is considered safe',
    drugInteractions: [
      {
        drug: 'NSAIDs',
        severity: 'low',
        description:
          'Theoretically may stress kidneys when combined in high doses; stay well hydrated.',
      },
    ],
    pubmedCitation: 'PMID: 28615996',
    nihUrl: 'https://www.nccih.nih.gov/health/creatine',
  },
  {
    id: 'melatonin',
    name: 'Melatonin',
    description:
      'A pineal hormone that regulates the sleep-wake cycle. Highly effective for jet lag, shift work, and sleep-onset difficulties. Lower doses (0.3–1 mg) are often more physiological than standard 5–10 mg.',
    evidenceGrade: 'A',
    goalsSupported: ['sleep'],
    deficiencySymptoms: ['poor_sleep'],
    safeUpperLimit: '10 mg/day short-term; long-term safety above 5 mg not well established',
    drugInteractions: [
      {
        drug: 'CNS depressants',
        severity: 'moderate',
        description: 'Additive sedative effects.',
      },
    ],
    pubmedCitation: 'PMID: 28411635',
    nihUrl: 'https://www.nccih.nih.gov/health/melatonin-what-you-need-to-know',
  },
  {
    id: 'nac',
    name: 'NAC (N-Acetyl Cysteine)',
    description:
      "A precursor to glutathione — the body's master antioxidant. NAC replenishes glutathione, supports liver detoxification, has mucolytic effects, and shows promise for OCD, addiction, and respiratory conditions.",
    evidenceGrade: 'B',
    goalsSupported: ['longevity', 'immunity', 'focus', 'mood'],
    deficiencySymptoms: ['frequent_illness', 'fatigue', 'brain_fog', 'anxiety'],
    safeUpperLimit: '1,800 mg/day in most clinical studies; used up to 8 g/day in clinical settings',
    drugInteractions: [
      {
        drug: 'nitroglycerin',
        severity: 'high',
        description: 'Combination can cause severe headache and hypotension.',
      },
    ],
    pubmedCitation: 'PMID: 25549859',
    nihUrl: 'https://www.nccih.nih.gov/health/n-acetyl-cysteine',
  },
  {
    id: 'probiotics',
    name: 'Probiotics',
    description:
      'Live microorganisms that modulate the gut microbiome. Multi-strain formulas with Lactobacillus and Bifidobacterium species are most evidence-backed for immunity, digestion, and mood via the gut-brain axis.',
    evidenceGrade: 'B',
    goalsSupported: ['immunity', 'mood', 'longevity'],
    deficiencySymptoms: ['digestive_issues', 'frequent_illness', 'low_mood', 'anxiety'],
    safeUpperLimit: 'Generally safe; 10–100 billion CFU commonly used',
    drugInteractions: [
      {
        drug: 'antibiotics',
        severity: 'low',
        description:
          'Antibiotics kill probiotic bacteria; take 2+ hours apart and continue after antibiotic course.',
      },
    ],
    pubmedCitation: 'PMID: 29581563',
    nihUrl: 'https://www.nccih.nih.gov/health/probiotics-what-you-need-to-know',
  },
  {
    id: 'collagen',
    name: 'Collagen Peptides',
    description:
      'Hydrolysed collagen provides amino acids (glycine, proline, hydroxyproline) that support skin elasticity, joint cartilage repair, and connective tissue integrity. Best taken with Vitamin C.',
    evidenceGrade: 'B',
    goalsSupported: ['longevity', 'muscle'],
    deficiencySymptoms: ['joint_pain', 'dry_skin', 'hair_loss'],
    safeUpperLimit: '10–20 g/day appears safe; higher doses not well studied',
    drugInteractions: [],
    pubmedCitation: 'PMID: 30681787',
    nihUrl: 'https://www.nccih.nih.gov/health/collagen',
  },
  {
    id: 'iron',
    name: 'Iron',
    description:
      'A mineral central to haemoglobin oxygen transport and cellular energy production. Iron-deficiency anaemia is one of the most common nutritional deficiencies worldwide, particularly in premenopausal women and vegetarians.',
    evidenceGrade: 'A',
    goalsSupported: ['energy', 'focus'],
    deficiencySymptoms: ['fatigue', 'brain_fog', 'hair_loss', 'muscle_weakness'],
    safeUpperLimit: '45 mg/day for adults (NIH UL); only supplement with lab confirmation',
    drugInteractions: [
      {
        drug: 'levothyroxine',
        severity: 'high',
        description:
          'Iron significantly reduces thyroid hormone absorption. Take at least 4 hours apart.',
      },
    ],
    pubmedCitation: 'PMID: 31671808',
    nihUrl: 'https://ods.od.nih.gov/factsheets/Iron-HealthProfessional/',
  },
]
