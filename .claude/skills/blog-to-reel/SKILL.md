---
name: blog-to-reel
description: >
  Turn a Find Your Supplement blog post into a finished vertical video for
  Instagram Reels, YouTube Shorts, or TikTok using the Higgsfield MCP tools.
  Use this skill whenever the user asks for a reel, short, TikTok, vertical
  video, "video version" of a post, or to run the blog-to-video pipeline on a
  new or existing article — even if they don't name a platform. It locks the
  channel's established look (Editorial Motion Graphics collage, muted
  monochrome with per-beat color highlights), the fast gap-free narration
  standard, caption rules, and the hard-won production fixes from the first
  runs — while requiring fresh assets and a new visual concept for every
  video so the feed never repeats itself.
---

# Blog post → Reel/Short (Find Your Supplement channel)

Produces ONE vertical MP4 (9:16, 2K) with narration and burned captions from a
blog post in this repo, delivered as a confirmed Higgsfield hosted URL.

The production machinery is Higgsfield's `faceless-video` workflow. **Always
load it first** — `get_workflow_instructions({workflow:"faceless-video"})` —
and follow its phases, gates, and batch/sandbox contracts as the source of
truth. This skill layers the CHANNEL DECISIONS on top: what this channel has
already chosen, so intake rounds close instantly and video #N looks like
video #1. Where this file and the workflow's creative defaults disagree
(style palette, voice, caption placement), this file wins; its safety and
mechanical gates always stand.

## Locked intake (state these, don't re-ask)

- **Type:** Explainer · **Mode:** animated · **Aspect:** 9:16 · **Subtitles:** on · **Thumbnail:** no (Reels/Shorts don't use custom thumbnails)
- **Duration: flexible — fit it to the topic.** There is no fixed one-minute
  rule. A tight single-nutrient post can be 30–40s; a dense roundup can run
  90s+. Pick N = duration/10 blocks (minimum 3, one narration line per 10s
  block) so the story fills the time rather than padding or cramming. Say the
  chosen length out loud with one line of reasoning.
- **Topic:** the blog post the user names. Reuse its citations as the script
  manifest's `sources` (the validator requires absolute URLs).

## Channel DNA (reuse verbatim)

**Style — "Editorial Motion Graphics, muted multi-accent variant".**
Base preset card `56fc6472-33b7-45dc-83ff-80c71d40aec6` (resolve with
`resolve_explainer_preset`) plus the canonical donor
`https://cdn.higgsfield.ai/youtube_faceless_preset_image/306ee0a1-58e7-43c8-9cee-0493702e5e6b.webp`.
The channel deviates from the stock one-accent formula on purpose: the user
wants a quiet monotone collage where ONLY the emphasized element of each beat
carries color. Style formula to paste byte-identical into every asset/block
prompt:

> flat editorial documentary collage on a warm cream paper stage with subtle
> fiber grain: muted monochrome halftone archival photo cutouts with rough
> white keylines, torn paper edges and tape strips, soft paper drop shadows,
> subtle print misregistration on inked elements — the base world stays quiet
> and monotone — while each emphasized element pops in its own single vivid
> flat accent color, and only emphasized elements carry color — snappy
> staggered spring motion with slight overshoot, non-photorealistic
> illustrated collage, never live-action

**Emphasis color map** (one highlight hue per beat, named explicitly in each
block's PALETTE LOCK — an emphasis element left in the base petrol reads as
"no highlight", which the user specifically corrected):
- **Coral red** — the problem/symptom beats (itch annotations, body-map pins, crack strokes)
- **Mustard gold** — data/gauge highlights (gauge dot fills and drains, arrows, spark dots)
- **Petrol blue** — structural base only (discs, the vial's liquid) — matches the site's teal brand
- **Forest green** — the payoff check stroke

**Voice — pick per video, suggest before locking.** Archie
(`voice_id: bd072316-f77c-588b-b6e5-e46b9b03d008`, `voice_type: preset`) is
the incumbent, but the user wants a suggestion when a different voice suits
the topic better (e.g., a warmer female voice for a sleep or pregnancy post):
open the `list_voices` picker, name your recommendation and why, and let the
user decide. Engine per the workflow (`text2speech_v2` /
`variant: elevenlabs`). Delivery bracket, verbatim on every line and KEPT
SHORT: `[upbeat energetic health explainer, fast lively pace]` — see the
bracket-leak gotcha below for why short matters. **The read should be FAST:**
prefer takes in the 2.5–2.9 words/sec range (2.9 is the validator's hard
ceiling — never exceed it); a take that ambles below ~2.3 wps is worth one
re-roll even when its length passes.

**Pacing — punchy, with NO dead air.** Five ~2s hard-cut shots per block per
the workflow, choreography aggressive: elements slam/whip/stamp in with hard
overshoot, rapid staggered entrances, two impact beats per block, "quick
push-in"/"whip pan" instead of gentle drifts. The user rejected the calmer
first cut as too slow. **Audio gaps at block seams are a known complaint:**
the assembler centers each line inside its fixed 10s block, so a line that
speaks only 8s leaves ~1s of silence on each side of every seam. Target
speech at the TOP of the window — 9.0–9.5s — by writing full 22–23-word
lines and re-rolling takes that land short (7.8–8.5s is "pass" to the gate
but sounds gappy). Check every take's measured `speech` value against this
tighter target before assembly, not just the gate's floor.

**Fresh visuals every video — do NOT reuse assets from earlier videos.** The
style formula and color logic are the only things carried over; the cast,
locations, props, and through-line are invented new for each post so the feed
never feels like the same video re-skinned. Be creative: derive the visual
concept from the post's own subject (a magnesium post might live on a night
sky plate with a filling moon; a gut-health post inside a torn-paper stomach
diagram). Generating a full new asset roster each time is an accepted cost —
the user explicitly prefers spend over sameness.

Within a single video, variety is also a rule, not a preference:
- **No plate or composition appears twice.** Give every block its own
  location/setting — the workflow's "≤2 consecutive blocks per location" is a
  floor; this channel wants zero repeats (a repeated graphic mid-video was
  called out specifically). Skip the coverage-revisit pattern entirely.
- Still give every video ONE physical **through-line prop** that escalates
  each block and resolves in the payoff — the through-line recurs by design;
  it is the backgrounds and compositions that must not.

Character sheets go on a completely plain cream field — background collage
clutter on a sheet once carried pseudo-text into risk territory.

## Script & caption rules

- Hook's first sentence ≤8 words; one idea per block; write FULL 22–23-word
  lines (the validator's band is 20–23 — stay at the top so the audio fills
  its block; see the dead-air rule above). Spoken lines write numbers as
  WORDS so the TTS pronounces them ("B twelve", "twenty nine percent").
- **Every shot illustrates the words being spoken during it.** Before
  submitting a block, read each SHOT beat against the block's vo_line: if the
  line says "nerves misfire", the shot shows sparks on nerves — not a torn
  paper edge peeling for texture's sake (a real complaint: a decorative shot
  landed mid-line with no relation to the narration). Decorative flourishes
  are allowed only as entrances/exits for the thing the line names.
