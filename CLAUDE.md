# Find Your Supplement — site repo notes

This repo is the deployed static Next.js export for findyoursupplement.co
(served from the `gh-pages` branch). There is no site source tree here;
edits are made directly to the built output.

## Blog post rules

- **All blog posts must be a 5 minute read or less** (≤ ~1,000 words of
  visible text at 200 wpm; label the read time as `ceil(words / 200) min read`).
- Categories: Deep Dives, Guides, Research Reviews, Nutrition Science.
- Cite real sources (NIH ODS, PubMed, major clinics); Amazon links use the
  `mammuthus-20` affiliate tag; include Take-the-Quiz CTAs linking `/quiz`.

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
