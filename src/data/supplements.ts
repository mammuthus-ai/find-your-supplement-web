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
    // 2026-04-29 evidence audit: removed anxiety. Folate-mood literature
    // is dominated by depression RCTs (Coppen 2000, Roberts 2018) — anxiety-
    // specific RCTs for methylfolate are sparse. Cache 'mood' bucket reflects
    // the depression-heavy lit. Low_mood, brain_fog, poor_memory remain.
    deficiencySymptoms: ['low_mood', 'fatigue', 'brain_fog', 'poor_memory'],
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
    // 2026-04-29 evidence audit: removed joint_pain and dry_skin. Canter 2007
    // (PMID 17522095) systematic review found no convincing RCT evidence for
    // vitamin C in arthritis/joint pain. Skin-specific RCTs are also weak;
    // the cache only has 'inflammation' (general CRP/CV/sepsis) for both.
    // Frequent-illness and fatigue evidence remain strong.
    deficiencySymptoms: ['frequent_illness', 'fatigue'],
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
  {
    id: 'berberine',
    name: 'Berberine',
    description: 'An isoquinoline alkaloid from Berberis species (goldenseal, barberry, Oregon grape) with statin-independent LDL-lowering activity. Upregulates hepatic LDL-receptor expression via ERK-pathway stabilization of LDLR mRNA, activates AMPK, inhibits PCSK9 expression, and improves insulin sensitivity. A 2023 meta-analysis of 41 RCTs (n=4,838) showed LDL −15 mg/dL, triglycerides −19 mg/dL, and modest HDL increase. Because of poor oral bioavailability (~1%), phytosome and dihydroberberine delivery forms are clinically preferred.',
    evidenceGrade: 'A',
    goalsSupported: [
      'longevity',
      'weight_loss',
      'energy'
    ],
    deficiencySymptoms: [
      'ldl_elevated',
      'apo_b_elevated',
      'triglycerides_high'
    ],
    safeUpperLimit: '1,500 mg/day (typical clinical dose 500 mg BID–TID with meals). GI upset common at higher doses.',
    drugInteractions: [
      {
        drug: 'statins (soft-warn, CYP3A4)',
        severity: 'high',
        description: 'Berberine inhibits CYP3A4 and P-gp, raising levels of simvastatin, atorvastatin, and lovastatin and increasing myopathy risk. Avoid combination or use under clinician guidance.'
      },
      {
        drug: 'diabetes medications (hypoglycemia risk)',
        severity: 'high',
        description: 'Additive glucose-lowering effect with insulin, sulfonylureas, and metformin. Monitor blood glucose; dose adjustment may be required.'
      },
      {
        drug: 'cyclosporine',
        severity: 'high',
        description: 'Berberine raises cyclosporine plasma levels via CYP3A4/P-gp inhibition — toxicity risk.'
      },
      {
        drug: 'macrolide antibiotics',
        severity: 'moderate',
        description: 'Additive CYP3A4 inhibition; separate or avoid concurrent use.'
      },
      {
        drug: 'pregnancy (exclude)',
        severity: 'high',
        description: 'Berberine crosses placenta and may displace bilirubin, causing neonatal kernicterus. Hard-exclude in pregnancy and breastfeeding.'
      }
    ],
    pubmedCitation: 'Xiong et al., Front Pharmacol 2023; PMID: 37183391',
    nihUrl: '',
    recommendedForms: [
      'Berberine — see forms below'
    ],
    typicalDose: '',
    forms: [
      {
        name: 'Berberine phytosome (Berberine Phytosome / sunfiber complex)',
        bestFor: [
          'ldl_elevated',
          'apo_b_elevated',
          'triglycerides_high',
          'weight_loss',
          'longevity'
        ],
        bioavailability: 'high',
        amazonSearch: 'berberine+phytosome',
        warning: null,
        priority: 1
      },
      {
        name: 'Dihydroberberine (DHB)',
        bestFor: [
          'ldl_elevated',
          'triglycerides_high',
          'weight_loss'
        ],
        bioavailability: 'high',
        amazonSearch: 'dihydroberberine',
        warning: null,
        priority: 2
      },
      {
        name: 'Berberine HCl 500 mg',
        bestFor: [
          'ldl_elevated',
          'apo_b_elevated',
          'triglycerides_high',
          'weight_loss'
        ],
        bioavailability: 'low',
        amazonSearch: 'berberine+hcl+500+mg',
        warning: 'Oral bioavailability ~1%; requires 500 mg 2–3×/day with meals and commonly causes GI upset.',
        priority: 3
      },
      {
        name: 'Berberine + Milk Thistle combo',
        bestFor: [
          'ldl_elevated',
          'longevity'
        ],
        bioavailability: 'medium',
        amazonSearch: 'berberine+milk+thistle',
        warning: null,
        priority: 4
      }
    ]
  },
  {
    id: 'bergamot',
    name: 'Bergamot (BPF)',
    description: 'Standardized Bergamot Polyphenolic Fraction from Citrus bergamia, rich in brutieridin and melitidin — natural HMG-CoA reductase inhibitors — plus neoeriocitrin and naringin which activate AMPK and reduce hepatic lipogenesis. A 2019 review of 20 human studies (n=1,709) and multiple RCTs (PMID: 24239156, 35631240, 38892519) show LDL −15 to −25%, triglycerides −15 to −30%, HDL +5 to +10% at 500–1,000 mg standardized BPF per day. Unique among non-statin nutraceuticals for its concurrent HDL-raising effect.',
    evidenceGrade: 'B',
    goalsSupported: [
      'longevity',
      'energy'
    ],
    deficiencySymptoms: [
      'ldl_elevated',
      'triglycerides_high',
      'hdl_low',
      'apo_b_elevated'
    ],
    safeUpperLimit: '1,000 mg/day standardized BPF (≥38% polyphenols). Generally well-tolerated; rare mild GI upset or muscle cramps.',
    drugInteractions: [
      {
        drug: 'statins (soft-warn, CYP3A4)',
        severity: 'moderate',
        description: 'Bergamot contains natural statin-like compounds and mildly inhibits CYP3A4. Combination with prescription statins may potentiate LDL reduction but increases theoretical myopathy risk — monitor creatine kinase (CK).'
      },
      {
        drug: 'CYP3A4-metabolized drugs',
        severity: 'low',
        description: 'Mild furanocoumarin content; weaker than grapefruit but consider spacing.'
      }
    ],
    pubmedCitation: 'Lamiquiz-Moneo et al., Nutrients 2019; PMID: 30847114',
    nihUrl: '',
    recommendedForms: [
      'Bergamot (BPF) — see forms below'
    ],
    typicalDose: '',
    forms: [
      {
        name: 'Bergamot phytosome (Bergavit / Vazguard-style, standardized ≥38% polyphenols)',
        bestFor: [
          'ldl_elevated',
          'triglycerides_high',
          'hdl_low',
          'apo_b_elevated',
          'longevity'
        ],
        bioavailability: 'high',
        amazonSearch: 'bergamot+phytosome',
        warning: null,
        priority: 1
      },
      {
        name: 'Citrus bergamot BPF extract (500–1000 mg)',
        bestFor: [
          'ldl_elevated',
          'triglycerides_high',
          'hdl_low'
        ],
        bioavailability: 'medium',
        amazonSearch: 'citrus+bergamot+bpf',
        warning: null,
        priority: 2
      },
      {
        name: 'Bergamot + artichoke combo',
        bestFor: [
          'ldl_elevated',
          'longevity'
        ],
        bioavailability: 'medium',
        amazonSearch: 'bergamot+artichoke',
        warning: null,
        priority: 3
      },
      {
        name: 'Unstandardized bergamot powder',
        bestFor: [
          'ldl_elevated'
        ],
        bioavailability: 'low',
        amazonSearch: 'bergamot+powder',
        warning: 'Polyphenol content variable; clinical trials use standardized BPF only.',
        priority: 4
      }
    ]
  },
  {
    id: 'red_yeast_rice',
    name: 'Red Yeast Rice (Standardized)',
    description: 'Fermented rice (Monascus purpureus) that naturally contains monacolin K — chemically identical to prescription lovastatin — along with monacolins J, L, M and minor sterols. A 2015 Atherosclerosis meta-analysis of 20 RCTs (PMID: 25897793) reported LDL −39 mg/dL (20–30% reduction), comparable to low-dose statin therapy. Critical caveats: monacolin K content varies up to 100× between unregulated products (PMID: 27089602), and citrinin (a nephrotoxic mycotoxin) contamination is common — only use third-party tested, citrinin-free standardized products. EFSA capped supplemental monacolin K at <3 mg/day in the EU (2022).',
    evidenceGrade: 'A',
    goalsSupported: [
      'longevity'
    ],
    deficiencySymptoms: [
      'ldl_elevated',
      'apo_b_elevated'
    ],
    safeUpperLimit: 'EFSA (2022): supplemental monacolin K <3 mg/day. Clinical dyslipidemia trials use 3–10 mg monacolin K/day but require clinician supervision and third-party citrinin testing.',
    drugInteractions: [
      {
        drug: 'statins (hard-exclude)',
        severity: 'high',
        description: 'Monacolin K is lovastatin. Combining with prescription statins produces additive HMG-CoA reductase inhibition and major myopathy/rhabdomyolysis risk. Hard-exclude.'
      },
      {
        drug: 'fibrates (hard-exclude)',
        severity: 'high',
        description: 'Additive myopathy and rhabdomyolysis risk — do not combine.'
      },
      {
        drug: 'pregnancy (hard-exclude)',
        severity: 'high',
        description: 'Statin-class drugs are contraindicated in pregnancy due to potential fetal harm. Hard-exclude.'
      },
      {
        drug: 'grapefruit juice',
        severity: 'high',
        description: 'Inhibits CYP3A4, dramatically raising monacolin K levels and myopathy risk. Avoid.'
      },
      {
        drug: 'cyclosporine',
        severity: 'high',
        description: 'Severe myopathy risk via CYP3A4 inhibition.'
      },
      {
        drug: 'macrolide antibiotics and azole antifungals',
        severity: 'high',
        description: 'Strong CYP3A4 inhibitors — hold RYR during therapy.'
      }
    ],
    pubmedCitation: 'Gerards et al., Atherosclerosis 2015; PMID: 25897793',
    nihUrl: '',
    recommendedForms: [
      'Red Yeast Rice (Standardized) — see forms below'
    ],
    typicalDose: '',
    forms: [
      {
        name: 'Standardized Red Yeast Rice (citrinin-free, third-party tested)',
        bestFor: [
          'ldl_elevated',
          'apo_b_elevated',
          'longevity'
        ],
        bioavailability: 'high',
        amazonSearch: 'red+yeast+rice+citrinin+free',
        warning: 'Contains monacolin K (chemically identical to lovastatin). Do NOT combine with statins, fibrates, cyclosporine, grapefruit juice. Contraindicated in pregnancy and liver disease.',
        priority: 1
      },
      {
        name: 'Red Yeast Rice + CoQ10 combo',
        bestFor: [
          'ldl_elevated',
          'fatigue',
          'muscle_weakness'
        ],
        bioavailability: 'high',
        amazonSearch: 'red+yeast+rice+coq10',
        warning: 'CoQ10 helps offset statin-like myopathy risk. Same contraindications as RYR alone.',
        priority: 2
      },
      {
        name: 'Generic Red Yeast Rice',
        bestFor: [
          'ldl_elevated'
        ],
        bioavailability: 'medium',
        amazonSearch: 'red+yeast+rice',
        warning: 'Monacolin K content varies up to 100× between brands; citrinin contamination risk. Choose standardized citrinin-free products only.',
        priority: 3
      }
    ]
  },
  {
    id: 'plant_sterols',
    name: 'Plant Sterols (Phytosterols)',
    description: 'Structural cholesterol analogs (beta-sitosterol, campesterol, stigmasterol, plus their stanol derivatives) that competitively displace cholesterol from intestinal mixed micelles, reducing cholesterol absorption by ~50% and upregulating hepatic LDL-receptor clearance. A 2003 meta-analysis of 41 trials (PMID: 12911045) established 2 g/day produces LDL −10%, with plateau above that dose. FDA authorized health claim (21 CFR 101.83): 1.3 g sterol esters or 3.4 g stanol esters/day reduces CHD risk. Excellent safety profile — often stacked with statins for additive effect.',
    evidenceGrade: 'A',
    goalsSupported: [
      'longevity'
    ],
    deficiencySymptoms: [
      'ldl_elevated',
      'apo_b_elevated'
    ],
    safeUpperLimit: '3 g/day; doses above 2 g/day produce minimal additional LDL reduction. GRAS status. Take with meals — fat is required for sterol incorporation into micelles.',
    drugInteractions: [
      {
        drug: 'ezetimibe (additive)',
        severity: 'moderate',
        description: 'Both drugs inhibit intestinal cholesterol absorption via overlapping mechanisms (NPC1L1 pathway). Benefit may plateau; discuss with clinician.'
      },
      {
        drug: 'fat-soluble vitamin absorption (take with meal)',
        severity: 'low',
        description: 'Plant sterols modestly reduce absorption of beta-carotene and other carotenoids. Take with meals containing colorful vegetables; no significant impact on vitamin D/E/K status at 2 g/day.'
      }
    ],
    pubmedCitation: 'Katan et al., Mayo Clin Proc 2003; PMID: 12911045',
    nihUrl: '',
    recommendedForms: [
      'Plant Sterols (Phytosterols) — see forms below'
    ],
    typicalDose: '',
    forms: [
      {
        name: 'Plant sterol esters (CardioAid / Reducol, 2 g/day)',
        bestFor: [
          'ldl_elevated',
          'apo_b_elevated',
          'longevity'
        ],
        bioavailability: 'high',
        amazonSearch: 'plant+sterols+2000+mg',
        warning: null,
        priority: 1
      },
      {
        name: 'Beta-sitosterol',
        bestFor: [
          'ldl_elevated',
          'longevity'
        ],
        bioavailability: 'high',
        amazonSearch: 'beta+sitosterol',
        warning: null,
        priority: 2
      },
      {
        name: 'Phytosterol + stanol complex',
        bestFor: [
          'ldl_elevated',
          'apo_b_elevated'
        ],
        bioavailability: 'high',
        amazonSearch: 'phytosterols+stanols',
        warning: null,
        priority: 3
      },
      {
        name: 'Sterol-fortified margarine/spread',
        bestFor: [
          'ldl_elevated'
        ],
        bioavailability: 'high',
        amazonSearch: 'benecol+plant+sterol+spread',
        warning: 'Food-form delivery; watch total fat/calorie intake.',
        priority: 4
      }
    ]
  },
  {
    id: 'aged_garlic',
    name: 'Aged Garlic Extract (Kyolic AGE)',
    description: 'Aged Garlic Extract (Kyolic brand; Allium sativum aged 18–20 months) standardized to S-allyl cysteine (SAC) — a water-soluble, odor-free, stable marker compound. SAC weakly inhibits hepatic HMG-CoA reductase, with additional antioxidant, endothelial, and antiplatelet effects. A 2019 meta-analysis of 33 studies (n=1,273; PMID: 30049636) in diabetic populations showed TC −17 mg/dL, LDL −10 mg/dL, TG −12 mg/dL, HDL +3 mg/dL. AGE-specific Kyolic trials also demonstrate modest BP reduction (−7 to −10 mmHg SBP) and coronary artery calcium score stabilization. Fewer GI and breath side effects than raw garlic or allicin-standardized extracts.',
    evidenceGrade: 'B',
    goalsSupported: [
      'longevity',
      'immunity'
    ],
    deficiencySymptoms: [
      'ldl_elevated',
      'triglycerides_high',
      'hdl_low'
    ],
    safeUpperLimit: '2,400 mg/day AGE has been used in clinical trials (typical dose 600–1,200 mg/day for lipids, up to 2,400 mg for BP). GRAS status.',
    drugInteractions: [
      {
        drug: 'warfarin (soft-warn, bleeding risk)',
        severity: 'moderate',
        description: 'Garlic has antiplatelet activity and may potentiate warfarin. Monitor INR more frequently when starting or stopping AGE.'
      },
      {
        drug: 'antiplatelets',
        severity: 'moderate',
        description: 'Additive antiplatelet effect with aspirin, clopidogrel, DOACs. Increased bleeding risk — clinician consult advised.'
      },
      {
        drug: 'HIV protease inhibitors',
        severity: 'high',
        description: 'Garlic significantly lowers saquinavir and related protease inhibitor plasma levels — may compromise antiretroviral efficacy. Avoid combination.'
      },
      {
        drug: 'diabetes medications',
        severity: 'low',
        description: 'Mild additive hypoglycemic effect; monitor blood glucose.'
      }
    ],
    pubmedCitation: 'Shabani et al., Phytomedicine 2019; PMID: 30049636',
    nihUrl: '',
    recommendedForms: [
      'Aged Garlic Extract (Kyolic AGE) — see forms below'
    ],
    typicalDose: '',
    forms: [
      {
        name: 'Kyolic Aged Garlic Extract (AGE, 600–1,200 mg)',
        bestFor: [
          'ldl_elevated',
          'triglycerides_high',
          'longevity',
          'immunity'
        ],
        bioavailability: 'high',
        amazonSearch: 'kyolic+aged+garlic+extract',
        warning: null,
        priority: 1
      },
      {
        name: 'Aged Garlic + CoQ10 cardiovascular formula',
        bestFor: [
          'ldl_elevated',
          'longevity',
          'energy'
        ],
        bioavailability: 'high',
        amazonSearch: 'kyolic+aged+garlic+coq10',
        warning: null,
        priority: 2
      },
      {
        name: 'Garlic oil softgel',
        bestFor: [
          'immunity',
          'ldl_elevated'
        ],
        bioavailability: 'medium',
        amazonSearch: 'garlic+oil+softgel',
        warning: 'Less S-allyl cysteine than aged garlic extract; stronger odor.',
        priority: 3
      },
      {
        name: 'Allicin-standardized garlic extract',
        bestFor: [
          'immunity',
          'ldl_elevated'
        ],
        bioavailability: 'medium',
        amazonSearch: 'allicin+garlic+extract',
        warning: 'Higher antiplatelet activity than AGE; more GI upset.',
        priority: 4
      }
    ]
  },
]
