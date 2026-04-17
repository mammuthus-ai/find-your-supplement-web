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
    recommendedForms: ['D3 cholecalciferol (preferred), D2 ergocalciferol (vegan)'],
    typicalDose: '2,000-4,000 IU/day with a fat-containing meal',
  },
  {
    id: 'magnesium_glycinate',
    name: 'Magnesium',
    description:
      'An essential mineral involved in over 300 enzymatic reactions including ATP production, DNA synthesis, muscle contraction, and nerve transmission. Magnesium glycinate is the best-tolerated form for most people.',
    evidenceGrade: 'A',
    goalsSupported: ['sleep', 'focus', 'longevity', 'energy', 'mood'],
    deficiencySymptoms: ['poor_sleep', 'muscle_weakness', 'anxiety', 'fatigue', 'poor_memory', 'acid_reflux'],
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
    recommendedForms: ['Glycinate (best absorbed, gentle), Threonate (brain health), Malate (energy), Citrate (constipation). Avoid Oxide (poor absorption).'],
    typicalDose: '200-400 mg elemental magnesium/day, ideally before bed',
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
    recommendedForms: ['Fish oil (EPA+DHA), Algae oil (vegan DHA+EPA), Krill oil (phospholipid form)'],
    typicalDose: '1,000-2,000 mg combined EPA+DHA/day with food',
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
    recommendedForms: ['Picolinate or Bisglycinate (best absorbed), Gluconate, Citrate. Zinc-Carnosine for gut/reflux.'],
    typicalDose: '15-30 mg/day with food; take with copper if >25 mg/day',
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
    recommendedForms: ['Methylcobalamin (active form, preferred), Adenosylcobalamin, Cyanocobalamin (synthetic)'],
    typicalDose: '500-1,000 mcg/day sublingual or oral',
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
    recommendedForms: ['5-MTHF / Methylfolate (active form, bypasses MTHFR). Avoid folic acid if MTHFR variant.'],
    typicalDose: '400-800 mcg/day',
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
    recommendedForms: ['Ascorbic acid (standard), Buffered/Calcium ascorbate (gentle on stomach), Liposomal (higher absorption)'],
    typicalDose: '500-1,000 mg/day in divided doses',
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
    recommendedForms: ['Ubiquinol (reduced, better absorbed), Ubiquinone (standard, cheaper)'],
    typicalDose: '100-200 mg/day with a fat-containing meal',
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
    recommendedForms: ['KSM-66 root extract (most studied), Sensoril (root+leaf, better for sleep)'],
    typicalDose: '300-600 mg/day KSM-66; cycle 8 weeks on, 4 weeks off',
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
    recommendedForms: ['Monohydrate (gold standard, most studied). Skip HCL, ethyl ester — no advantage.'],
    typicalDose: '3-5 g/day maintenance; no loading needed',
  },
  {
    id: 'melatonin',
    name: 'Melatonin',
    description:
      'A pineal hormone that regulates the sleep-wake cycle. Highly effective for jet lag, shift work, and sleep-onset difficulties. Lower doses (0.3–1 mg) are often more physiological than standard 5–10 mg.',
    evidenceGrade: 'A',
    goalsSupported: ['sleep'],
    deficiencySymptoms: ['poor_sleep', 'acid_reflux'],
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
    recommendedForms: ['Immediate-release (sleep onset), Extended-release (staying asleep). Start low.'],
    typicalDose: '0.3-1 mg 30-60 min before bed; lower doses often more effective',
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
    recommendedForms: ['N-Acetyl Cysteine capsules or powder'],
    typicalDose: '600-1,200 mg/day on empty stomach',
  },
  {
    id: 'probiotics',
    name: 'Probiotics',
    description:
      'Live microorganisms that modulate the gut microbiome. Multi-strain formulas with Lactobacillus and Bifidobacterium species are most evidence-backed for immunity, digestion, and mood via the gut-brain axis.',
    evidenceGrade: 'B',
    goalsSupported: ['immunity', 'mood', 'longevity'],
    deficiencySymptoms: ['digestive_issues', 'frequent_illness', 'low_mood', 'anxiety', 'acid_reflux'],
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
    recommendedForms: ['Multi-strain Lactobacillus + Bifidobacterium (most studied), Saccharomyces boulardii (travel/antibiotics)'],
    typicalDose: '10-50 billion CFU/day; refrigerated strains preferred',
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
    recommendedForms: ['Hydrolyzed bovine peptides (Types I & III), Marine collagen (skin-focused). Take with Vitamin C.'],
    typicalDose: '10-15 g/day; best on empty stomach',
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
    recommendedForms: ['Ferrous bisglycinate (gentle, well-absorbed), Heme iron polypeptide. Avoid ferrous sulfate (GI upset).'],
    typicalDose: '18-27 mg/day for women; only supplement if lab-confirmed deficiency',
  },
  {
    id: 'calcium',
    name: 'Calcium',
    description:
      'The most abundant mineral in the body, essential for bone density, muscle contraction, nerve signalling, and blood clotting. Most adults fall short of the RDA through diet alone, and absorption declines significantly with age.',
    evidenceGrade: 'A',
    goalsSupported: ['muscle', 'longevity'],
    deficiencySymptoms: ['fatigue', 'poor_sleep', 'anxiety', 'muscle_weakness', 'low_mood'],
    safeUpperLimit: '2,500 mg/day ages 19–50; 2,000 mg/day ages 51+ (Institute of Medicine). Includes dietary intake.',
    drugInteractions: [
      {
        drug: 'levothyroxine',
        severity: 'high',
        description:
          'Calcium reduces thyroid hormone absorption by 20–25%. Take at least 4 hours apart.',
      },
      {
        drug: 'bisphosphonates',
        severity: 'high',
        description:
          'Calcium binds bisphosphonates (e.g., alendronate) and prevents absorption. Take at least 2 hours apart.',
      },
      {
        drug: 'tetracycline antibiotics',
        severity: 'moderate',
        description:
          'Calcium reduces absorption of tetracycline-class antibiotics. Take 2 hours before or 6 hours after.',
      },
      {
        drug: 'fluoroquinolones',
        severity: 'moderate',
        description:
          'Calcium reduces absorption of ciprofloxacin and levofloxacin. Take 2 hours before or 6 hours after.',
      },
      {
        drug: 'digoxin',
        severity: 'high',
        description:
          'Excess calcium increases risk of digoxin toxicity and serious arrhythmias. Monitor calcium levels closely.',
      },
    ],
    pubmedCitation: 'PMID: 26420598',
    nihUrl: 'https://ods.od.nih.gov/factsheets/Calcium-HealthProfessional/',
    recommendedForms: ['Calcium citrate (best absorbed, can take on empty stomach, gentler on GI). Calcium carbonate (cheaper, 40% elemental calcium, must take with food).'],
    typicalDose: '500–600 mg per dose, 1–2x daily. Most adults get 700–900 mg from diet; a 500 mg supplement fills the gap.',
  },
  {
    id: 'alginate',
    name: 'Alginate',
    description:
      'A natural polysaccharide derived from brown seaweed. Forms a viscous gel that floats on stomach contents, physically blocking acid reflux into the esophagus. The strongest evidence-based non-prescription treatment for GERD symptoms.',
    evidenceGrade: 'A',
    goalsSupported: ['longevity'],
    deficiencySymptoms: ['acid_reflux'],
    safeUpperLimit: 'Up to 1 g sodium alginate per dose, 3–4x daily after meals and at bedtime. GRAS by FDA.',
    drugInteractions: [
      {
        drug: 'levothyroxine',
        severity: 'moderate',
        description: 'Alginate may reduce absorption of thyroid medication. Take at least 2 hours apart.',
      },
      {
        drug: 'tetracycline',
        severity: 'moderate',
        description: 'Alginate binds tetracycline antibiotics. Separate by 2+ hours.',
      },
    ],
    pubmedCitation: 'PMID: 28375448',
    nihUrl: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5577773/',
    recommendedForms: ['Liquid sodium alginate (e.g., Gaviscon Advance). Chewable tablets offer portable alternative but may have lower efficacy than liquid.'],
    typicalDose: '10 mL liquid (500 mg alginate) after meals and at bedtime, 3–4x daily.',
  },
  {
    id: 'psyllium',
    name: 'Psyllium Husk',
    description:
      'A soluble fiber from Plantago ovata seeds. Forms a gel in the gut that regulates transit, improves stool consistency, lowers LDL cholesterol, and feeds beneficial gut bacteria. The gold-standard fiber supplement for constipation and IBS.',
    evidenceGrade: 'A',
    goalsSupported: ['longevity', 'weight_loss'],
    deficiencySymptoms: ['constipation', 'ibs'],
    safeUpperLimit: '10–30 g/day (3–10 g per dose, 1–3x daily). Always take with at least 8 oz water.',
    drugInteractions: [
      {
        drug: 'levothyroxine',
        severity: 'moderate',
        description: 'Psyllium reduces thyroid medication absorption. Separate doses by 2+ hours.',
      },
      {
        drug: 'lithium',
        severity: 'moderate',
        description: 'Psyllium may lower lithium absorption. Separate doses.',
      },
      {
        drug: 'carbamazepine',
        severity: 'moderate',
        description: 'May reduce absorption. Separate by 2+ hours.',
      },
    ],
    pubmedCitation: 'PMID: 30843436',
    nihUrl: 'https://www.nccih.nih.gov/health/psyllium',
    recommendedForms: ['Psyllium husk powder (unflavored) mixed into water. Capsule form requires many capsules per dose; powder is more efficient.'],
    typicalDose: '5–10 g (1–2 tsp) in 8 oz water, 1–3x daily. Start low and increase gradually to avoid bloating.',
  },
  {
    id: 'peppermint_oil',
    name: 'Peppermint Oil (Enteric-Coated)',
    description:
      'Enteric-coated capsules of peppermint essential oil (Mentha piperita). The menthol relaxes smooth muscle in the gut, reducing cramping and spasms. Gold-standard herbal treatment for IBS, validated by multiple Cochrane meta-analyses.',
    evidenceGrade: 'A',
    goalsSupported: ['longevity'],
    deficiencySymptoms: ['ibs', 'bloating', 'digestive_issues'],
    safeUpperLimit: '180–225 mg enteric-coated oil, 3x daily before meals. Do not use non-enteric-coated oil internally.',
    drugInteractions: [
      {
        drug: 'cyclosporine',
        severity: 'moderate',
        description: 'Peppermint oil may inhibit CYP3A4 and raise cyclosporine levels.',
      },
      {
        drug: 'proton pump inhibitors',
        severity: 'low',
        description: 'PPIs may dissolve enteric coating prematurely, causing reflux or reduced efficacy.',
      },
    ],
    pubmedCitation: 'PMID: 31756377',
    nihUrl: 'https://www.nccih.nih.gov/health/peppermint-oil',
    recommendedForms: ['Enteric-coated capsules ONLY for IBS (prevents stomach release that causes reflux). Look for 0.2 mL oil per capsule.'],
    typicalDose: '1 enteric-coated capsule (180–225 mg) 3x daily, 30 min before meals, for 4–24 weeks.',
  },
  {
    id: 'ginger',
    name: 'Ginger (Zingiber officinale)',
    description:
      'Rhizome with active compounds (gingerols, shogaols) that promote gastric emptying, reduce inflammation, and suppress nausea. Strongest evidence for nausea (pregnancy, chemotherapy, motion sickness) and functional dyspepsia.',
    evidenceGrade: 'A',
    goalsSupported: ['longevity', 'immunity'],
    deficiencySymptoms: ['nausea', 'bloating', 'digestive_issues'],
    safeUpperLimit: '1–3 g/day dried ginger root or equivalent extract. Up to 4 g/day shown safe in studies.',
    drugInteractions: [
      {
        drug: 'warfarin',
        severity: 'moderate',
        description: 'Ginger has antiplatelet effects and may increase bleeding risk with anticoagulants.',
      },
      {
        drug: 'aspirin',
        severity: 'low',
        description: 'Possible additive antiplatelet effect. Monitor for bleeding.',
      },
    ],
    pubmedCitation: 'PMID: 32340596',
    nihUrl: 'https://www.nccih.nih.gov/health/ginger',
    recommendedForms: ['Standardized extract (5% gingerols). Powdered root capsules. Fresh ginger tea or grated root for mild cases.'],
    typicalDose: '250 mg 4x daily for nausea; 1–1.5 g daily for general digestive support.',
  },
  {
    id: 'digestive_enzymes',
    name: 'Digestive Enzymes',
    description:
      'Broad-spectrum enzyme blends (amylase, protease, lipase, lactase) that help break down carbohydrates, proteins, fats, and dairy. Moderate evidence for functional dyspepsia and bloating in people with pancreatic insufficiency or general digestive complaints.',
    evidenceGrade: 'B',
    goalsSupported: ['longevity'],
    deficiencySymptoms: ['bloating', 'digestive_issues'],
    safeUpperLimit: 'Varies by formulation. Typical dose: 1 capsule with each meal. Follow product label.',
    drugInteractions: [
      {
        drug: 'warfarin',
        severity: 'low',
        description: 'Bromelain-containing enzyme blends may modestly increase bleeding risk.',
      },
    ],
    pubmedCitation: 'PMID: 36164977',
    nihUrl: 'https://www.niddk.nih.gov/health-information/digestive-diseases',
    recommendedForms: ['Multi-enzyme blends (amylase + protease + lipase + lactase). Plant-based (bromelain, papain) for non-dairy diets.'],
    typicalDose: '1 capsule with each meal. Dose-adjust based on symptom relief.',
  },
]