- **No "take our quiz" CTA in the narration** — the user removed it. CTAs
  belong in the post caption/description, not the audio.
- When naming the tests to get, the post's first-line trio is ferritin, B12
  and vitamin D; include zinc when the words fit (the user asked for it).
- **Maintain a second, caption-only manifest**: same blocks, but vo_lines use
  numerals — "B12", "omega-3s", "vitamin D", "29 percent". Pass THIS one as
  `--script` to the caption step; the spoken manifest drives validation,
  takes, and assembly. Write "percent" as a word: the caption aligner
  silently strips a literal "%" and ships a bare number.
- **Captions:** `clean` look, burned with `burn_caps_clean.sh --marginv 65`
  (≈23% up the 288-unit grid) so they clear the Reels/Shorts UI overlay.
  Never ≥90 (mid-frame).

## Production gotchas (each cost a debugging round — check them proactively)

1. **TTS bracket leakage masquerades as a "slow" take.** If a take measures
   overlong at ~1.5 words/sec, transcribe it (tiny faster-whisper in the
   sandbox) before rewriting the text — the audio may literally be speaking
   the delivery bracket ("warm dry timbre, lively pace…"). Fix: shorten the
   bracket, not the line. Transcribe-verify every take batch; length gates
   alone miss this.
2. **ffmpeg inside `while read` loops eats stdin** and corrupts the next URL
   ("Protocol 'ttps' not supported"). Use `ffmpeg -nostdin` and/or feed curl
   `< /dev/null`.
3. **Guarded re-downloads reuse stale files.** The sandbox can outlive a call
   (background lease), so `[ -s file ] || curl …` happily keeps an OLD take
   after a retake. `rm -f` the regenerated indices before the guard loop.
4. **Caption timing needs the assembler's voice names.** The sidecar refers
   to `v_000.wav…v_00N.wav`; rebuild those from the take mp3s (de-click
   ffmpeg recipe from the narrator workflow) into the `--voice-dir` before
   `audio_to_captions.py`, in the same sandbox call.
5. **The H3 preset recommender intercepts first submissions.** Resubmit with
   `declined_preset_id` from the error (seen: `5a77643c-b6cc-4efd-bdc6-ab8ff48dfa82`).
6. **Visual QC is mandatory** (repo CLAUDE.md rule): inspect the style key,
   every asset, and first/last block frames at full size — count limbs and
   fingers, hunt stray text/numerals, check the emphasis colors actually pop.
   Cheaper to regenerate one image than a paid block.
7. **Deliver to a FRESH upload slot on every revision** (media_upload →
   same-call PUT → media_confirm). Re-PUTting an already-served URL risks CDN
   caching the old bytes.
8. **Revisions are cheap if scoped:** a line edit = one take + caption re-run
   on the preserved clean master; a recolor = only the affected blocks. Never
   rebuild everything for a caption or wording change.

## Delivery

Hand back the confirmed hosted MP4 URL with a one-line spec summary
(length, voice, caption style, what changed). Offer, don't auto-run: 4K
Topaz upscale, bolder caption style, TikTok publishing, next post.
