# Quiz QA Report

Generated: 2026-04-30T00:50:32.835Z

**Personas tested:** 51
**Total issues:** 18 (0 high · 18 medium · 0 low)

## unexpected-promotion (14)

- **[medium]** persona `sym:joint_pain` — Methylfolate (5-MTHF) appears in top 3 with no matched symptoms or goals (user picked joint_pain)
- **[medium]** persona `sym:dry_skin` — Methylfolate (5-MTHF) appears in top 3 with no matched symptoms or goals (user picked dry_skin)
- **[medium]** persona `sym:acid_reflux` — Methylfolate (5-MTHF) appears in top 3 with no matched symptoms or goals (user picked acid_reflux)
- **[medium]** persona `sym:constipation` — Methylfolate (5-MTHF) appears in top 3 with no matched symptoms or goals (user picked constipation)
- **[medium]** persona `sym:constipation` — Vitamin D3 appears in top 3 with no matched symptoms or goals (user picked constipation)
- **[medium]** persona `sym:ibs` — Methylfolate (5-MTHF) appears in top 3 with no matched symptoms or goals (user picked ibs)
- **[medium]** persona `sym:nausea` — Methylfolate (5-MTHF) appears in top 3 with no matched symptoms or goals (user picked nausea)
- **[medium]** persona `sym:nausea` — Vitamin D3 appears in top 3 with no matched symptoms or goals (user picked nausea)
- **[medium]** persona `sym:apo_b_elevated` — Calcium appears in top 3 with no matched symptoms or goals (user picked apo_b_elevated)
- **[medium]** persona `sym:ldl_elevated` — Calcium appears in top 3 with no matched symptoms or goals (user picked ldl_elevated)
- **[medium]** persona `sym:hdl_low` — Calcium appears in top 3 with no matched symptoms or goals (user picked hdl_low)
- **[medium]** persona `sym:hdl_low` — Magnesium appears in top 3 with no matched symptoms or goals (user picked hdl_low)
- **[medium]** persona `sym:triglycerides_high` — Calcium appears in top 3 with no matched symptoms or goals (user picked triglycerides_high)
- **[medium]** persona `goal:weight_loss` — Methylfolate (5-MTHF) appears in top 3 with no matched symptoms or goals (user picked weight_loss)

## irrelevant-primary-evidence (4)

- **[medium]** persona `sym:anxiety` — Ashwagandha (KSM-66) primary cache condition "mood" doesn't map to user's inputs or this supplement's symptoms
- **[medium]** persona `sym:anxiety` — NAC (N-Acetyl Cysteine) primary cache condition "mood" doesn't map to user's inputs or this supplement's symptoms
- **[medium]** persona `combo:poor_sleep+anxiety+fatigue` — Ashwagandha (KSM-66) primary cache condition "mood" doesn't map to user's inputs or this supplement's symptoms
- **[medium]** persona `combo:poor_sleep+anxiety+fatigue` — NAC (N-Acetyl Cysteine) primary cache condition "mood" doesn't map to user's inputs or this supplement's symptoms

## All persona top-3 outputs

