# Quiz QA Report

Generated: 2026-04-29T02:06:06.294Z

**Personas tested:** 51
**Total issues:** 11 (0 high · 11 medium · 0 low)

## irrelevant-primary-evidence (4)

- **[medium]** persona `sym:anxiety` — Ashwagandha (KSM-66) primary cache condition "mood" doesn't map to user's inputs or this supplement's symptoms
- **[medium]** persona `sym:anxiety` — NAC (N-Acetyl Cysteine) primary cache condition "mood" doesn't map to user's inputs or this supplement's symptoms
- **[medium]** persona `combo:poor_sleep+anxiety+fatigue` — Ashwagandha (KSM-66) primary cache condition "mood" doesn't map to user's inputs or this supplement's symptoms
- **[medium]** persona `combo:poor_sleep+anxiety+fatigue` — NAC (N-Acetyl Cysteine) primary cache condition "mood" doesn't map to user's inputs or this supplement's symptoms

## unexpected-promotion (7)

- **[medium]** persona `sym:constipation` — Methylfolate (5-MTHF) appears in top 3 with no matched symptoms or goals (user picked constipation)
- **[medium]** persona `sym:constipation` — Vitamin D3 appears in top 3 with no matched symptoms or goals (user picked constipation)
- **[medium]** persona `sym:ibs` — Methylfolate (5-MTHF) appears in top 3 with no matched symptoms or goals (user picked ibs)
- **[medium]** persona `sym:nausea` — Methylfolate (5-MTHF) appears in top 3 with no matched symptoms or goals (user picked nausea)
- **[medium]** persona `sym:nausea` — Vitamin D3 appears in top 3 with no matched symptoms or goals (user picked nausea)
- **[medium]** persona `sym:hdl_low` — Methylfolate (5-MTHF) appears in top 3 with no matched symptoms or goals (user picked hdl_low)
- **[medium]** persona `goal:weight_loss` — Methylfolate (5-MTHF) appears in top 3 with no matched symptoms or goals (user picked weight_loss)

## All persona top-3 outputs

