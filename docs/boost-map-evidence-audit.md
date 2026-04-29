# Boost Map Evidence Audit — 2026-04-28

Per the evidence-first rule: every entry in `DIET_BOOST`, `LIFESTYLE_BOOST`,
`AGE_BOOSTS`, `SEX_BOOSTS` should be defensible with a named, citable source
(meta-analysis, position stand, named PubMed study, or NIH/ODS fact sheet).
Entries with only "common knowledge" justification need either a real citation
added or removal.

Grading: **Strong** (≥1 meta-analysis or position stand directly supporting),
**Moderate** (named RCTs or large observational studies),
**Weak** (mechanistic/inferential only),
**Insufficient** (no defensible source found).

---

## DIET_BOOST audit

| Entry | Evidence | Source | Action |
|---|---|---|---|
| carnivore → Vitamin C | Strong | [Carpenter 1986 scurvy review (PMID 3525876)](https://pubmed.ncbi.nlm.nih.gov/3525876/); [Chambial 2013](https://pubmed.ncbi.nlm.nih.gov/24426232/). Carnivore diets eliminate fruit/veg; muscle meat <2 mg/100g vit C. | Keep |
| carnivore → Magnesium | Strong | USDA Food DB (muscle meat ~25 mg/100g vs leafy greens 80–90); [NHANES 2003-2006](https://pubmed.ncbi.nlm.nih.gov/22113870/) shows even omnivores below RDA | Keep |
| carnivore → Methylfolate | Strong | NIH ODS folate fact sheet — folate concentrated in greens, legumes, citrus. Muscle meat negligible. | Keep |
| carnivore → Probiotics | Moderate | [Wang 2015 microbiome study (PMID 26439826)](https://pubmed.ncbi.nlm.nih.gov/26439826/) — fiber-driven microbial diversity. But probiotic *supplement* benefit (vs dietary fiber) less clear. | Keep, add comment |
| carnivore → Calcium | Strong | USDA — pure carnivore (no dairy) ~150 mg/day from muscle meat alone vs RDA 1000-1200 | Keep |
| vegan/vegetarian → B12 | Very strong | [Pawlak 2014 meta-analysis (PMID 23356638)](https://pubmed.ncbi.nlm.nih.gov/23356638/) — 52% of vegans deficient | Keep |
| vegan/vegetarian → Omega-3 | Strong | [Burdge 2002 (PMID 12442909)](https://pubmed.ncbi.nlm.nih.gov/12442909/) — ALA→EPA conversion 5-10% only | Keep |
| vegan/vegetarian → Iron | Strong | [Pawlak 2018 review (PMID 28236340)](https://pubmed.ncbi.nlm.nih.gov/28236340/) — non-heme bioavailability 5-15% vs 15-35% heme | Keep |
| vegan/vegetarian → Zinc | Strong | [Foster 2013 meta-analysis (PMID 24067392)](https://pubmed.ncbi.nlm.nih.gov/24067392/) — phytates reduce Zn absorption ~50% | Keep |
| vegan/vegetarian → Vitamin D3 | Moderate | [Heaney 2011 (PMID 21177028)](https://pubmed.ncbi.nlm.nih.gov/21177028/) — D3 superior to D2 | Keep, narrow to vegans |
| vegan/vegetarian → Calcium | Moderate | [Tucker 2014 (PMID 25149890)](https://pubmed.ncbi.nlm.nih.gov/25149890/) — vegan Ca intake often below RDA without fortification | Keep |
| vegan/vegetarian → Creatine | Strong | [Burke 2003 (PMID 14561234)](https://pubmed.ncbi.nlm.nih.gov/14561234/) — vegetarians ~50% lower muscle creatine; [Benton 2011 RCT (PMID 21118604)](https://pubmed.ncbi.nlm.nih.gov/21118604/) | Keep |
| keto → Vitamin C | Moderate | Keto restricts most fruit; depends on user food choices. Defensible but weak vs carnivore. | Keep, lower magnitude |
| keto → Methylfolate | Moderate | Keto restricts beans/grains/leafy greens (the folate sources) | Keep |
| keto → Magnesium | Strong | [Schwingshackl 2017](https://pubmed.ncbi.nlm.nih.gov/27916879/) — keto flu commonly involves Mg deficiency; whole grains/legumes/fruit are restricted | Keep |
| keto → Probiotics | **Weak** | Inferential (low fiber → microbiome shift). No direct keto+probiotic supplementation RCT. | **Remove or downgrade** |
| keto → Calcium | Moderate | Keto can be dairy-restricted depending on user — defensible but optional | Keep with caveat |
| paleo → Calcium | Moderate | [Klonoff 2009 (PMID 19437404)](https://pubmed.ncbi.nlm.nih.gov/19437404/) — paleo restricts dairy | Keep |
| paleo → Vitamin D3 | **Insufficient** | No specific paleo-D link in literature. Same risk as omnivores. | **Remove** |
| paleo → Vitamin B12 | **Insufficient** | Paleo *includes* meat — primary B12 source. No evidence for boost. | **Remove** |
| pescatarian → B12 | **Weak** | Pescatarians eat fish/eggs/dairy — generally adequate B12 status | **Remove** |
| pescatarian → Iron | **Weak** | Fish is heme iron source. Lower than red meat but not deficient on average. | **Remove or downgrade to low** |
| pescatarian → Zinc | **Weak** | Seafood is good Zn source (oysters especially). Marginal evidence for boost. | **Remove** |
| pescatarian → Creatine | Moderate | [Harris 1992 (PMID 1356551)](https://pubmed.ncbi.nlm.nih.gov/1356551/) — fish has creatine but less than red meat | Keep |
| mediterranean → Vitamin D3 | **Weak** | Mediterranean diet includes fatty fish. No specific D-deficiency signal. | **Remove** |
| mediterranean → Vitamin B12 | **Weak** | Mediterranean has fish/eggs/dairy. No specific B12-deficiency signal. | **Remove** |

**DIET_SUPPRESS audit** (separate but related):
- carnivore → B12, Iron, Zinc, Creatine: Strong (animal-based diets are replete in these). Keep.
- vegan/vegetarian → Vitamin C: Strong (plant-rich). Keep.
- keto → B12, Iron: Moderate (depending on user; meats included on keto). Keep.
- paleo → Vit C, Iron, Zinc, Mg: Mixed. Iron+Zn justified (meat-rich); Vit C+Mg less so. Keep with caveat.
- pescatarian → Omega-3: Strong (fish-rich). Keep.
- mediterranean → Vit C, Mg: Weak. Mediterranean is nutrient-rich generally. Consider removal.

---

## LIFESTYLE_BOOST audit

| Entry | Evidence | Source | Action |
|---|---|---|---|
| sun_very_little → D3 (high) | Strong | [Holick 2007 NEJM (PMID 17634462)](https://pubmed.ncbi.nlm.nih.gov/17634462/) — UVB synthesis primary D source | Keep |
| sun_very_little → Mg (medium) | Moderate | Mg is cofactor in vitamin D activation (1α-hydroxylase) | Keep, lower to low |
| ex_weight_training → Creatine (high) | Very strong | [ISSN position stand 2017 (PMID 28615996)](https://pubmed.ncbi.nlm.nih.gov/28615996/) | Keep |
| ex_weight_training → Collagen (medium) | Moderate-strong | [Clifford 2019 RCT (PMID 31010482)](https://pubmed.ncbi.nlm.nih.gov/31010482/) — tendon outcomes | Keep |
| ex_weight_training → Mg (high) | Moderate | [Lukaski 2004 review](https://pubmed.ncbi.nlm.nih.gov/15466951/) — sweat losses; magnitude=high may be aggressive | Keep, **lower to medium** |
| ex_weight_training → Zinc (medium) | **Weak** | Observational sweat-loss studies only; no RCT supplementation benefit | **Lower to low or remove** |
| ex_cardio → Iron (high) | Strong | [Pasricha 2014 (PMID 24505012)](https://pubmed.ncbi.nlm.nih.gov/24505012/) — endurance athletes, foot-strike hemolysis | Keep |
| ex_cardio → D3 (medium) | Weak | Indoor cardio reduces sun exposure (indirect) | Lower to low |
| ex_cardio → Omega-3 (medium) | Moderate | [Jouris 2011](https://pubmed.ncbi.nlm.nih.gov/21813812/) — inflammation/recovery in endurance | Keep |
| ex_cardio → Mg (high) | Moderate | Sweat-loss meta-analysis | Keep, lower to medium |
| alcohol → Methylfolate (high) | Strong | [NIAAA Alcohol & Folate review](https://pubmed.ncbi.nlm.nih.gov/15706796/) — alcohol inhibits folate absorption | Keep |
| alcohol → B12 (high) | Strong | Alcohol-induced gastritis impairs IF/B12 binding | Keep |
| alcohol → Mg (high) | Strong | [Vormann 2014](https://pubmed.ncbi.nlm.nih.gov/24914796/) — increased renal Mg excretion | Keep |
| alcohol → Zinc (medium) | Moderate | Documented alcoholic Zn deficiency | Keep |
| alcohol → D3 (medium) | Moderate | Hepatic D activation impaired in heavy drinkers | Keep |
| alcohol → NAC (high) | Strong | Glutathione precursor for hepatic detox; many alcoholic-liver RCTs | Keep |
| caffeine → Mg (medium) | Moderate | [Massey 1993](https://pubmed.ncbi.nlm.nih.gov/8505540/) — increased urinary Mg excretion | Keep |
| caffeine → Iron (low) | Strong | [Hallberg 1999 (PMID 10355683)](https://pubmed.ncbi.nlm.nih.gov/10355683/) — coffee polyphenols inhibit non-heme Fe absorption ~60% with meals | Keep — magnitude=low correct (only matters with iron deficiency) |
| stress → Ashwagandha (high) | Strong | [Lopresti 2019 RCT (PMID 31517876)](https://pubmed.ncbi.nlm.nih.gov/31517876/) — cortisol/stress reduction | Keep |
| stress → Mg (high) | Moderate | [Boyle 2017 review](https://pubmed.ncbi.nlm.nih.gov/28445426/) — Mg-stress axis bidirectional | Keep |
| stress → B12 (medium) | **Weak** | Methylation/mood claims; no specific stress→B12 RCT | **Lower to low or remove** |
| stress → Vit C (medium) | Moderate | Adrenal C concentration; depleted under stress (animal studies + human observational) | Keep |
| stress → Zinc (medium) | **Weak** | Acute stress lowers serum Zn (transient); supplement effect unclear | **Lower to low** |
| stress → Probiotics (medium) | Moderate | [Messaoudi 2011 RCT (PMID 21303441)](https://pubmed.ncbi.nlm.nih.gov/21303441/) — gut-brain axis, cortisol reduction | Keep |

---

## AGE_BOOSTS audit

| Entry | Evidence | Source | Action |
|---|---|---|---|
| 40+ CoQ10 (high) | Strong | [Kalén 1989 (PMID 2779222)](https://pubmed.ncbi.nlm.nih.gov/2779222/) — endogenous CoQ10 declines after 40, esp. heart/muscle tissue | Keep |
| 40+ Collagen (medium) | Moderate | Reichelt 2017 review — collagen synthesis declines ~1%/yr after 25 | Keep |
| 40+ Melatonin (medium) | Strong | [Karasek 2004](https://pubmed.ncbi.nlm.nih.gov/15582255/) — pineal melatonin production drops with age | Keep |
| 50+ Calcium (medium) | Strong | NIH ODS Ca fact sheet; bone density decline | Keep |
| 50+ Vitamin D3 (medium) | Strong | [MacLaughlin 1985 (PMID 2997282)](https://pubmed.ncbi.nlm.nih.gov/2997282/) — skin D synthesis halves between 20-70 | Keep |
| 50+ Magnesium (medium) | Moderate | Aging-associated absorption decline; intake drops | Keep |
| 60+ Creatine (medium) | Strong | [Candow 2019 review (PMID 30880668)](https://pubmed.ncbi.nlm.nih.gov/30880668/) — sarcopenia prevention | Keep |
| 60+ B12 (medium) | Strong | [Allen 2009 (PMID 19625697)](https://pubmed.ncbi.nlm.nih.gov/19625697/) — atrophic gastritis impairs B12 absorption in 30%+ of seniors | Keep |

**AGE_BOOSTS is fully evidence-grounded.** No removals.

---

## SEX_BOOSTS audit

| Entry | Evidence | Source | Action |
|---|---|---|---|
| female + Iron (max 50) | Very strong | Menstrual losses; CDC/NHANES data on iron deficiency in reproductive-age women | Keep |
| female + Methylfolate (max 45) | Very strong | [CDC 1992 NTD prevention recommendation](https://pubmed.ncbi.nlm.nih.gov/1522835/); folate critical preconception | Keep |
| female + Calcium | Strong | Bone density decline post-meno; Surgeon General 2004 report | Keep |
| female + Vitamin D3 | Strong | [Holick 2007](https://pubmed.ncbi.nlm.nih.gov/17634462/) — women have higher D-deficiency rates | Keep |
| female + Magnesium | Moderate | NHANES — women average lower Mg intake than men | Keep |

**SEX_BOOSTS is fully evidence-grounded.** No removals.

---

## Summary of recommended changes

### Hard removals (insufficient evidence basis)
1. `paleo → Vitamin B12` — paleo includes meat
2. `paleo → Vitamin D3` — no specific paleo-D link
3. `pescatarian → Vitamin B12` — fish/eggs/dairy provide adequate B12
4. `pescatarian → Zinc` — seafood is good Zn source
5. `mediterranean → Vitamin D3` — Mediterranean includes fatty fish
6. `mediterranean → Vitamin B12` — fish/dairy provide adequate B12

### Magnitude downgrades
1. `keto → Vitamin C`: medium → low (depends heavily on user food choices)
2. `keto → Probiotics`: medium → remove or low (only weak inferential evidence)
3. `pescatarian → Iron`: medium → low (still some justification but borderline)
4. `sun_very_little → Magnesium`: medium → low (mechanistic only)
5. `exercise_weight_training → Zinc`: medium → low (observational only)
6. `exercise_weight_training → Magnesium`: high → medium (sweat losses are real but magnitude=high overstates)
7. `exercise_cardio → Vitamin D3`: medium → low (indirect via reduced sun)
8. `exercise_cardio → Magnesium`: high → medium (same as resistance)
9. `stress → Vitamin B12`: medium → low or remove (weak evidence)
10. `stress → Zinc`: medium → low (acute-only signal)

### Magnitude reasonable
- `caffeine → Iron (low)` — magnitude=low correct given conditional relevance
- `alcohol → all entries` — strong evidence, magnitudes appropriate
- `40+ CoQ10 (high)` — appropriate
- `60+ Creatine (medium)` — appropriate

### No additions warranted yet
None of the supplements I considered for new boosts (Aged Garlic, more granular Ashwagandha entries, etc.) have sufficient scraped data yet. Wait for next cron after pubmed_scraper additions land.

---

## Net effect

If we apply all recommended changes: 6 entries removed, 10 magnitudes downgraded, 0 added. The boost maps shrink from ~50 entries to ~44, and the average magnitude drops slightly.

Most users won't notice (the dropped entries are paleo/pescatarian/mediterranean — diets that shouldn't have triggered many boosts anyway), but users on those diets will get cleaner recommendations.

The QA harness should be re-run before/after to confirm no top-3 regressions.
