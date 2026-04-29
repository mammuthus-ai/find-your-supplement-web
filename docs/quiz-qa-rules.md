# Quiz QA — Heuristic Rules

The `npm run qa` harness (`scripts/quiz-qa.ts`) generates ~50 synthetic
personas and runs them through `buildRecommendations()`. Each persona's
top-3 output is checked against four heuristic rules. Issues are written
to `docs/quiz-qa-report.md`.

## Personas covered

- 21 single-symptom personas (one per Symptom enum value)
- 8 single-goal personas
- 9 single-diet personas
- 9 multi-symptom realistic combinations (joint+muscle, GERD+dry skin+joint
  pain, lipid panel, gut chaos, etc.)
- 4 fully-realistic personas (vegan female 35, statin male 60, athlete
  male 30, post-meno female 65)

## Heuristic rules

### unexpected-promotion (severity: medium)

**What it catches:** A supplement appears in the top 3 even though it has
zero matched symptoms AND zero matched goals against the user's quiz
input.

**Why it matters:** When the user has explicitly stated their concerns,
the engine should not promote unrelated supplements ahead of relevant
ones. Surfaces baseline-score / evidence-weight bias where a globally
popular supplement crowds out specifically relevant ones.

**Known false positives:** None yet — every hit so far has been a real
engine quirk (e.g. Methylfolate's high baseline evidence weight).

### irrelevant-primary-evidence (severity: medium)

**What it catches:** The cache entry the IntermediatePreview will surface
as the "Evidence: Strong for X" badge has a condition string that
neither maps to any of the user's picked inputs nor to any symptom this
supplement legitimately addresses.

**Why it matters:** Causes badge labels like "Strong for inflammation"
on a supplement (e.g. Probiotics) where inflammation isn't the
supplement's relevant action for the user. Misleads users about the
strength of the recommendation.

### reason-mentions-unpicked-symptom (severity: high)

**What it catches:** A `RecommendationReason` of type 'symptom' has a
label that references a symptom the user did not pick. Example: card
shows "Addresses symptom: dry_skin" when the user only picked joint_pain.

**Why it matters:** Direct UI lie — the user immediately sees a
contradiction between their answers and the explanation.

### all-grade-d (severity: low)

**What it catches:** All three top-3 supplements have evidence grade D.

**Why it matters:** Likely cache miss — the user's combination produced
recommendations the cache has no useful data on, which usually means
the cache needs an entry added.

## Adding new rules

1. Add a heuristic in `scripts/quiz-qa.ts` under the comment "RULE N".
2. Document it here.
3. Severity:
   - `high` — direct UI lie or broken behavior; non-zero high count
     fails CI (script exits non-zero).
   - `medium` — algorithm quirk worth investigating but not user-visible
     enough to block.
   - `low` — informational.

## Adding new personas

Edit `generatePersonas()`. Add to one of the existing groups or create
a new one. Aim for personas that mirror real user funnels — combinations
your funnel analytics show users actually pick.