| Persona | Top 3 |
|---|---|
| `sym:fatigue` — Single symptom: fatigue | CoQ10 (Ubiquinol) · Vitamin B12 · Creatine Monohydrate |
| `sym:poor_sleep` — Single symptom: poor_sleep | Magnesium · Melatonin · Ashwagandha (KSM-66) |
| `sym:brain_fog` — Single symptom: brain_fog | Vitamin B12 · Omega-3 (Fish Oil / Algae) · NAC (N-Acetyl Cysteine) |
| `sym:joint_pain` — Single symptom: joint_pain | Omega-3 (Fish Oil / Algae) · Collagen Peptides · Methylfolate (5-MTHF) |
| `sym:frequent_illness` — Single symptom: frequent_illness | Probiotics · Zinc · Vitamin C |
| `sym:anxiety` — Single symptom: anxiety | Ashwagandha (KSM-66) · Probiotics · NAC (N-Acetyl Cysteine) |
| `sym:hair_loss` — Single symptom: hair_loss | Collagen Peptides · Zinc · Iron |
| `sym:digestive_issues` — Single symptom: digestive_issues | Probiotics · Digestive Enzymes · Ginger (Zingiber officinale) |
| `sym:low_mood` — Single symptom: low_mood | Vitamin B12 · Probiotics · Vitamin D3 |
| `sym:muscle_weakness` — Single symptom: muscle_weakness | Creatine Monohydrate · Vitamin D3 · Calcium |
| `sym:poor_memory` — Single symptom: poor_memory | Vitamin B12 · Creatine Monohydrate · Omega-3 (Fish Oil / Algae) |
| `sym:dry_skin` — Single symptom: dry_skin | Omega-3 (Fish Oil / Algae) · Collagen Peptides · Methylfolate (5-MTHF) |
| `sym:acid_reflux` — Single symptom: acid_reflux | Probiotics · Methylfolate (5-MTHF) · Magnesium |
| `sym:constipation` — Single symptom: constipation | Psyllium Husk · Methylfolate (5-MTHF) · Vitamin D3 |
| `sym:ibs` — Single symptom: ibs | Peppermint Oil (Enteric-Coated) · Psyllium Husk · Methylfolate (5-MTHF) |
| `sym:bloating` — Single symptom: bloating | Digestive Enzymes · Ginger (Zingiber officinale) · Peppermint Oil (Enteric-Coated) |
| `sym:nausea` — Single symptom: nausea | Ginger (Zingiber officinale) · Methylfolate (5-MTHF) · Vitamin D3 |
| `sym:apo_b_elevated` — Single symptom: apo_b_elevated | Plant Sterols (Phytosterols) · Calcium · Berberine |
| `sym:ldl_elevated` — Single symptom: ldl_elevated | Plant Sterols (Phytosterols) · Calcium · Berberine |
| `sym:hdl_low` — Single symptom: hdl_low | Calcium · Bergamot (BPF) · Magnesium |
| `sym:triglycerides_high` — Single symptom: triglycerides_high | Calcium · Berberine · Bergamot (BPF) |
| `goal:energy` — Single goal: energy | CoQ10 (Ubiquinol) · Vitamin B12 · Creatine Monohydrate |
| `goal:sleep` — Single goal: sleep | Magnesium · Melatonin · Ashwagandha (KSM-66) |
| `goal:muscle` — Single goal: muscle | Creatine Monohydrate · Calcium · Ashwagandha (KSM-66) |
| `goal:focus` — Single goal: focus | Vitamin B12 · Creatine Monohydrate · Omega-3 (Fish Oil / Algae) |
| `goal:longevity` — Single goal: longevity | Omega-3 (Fish Oil / Algae) · CoQ10 (Ubiquinol) · Plant Sterols (Phytosterols) |
| `goal:immunity` — Single goal: immunity | Probiotics · Zinc · Vitamin C |
| `goal:mood` — Single goal: mood | Vitamin B12 · Ashwagandha (KSM-66) · Probiotics |
| `goal:weight_loss` — Single goal: weight_loss | Berberine · Psyllium Husk · Methylfolate (5-MTHF) |
| `diet:omnivore` — Diet only: omnivore | Methylfolate (5-MTHF) · Iron · Vitamin D3 |
| `diet:vegetarian` — Diet only: vegetarian | Vitamin B12 · Creatine Monohydrate · Vitamin D3 |
| `diet:vegan` — Diet only: vegan | Vitamin B12 · Creatine Monohydrate · Vitamin D3 |
| `diet:keto` — Diet only: keto | Methylfolate (5-MTHF) · Magnesium · Calcium |
| `diet:paleo` — Diet only: paleo | Calcium · Methylfolate (5-MTHF) · Vitamin D3 |
| `diet:pescatarian` — Diet only: pescatarian | Creatine Monohydrate · Methylfolate (5-MTHF) · Iron |
| `diet:mediterranean` — Diet only: mediterranean | Methylfolate (5-MTHF) · Iron · Vitamin D3 |
| `diet:carnivore` — Diet only: carnivore | Methylfolate (5-MTHF) · Probiotics · Magnesium |
| `diet:other` — Diet only: other | Methylfolate (5-MTHF) · Iron · Vitamin D3 |
| `combo:joint_pain+muscle_weakness` — Joint pain + muscle weakness | Creatine Monohydrate · Vitamin D3 · Omega-3 (Fish Oil / Algae) |
| `combo:hair_loss+brittle_nails` — Hair loss + brittle nails | Collagen Peptides · Zinc · Iron |
| `combo:low_mood+anxiety` — Low mood + anxiety | Probiotics · Vitamin B12 · Ashwagandha (KSM-66) |
| `combo:fatigue+brain_fog` — Fatigue + brain fog | CoQ10 (Ubiquinol) · Vitamin B12 · Creatine Monohydrate |
| `combo:acid_reflux+dry_skin+joint_pain` — GERD + dry skin + joint pain (user reported) | Probiotics · Omega-3 (Fish Oil / Algae) · Collagen Peptides |
| `combo:bloating+ibs+constipation` — Gut chaos | Digestive Enzymes · Peppermint Oil (Enteric-Coated) · Ginger (Zingiber officinale) |
| `combo:ldl_elevated+apo_b_elevated+triglycerides_high` — Lipid panel issues | Plant Sterols (Phytosterols) · Berberine · Bergamot (BPF) |
| `combo:poor_sleep+anxiety+fatigue` — Insomnia loop | Ashwagandha (KSM-66) · NAC (N-Acetyl Cysteine) · Vitamin B12 |
| `combo:frequent_illness+fatigue` — Sick & tired | CoQ10 (Ubiquinol) · Vitamin B12 · Vitamin D3 |
| `realistic:vegan-female-35` — Vegan female, 35, low energy + brain fog | Vitamin B12 · Creatine Monohydrate · Iron |
| `realistic:older-male-statin` — Male, 60, on statins, elevated LDL | CoQ10 (Ubiquinol) · Creatine Monohydrate · Vitamin B12 |
| `realistic:athlete-male-30` — Male athlete, 30, weight training, high stress | Creatine Monohydrate · Magnesium · Ashwagandha (KSM-66) |
| `realistic:postmeno-65` — Post-menopausal female, 65, bone health focus | Vitamin D3 · CoQ10 (Ubiquinol) · Omega-3 (Fish Oil / Algae) |
