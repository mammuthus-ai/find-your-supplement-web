# Find Your Supplement — site repo notes

This repo is the deployed static Next.js export for findyoursupplement.co
(served from the `gh-pages` branch). There is no site source tree here;
edits are made directly to the built output.

## Blog post rules

- **All blog posts must be a 5 minute read or less** (≤ ~1,000 words of
  visible text at 200 wpm; label the read time as `ceil(words / 200) min read`).
- Categories (each with its own chip color, applied via inline style):
  Deep Dives (one nutrient/problem, teal `#0d9488`), Guides (goal/audience
  roundups, blue `#2563eb`), Research Reviews (evidence verdicts and
  head-to-head comparisons, magenta `#a21caf`), Nutrition Science (diet and
  mechanism context, amber `#b45309`). Chip background = same hue at 0.1 alpha.
- Cite real sources (NIH ODS, PubMed, major clinics); Amazon links use the
  `mammuthus-20` affiliate tag; include Take-the-Quiz CTAs linking `/quiz`.

## AI illustration quality check (MANDATORY before publishing any image)

Visually inspect every generated image at full size before it ships — a
three-armed woman made it to production once. Check, deliberately:
1. Human anatomy: count arms, hands, and legs; look for extra/missing limbs,
   mangled hands or fingers, distorted or duplicated facial features.
2. Objects merging into people or each other, floating disconnected parts.
3. Any text, letters, numbers, or logo-like marks (images must contain none).
4. Smearing or garbled regions.
Regenerate failures (simplify the pose in the prompt — e.g. one object in one
hand — rather than adding negative instructions) and re-inspect the
replacement before converting and publishing. Prompts that pose people
holding or comparing multiple objects are the highest-risk category.

## Shared to-do list

The user keeps a cross-session to-do list in `TODO.md` on the `todo` branch
of this repo (deliberately kept off `gh-pages` so it is never published to
the live site). When the user asks to add, complete, or show to-dos in ANY
session, operate on that file: `git fetch origin todo`, read
`origin/todo:TODO.md`, apply the change (date new items, move finished ones
under Done with their completion date), commit on the `todo` branch, and
push. A scheduled Routine emails the user a report of this list daily at
7:00 AM ET — do not delete or restructure the Open/Done headings it parses.

## Adding or editing a blog post (built-output mechanics)

Each page stores its content in THREE places that must stay consistent, or
React hydration reverts the visible content:

1. the HTML markup in `blog/<slug>/index.html`,
2. the inline `self.__next_f.push([1,"0:..."])` RSC payload in that same
   file (JS-escaped; `<`, `>`, `&` appear as `<`, `>`, `&`),
3. `blog/<slug>/index.txt` (raw RSC flight file used for client-side nav).

A new post must also be added to: `blog/index.html` + `blog/index.txt`
(card grid, newest first), the homepage `index.html` + `index.txt`
("latest 3" cards with alternating `border-t-grade-b` / `border-t-teal`),
and `sitemap.xml`. Use an existing article as the byte-level template and
verify by serving the site and loading pages in headless Chromium
(`/opt/pw-browsers/chromium`), checking for hydration errors and that
content survives after hydration.