| Persona | Top 3 |
|---|---|
| `sym:fatigue` — Single symptom: fatigue | CoQ10 (Ubiquinol) · Creatine Monohydrate · Iron |
| `sym:poor_sleep` — Single symptom: poor_sleep | Magnesium · Melatonin · Ashwagandha (KSM-66) |
| `sym:brain_fog` — Single symptom: brain_fog | Omega-3 (Fish Oil / Algae) · NAC (N-Acetyl Cysteine) · CoQ10 (Ubiquinol) |
| `sym:joint_pain` — Single symptom: joint_pain | Omega-3 (Fish Oil / Algae) · Collagen Peptides · Vitamin D3 |
| `sym:frequent_illness` — Single symptom: frequent_illness | Probiotics · Zinc · NAC (N-Acetyl Cysteine) |
| `sym:anxiety` — Single symptom: anxiety | Ashwagandha (KSM-66) · Probiotics · NAC (N-Acetyl Cysteine) |
| `sym:hair_loss` — Single symptom: hair_loss | Collagen Peptides · Zinc · Iron |
| `sym:digestive_issues` — Single symptom: digestive_issues | Probiotics · Digestive Enzymes · Ginger (Zingiber officinale) |
| `sym:low_mood` — Single symptom: low_mood | Probiotics · Vitamin D3 · Omega-3 (Fish Oil / Algae) |
| `sym:muscle_weakness` — Single symptom: muscle_weakness | Creatine Monohydrate · Vitamin D3 · Calcium |
| `sym:poor_memory` — Single symptom: poor_memory | Creatine Monohydrate · Omega-3 (Fish Oil / Algae) · Zinc |
| `sym:dry_skin` — Single symptom: dry_skin | Omega-3 (Fish Oil / Algae) · Collagen Peptides · Vitamin C |
| `sym:acid_reflux` — Single symptom: acid_reflux | Probiotics · Magnesium · Melatonin |
| `sym:constipation` — Single symptom: constipation | Psyllium Husk · Methylfolate (5-MTHF) · Vitamin D3 |
| `sym:ibs` — Single symptom: ibs | Peppermint Oil (Enteric-Coated) · Psyllium Husk · Methylfolate (5-MTHF) |
| `sym:bloating` — Single symptom: bloating | Digestive Enzymes · Ginger (Zingiber officinale) · Peppermint Oil (Enteric-Coated) |
| `sym:nausea` — Single symptom: nausea | Methylfolate (5-MTHF) · Ginger (Zingiber officinale) · Vitamin D3 |
| `sym:apo_b_elevated` — Single symptom: apo_b_elevated | Berberine · Bergamot (BPF) · Red Yeast Rice (Standardized) |
| `sym:ldl_elevated` — Single symptom: ldl_elevated | Berberine · Bergamot (BPF) · Red Yeast Rice (Standardized) |
| `sym:hdl_low` — Single symptom: hdl_low | Bergamot (BPF) · Methylfolate (5-MTHF) · Aged Garlic Extract (Kyolic AGE) |
| `sym:triglycerides_high` — Single symptom: triglycerides_high | Berberine · Bergamot (BPF) · Aged Garlic Extract (Kyolic AGE) |
| `goal:energy` — Single goal: energy | CoQ10 (Ubiquinol) · Creatine Monohydrate · Magnesium |
| `goal:sleep` — Single goal: sleep | Magnesium · Melatonin · Ashwagandha (KSM-66) |
| `goal:muscle` — Single goal: muscle | Creatine Monohydrate · Calcium · Ashwagandha (KSM-66) |
| `goal:focus` — Single goal: focus | Creatine Monohydrate · Omega-3 (Fish Oil / Algae) · NAC (N-Acetyl Cysteine) |
| `goal:longevity` — Single goal: longevity | Omega-3 (Fish Oil / Algae) · CoQ10 (Ubiquinol) · Plant Sterols (Phytosterols) |
| `goal:immunity` — Single goal: immunity | Probiotics · Zinc · NAC (N-Acetyl Cysteine) |
| `goal:mood` — Single goal: mood | Ashwagandha (KSM-66) · Probiotics · NAC (N-Acetyl Cysteine) |
| `goal:weight_loss` — Single goal: weight_loss | Berberine · Psyllium Husk · Methylfolate (5-MTHF) |
| `diet:omnivore` — Diet only: omnivore | Methylfolate (5-MTHF) · Iron · Vitamin D3 |
| `diet:vegetarian` — Diet only: vegetarian | Creatine Monohydrate · Vitamin D3 · Iron |
| `diet:vegan` — Diet only: vegan | Creatine Monohydrate · Vitamin D3 · Iron |
| `diet:keto` — Diet only: keto | Methylfolate (5-MTHF) · Probiotics · Magnesium |
| `diet:paleo` — Diet only: paleo | Vitamin D3 · Calcium · Vitamin B12 |
| `diet:pescatarian` — Diet only: pescatarian | Creatine Monohydrate · Iron · Zinc |
| `diet:mediterranean` — Diet only: mediterranean | Vitamin D3 · Methylfolate (5-MTHF) · Vitamin B12 |
| `diet:carnivore` — Diet only: carnivore | Methylfolate (5-MTHF) · Probiotics · Magnesium |
| `diet:other` — Diet only: other | Methylfolate (5-MTHF) · Iron · Vitamin D3 |
| `combo:joint_pain+muscle_weakness` — Joint pain + muscle weakness | Creatine Monohydrate · Vitamin D3 · Omega-3 (Fish Oil / Algae) |
| `combo:hair_loss+brittle_nails` — Hair loss + brittle nails | Collagen Peptides · Zinc · Iron |
| `combo:low_mood+anxiety` — Low mood + anxiety | Probiotics · Ashwagandha (KSM-66) · Methylfolate (5-MTHF) |
| `combo:fatigue+brain_fog` — Fatigue + brain fog | CoQ10 (Ubiquinol) · Creatine Monohydrate · Iron |
| `combo:acid_reflux+dry_skin+joint_pain` — GERD + dry skin + joint pain (user reported) | Probiotics · Omega-3 (Fish Oil / Algae) · Collagen Peptides |
| `combo:bloating+ibs+constipation` — Gut chaos | Digestive Enzymes · Peppermint Oil (Enteric-Coated) · Ginger (Zingiber officinale) |
| `combo:ldl_elevated+apo_b_elevated+triglycerides_high` — Lipid panel issues | Berberine · Bergamot (BPF) · Red Yeast Rice (Standardized) |
| `combo:poor_sleep+anxiety+fatigue` — Insomnia loop | Ashwagandha (KSM-66) · NAC (N-Acetyl Cysteine) · CoQ10 (Ubiquinol) |
| `combo:frequent_illness+fatigue` — Sick & tired | CoQ10 (Ubiquinol) · Vitamin D3 · Creatine Monohydrate |
| `realistic:vegan-female-35` — Vegan female, 35, low energy + brain fog | Creatine Monohydrate · Iron · Omega-3 (Fish Oil / Algae) |
| `realistic:older-male-statin` — Male, 60, on statins, elevated LDL | CoQ10 (Ubiquinol) · Creatine Monohydrate · Plant Sterols (Phytosterols) |
| `realistic:athlete-male-30` — Male athlete, 30, weight training, high stress | Creatine Monohydrate · Magnesium · Ashwagandha (KSM-66) |
| `realistic:postmeno-65` — Post-menopausal female, 65, bone health focus | Vitamin D3 · CoQ10 (Ubiquinol) · Omega-3 (Fish Oil / Algae) |
