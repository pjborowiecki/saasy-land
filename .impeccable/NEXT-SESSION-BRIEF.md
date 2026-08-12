# Next session brief — SaaSyLand landing

Do these in order. The awwwards-redesign workflow (film braking fix, system upgrade, section
redesign, integration) must be finished and verified first.

## 1. Verify the film braking fix independently

`_lib/film-progress.ts` now runs a constant-rate follower (`advanceFilmProgress`, `MIN_SPEED`
floor) instead of copying ScrollSmoother's exponentially-decaying eased position. Do not trust
a self-report. Probe the **deceleration phase** (last ~800ms after wheel input stops) at hero
~4%, line ~35%, gate ~95%, sampling the canvas `data-film-frame` attribute every animation
frame. PASS = no gap >60ms during deceleration AND gaps do not grow monotonically toward the
stop. Scripts to adapt: `<scratchpad>/canvascheck.mjs`, `envcheck.mjs`, `tail.mjs`.

## 2. Replace the weak imagery (Higgsfield MCP — available in a fresh session)

The owner's words: "amateur, template-like, stupid images". They are right.

- `public/images/saasyland_new1.webp` — generic AI factory illustration in the studio section.
  Decorative, proves nothing, reads as stock AI art.
- The page-designer "mock" in `studio-section.tsx` — grey wireframe boxes. Looks like a
  placeholder, not a product.

Replace with **product evidence**, not scenery:

- A real frame of the visual page designer with actual UI in it (best of all: a screenshot of
  the owner's real `/admin` page designer — real product beats generated imagery here).
- Something showing the masterclass: editor / terminal mid-run / CLI scaffolding a project.

Do NOT add more factory imagery — the film already carries the atmosphere and more competes
with it.

## 3. Add the missing sections (owner request)

Take the _ideas_ from the original page (https://preview.saasyland.com — behind Vercel SSO;
inventory below, read from the pre-redesign code), NOT its styling. Everything must obey the
redesign contract at `<scratchpad>/redesign-contract.md` and DESIGN.md.

Original inventory (pre-redesign, now deleted — recoverable from git history):

- **features** — 12 features in a 3-col grid; each card had a giant ghost icon at
  `opacity-[0.03]` top-right that rotated on hover. This is the hover effect the owner liked.
  Ids used: auth, db, stripe, email, seo, ui, i18n, typeSafety, quality, performance, vercel,
  blog. Copy still exists in git history of `pages.landing.json`.
- **benefits** — 2-col bento, 4 cards, colour-coded badges + images.
- **testimonials** — 3 staggered columns, 3 cards each, avatar initials + gradient fallback.
- **newsletter** — email input + subscribe (was decorative; wire it or omit the promise).
- **contact** — form + sidebar with email/location.

Requirements for the new sections:

- Reinvent the _form_ — do not ship same-size icon+heading+text cards (banned by craft-floor);
  find a structure that fits the factory/production-line world.
- Testimonials must be **labelled synthetic** or omitted until real ones exist. PRODUCT.md
  forbids inventing customers as fact.
- Newsletter: either wire a real action or drop it. A dead input is a broken promise.
- Every new string in `en-US/pages.landing.json` AND `pl-PL/pages.landing.json`
  (`bun run check:i18n` must pass).
- Add section ids only if the film curve / station rail / nav need them; if page length
  changes materially, re-tune `FILM_CURVE` in `scroll-film.tsx` (it maps scroll→film time and
  assumes the current section proportions) and re-measure frame density.

## 4. Expand the marketing (owner request: "why this is the best tool ever")

Use the positioning already in PRODUCT.md: 100% test coverage, zero vendor lock-in (Better
Auth over Clerk), go-global-day-one i18n, built-in visual page designer, professional-developer
masterclass, Bun/Elysia edge-native. Every feature stated as a financial or emotional benefit.
Add mid-page CTAs so the visitor can convert before the gate. Keep the senior-engineer voice —
no hype-bro tone. Claims must stay true: no invented customers, benchmarks, or prices beyond
the $249 / $399 / $899 tiers already recorded.

## Standing constraints

Token names frozen, no new tokens, landing committed dark, server components by default,
`pages.landing` is server-only i18n, strict lint (no magic numbers, sorted keys, max 20
statements, max 5 JSX depth, globalThis, no null). Verify: `bunx vp fmt && bunx vp lint`,
`bunx tsc --noEmit`, `bun run check:i18n`, `bunx vp test run`, `bunx playwright test e2e/specs
--project=chromium` (auth.spec sign-up failure is pre-existing), and
`node .agents/skills/impeccable/impeccable/scripts/detect.mjs --json "src/app/[locale]/(landing)"`.
