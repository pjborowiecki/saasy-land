---
name: SaaSyLand
description: Production-grade SaaS starter — an instrument for people who intend to read every line.
colors:
  primary: "oklch(0.985 0 0)"
  primary-foreground: "oklch(0.18 0.006 265)"
  background: "oklch(0.168 0.005 265)"
  foreground: "oklch(0.977 0.002 265)"
  card: "oklch(0.204 0.006 265)"
  muted: "oklch(0.246 0.007 265)"
  muted-foreground: "oklch(0.715 0.012 265)"
  border: "oklch(1 0 0 / 10%)"
  ring: "oklch(0.775 0.108 199)"
  destructive: "oklch(0.704 0.191 22.216)"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 5.8vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.038em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 3.2vw, 2.625rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.032em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "-0.012em"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "-0.004em"
  label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0.08em"
rounded:
  none: "0px"
  control: "0.625rem"
  panel: "0.875rem"
  full: "9999px"
spacing:
  gutter: "1.5rem"
  intro: "1.25rem"
  block: "3.5rem"
  section-y: "6rem"
  section-y-lg: "8rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.control}"
    height: "2.75rem"
    padding: "0 1.25rem"
  button-primary-hover:
    backgroundColor: "oklch(0.985 0 0 / 88%)"
    textColor: "{colors.primary-foreground}"
  button-outline:
    backgroundColor: "oklch(0.204 0.006 265 / 60%)"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    height: "2.75rem"
    padding: "0 1.25rem"
  spec-chip:
    markColor: "{colors.ring}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
  card-panel:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.panel}"
    padding: "1.75rem"
    border: "1px solid {colors.border}"
---

# Design System: SaaSyLand

## Overview

**Creative North Star: "The Instrument"**

SaaSyLand sells a codebase whose entire pitch is that every claim about it is checkable, so the
product is designed as an instrument rather than as an advertisement. It states measured facts in
monospace, shows the real admin rather than a mockup of one, and cites where in the repository
each number comes from. Nothing is decorated; everything is stated.

The world is one cold near-black ground with exactly one hue of chroma in the entire palette. The
primary action is monochrome — near-white on dark, near-black on light — so it is loud because of
contrast rather than because of colour. The single chromatic token, `--ring`, is spent only on
state: focus, liveness, verification, progress. If something is cyan, the interface is telling you
a fact about right now.

The marketing site and the console share the palette, the type ramp and the radius scale, and
differ only in density. The landing commits to dark and renders inside a `.dark` wrapper; the app,
the admin and the docs follow the visitor's theme.

**Key characteristics:**

- One near-neutral ramp, hue-locked to 265, plus one chromatic token
- Monochrome primary: contrast carries the action, never colour
- Hairlines are the only structure; no box-shadows anywhere in the system
- One family across the whole type ramp; size, weight and optical tracking carry the hierarchy
- Mono = measured: Geist Mono appears only on real numbers, specs and system output
- Motion is subtractive: one entrance, one hero timeline, one marquee, and 200ms state changes
- Every motion device ships its reduced-motion path in the same component

## Colors

A near-monochrome cold ramp with a single cold accent. Almost every square inch is a blue-grey
near-black or a near-white, so the cyan reads as an instrument light.

### Primary

- **Paper White** (`--primary`, dark: `oklch(0.985 0 0)`; light: `oklch(0.19 0.006 265)`): the
  primary action, and the highest-contrast thing on the surface. It inverts with the theme, so the
  CTA is equally loud in both. Its text pair is `--primary-foreground`.

### Accent

- **Signal** (`--ring`, dark: `oklch(0.775 0.108 199)`; light: `oklch(0.58 0.106 208)`): the only
  chroma in the palette. It carries focus rings, the nav's active dot, spec-chip ticks, feature
  checks, live indicators, the "active"/"published"/"public" states, the chart's lead series and
  the selection outline in the page designer. `--sidebar-ring` and `--chart-1` share its value.

### Neutral

- **Ground** (`--background`, dark `oklch(0.168 0.005 265)`): the page floor. Not black: pure black
  has nothing underneath it, so a scrim, an inset well or a pressed state has nowhere to go.
- **Panel** (`--card`, `oklch(0.204 0.006 265)`): one step up. Cards, terminals, the featured
  pricing column, the winning comparison column.
- **Well** (`--muted`, `oklch(0.246 0.007 265)`): the lightest step. Hover fills, inset chips,
  initials tiles. `--secondary` shares its value.
- **Foreground** / **Muted foreground**: headings and emphasis / body copy and secondary labels.
- **Hairline** (`--border`, `oklch(1 0 0 / 10%)`): every border, divider and track. White-alpha, not
  a solid grey, so it holds its relationship to every surface it crosses. `--input` sits at 13%.
- **Alarm** (`--destructive`): error and banned states only.

### Named rules

**The One Chroma Rule.** `--ring` is the only token in the palette carrying chroma above 0.02, and
it is spent exclusively on state. It is never a decorative fill, never a gradient, never a brand
flourish. Semantic status adds exactly two more colours in the console: a desaturated amber for
"waiting on somebody" and `--destructive` for failure. Everything else is neutral.

**The Monochrome Primary Rule.** The primary action never takes the accent. Making the CTA cyan
would put the loudest colour on the page in competition with every state indicator, and both would
lose. Contrast is the CTA's whole job.

**The Token-Only Rule.** Landing styling uses only the semantic tokens defined in
`src/presentation/styles/globals.css`. Token values may be retuned, token names may not change, and
no token may be added. Components never carry raw hex/oklch values; the only permitted derivation is
an alpha modifier on a token (`bg-card/60`, `text-foreground/70`, `bg-ring/10`).

**Read `--border`, never `--color-border`, in authored CSS.** Tailwind's `@theme inline` declares
`--color-border: var(--border)` on `:root`, and a custom property that references another resolves
at the element it is declared on. `--color-border` therefore computes once against the light palette
and every `.dark` descendant inherits that resolved value, which is how the background grid ended up
drawing near-black lines on a near-black ground.

## Typography

**One family:** Geist (`--font-sans`), for everything from 11px labels to 72px display.
**Mono:** Geist Mono (`--font-mono`), for measured facts only.
`--font-heading` survives as a role and currently resolves to Geist, so a display face can return
later without touching a call site.

A separate heading family buys a second voice and charges a second download for it. Size, weight
and optical tracking carry the hierarchy instead, which is the only way 15px body and 72px display
read as one document.

**Optical tracking.** Tracking tightens as size grows and loosens as it shrinks: display runs to
-0.038em, body sits near zero, and only mono opens up, because monospace glyphs already carry their
own sidebearings.

### Hierarchy

- **`text-display-hero`** (600, clamp 2.75–4.5rem, 1.02): the hero H1, two lines maximum.
- **`text-display-gate`** (600, clamp 2.25–3.5rem, 1.06): the closing screen and the manifesto's
  conclusion.
- **`text-display-blast`** (600, clamp 1.75–2.375rem, 1.22): the page's one oversized pull
  statement, used once, in the pricing ledger.
- **`text-headline-peak`** (600, clamp 1.875–2.625rem, 1.1): every section H2.
- **`text-headline-support`** (600, clamp 1.375–1.75rem, 1.2): pillar and card headings, dashboard
  metric values.
- **`text-price`** (600, clamp 2.125–2.625rem, 1): prices and large figures. Always `tabular-nums`.
- **`text-title`** (600, 1rem): card, row and panel titles.
- **`text-statement`** (500, clamp 1.125–1.375rem): lead statements, and the admin page title at
  `font-semibold`.
- **`text-lead`** (1.0625rem) / **`text-body`** (0.9375rem) / **`text-body-sm`** (0.875rem): copy.
- **`text-spec`** (mono, 0.75rem): measured facts, terminal output, file paths.
- **`text-label`** (mono, 0.6875rem, 0.08em, uppercase): micro-labels and column headings.

### Named rules

**The Mono Means Measured Rule.** Geist Mono appears only where a real measurement, spec, path or
system output is being quoted. If it is in mono, it must be true and quantified.

**The Eyebrow Budget.** `text-label` above a headline is rationed to one per three sections. At
0.08em, not the 0.2em an eyebrow usually gets: past that a label stops being a label and becomes a
decoration.

## Layout

**The frame.** `PageFrame` draws the content measure as two fixed hairlines at the edges of
`max-w-7xl`, running the full viewport height at `lg` and above. Every section draws its own
full-bleed `border-t` across them, so thirteen separately authored sections read as one continuous
drawing. The frame sits at `z-20`, above the sections: any section that paints a background would
otherwise cover the rules, and every section's content is inset by the gutter, so the rules land on
empty margin and never cross a word.

- **Containers:** `max-w-7xl` with `px-6 md:px-10`. Sections pad `py-24 md:py-32`.
- **Full-bleed bands** (the proof band, the stack strip) drop the gutter so their cells meet the
  frame rules exactly; their internal rules are drawn with `gap-px` over a hairline ground, which is
  the only construction that stays correct through every reflow.
- **Section anchors:** `#floor`, `#manifesto`, `#line`, `#quality`, `#studio`, `#pricing`, `#faq`,
  `#gate`. These are load-bearing for the nav, the footer and any external link; do not rename them.
- **Section order is the argument:** show the product, count what is in it, name what it runs on,
  state the problem, prove the four claims that answer it, hand over the receipt, then ask for money.
- **No two adjacent sections share a layout family.** Thirteen sections, thirteen shapes: hero,
  stat band, marquee, statement, lattice, split-with-terminal, ledger, media cards, receipt,
  comparison, priced frame, sticky FAQ, closer.
- **Console:** a 16rem sidebar and a 3.5rem header, matched in height so the two chrome bars form
  one line. Content pads `px-4 pt-5 pb-6 md:px-6 md:pt-7 md:pb-8`. Full-bleed pages break out with
  matching negative margins, so `admin/layout.tsx` and `admin/users/layout.tsx` change together.

## Elevation & depth

Flat. There are **no box-shadows** anywhere in the system. Depth comes from three places: the
hairline border, the one-step surface ramp (ground → card → well), and the field.

**The Field.** The page's only background texture: a 64px hairline grid, radially masked so it is
present at the margins and gone under the type, plus one cold wash of `--ring` at 15% alpha. It
appears exactly twice on the landing — behind the hero and behind the closing screen — which marks
the two moments where the page is asking rather than explaining. Both layers are painted on fixed,
`pointer-events-none` elements; a masked gradient attached to a scrolling box is a repaint every
frame.

**The Hairline Rule.** The only permitted edge treatment is `border-border` at 1px. No box-shadows,
no glows, no glassmorphism panels, no gradient fills. Gradients exist only as the field's radial
wash and as the marquee's edge scrims.

**The Blur Exception.** The fixed nav's `backdrop-blur-xl` over `bg-background/72`, and the admin
header's over `bg-background/80`. Those are the only two blurs in the system, earned because content
scrolls directly beneath fixed chrome.

## Shapes

One radius scale, rooted at `--radius: 0.625rem`.

- **Controls** (buttons, inputs, the nav CTA): `rounded-lg`, 10px.
- **Panels** (cards, framed media, the pricing grid, the terminal): `rounded-xl`, 14px.
- **Chips, badges, initials tiles, small controls:** `rounded-md`, 8px.
- **Marks and ticks:** `rounded-xs`. **Status dots and the accent dot:** `rounded-full`.

**The Square Tick Rule.** A measured fact is marked by a 5px accent square, not a glyph icon. Stroke
icons are reserved for directional affordances and real semantics (arrow, check, copy, search) and
are drawn at `strokeWidth={1.5}` for chrome and `2`–`2.25` for small marks. There are no decorative
feature icons anywhere.

## Components

### Concept loops

Eight short, silent, seamless videos rendered from `remotion/` and embedded where the page makes a
claim that is easier to show than to say: the console in the hero, the four cells of "The line", the
terminal in "Quality control", the builder in "Studio" and the audit in "Record". Each is drawn on
the exact token of the surface it sits in, so it has no visible edge of its own; the hairline under
a band is the lattice's, not the video's.

**Film cannot sit beside a control.** A loop depicts a claim; it cannot depict state. The CLI
section's run is markup and not video for precisely this reason: its module list has to lose
`billing` the instant the matrix next to it says `Billing: None`, and a rendered frame cannot.

They obey the same motion rule as everything else. Every loop illustrates a claim the surrounding
heading, body and spec chip already state in full, which is why they are `aria-hidden` and why
reduced motion simply keeps the poster: the content is complete without them. `preload="none"` plus
an IntersectionObserver means nothing is fetched until a loop is near the viewport and nothing is
decoded while it is off-screen, and the four in the lattice are seeded at two-second offsets so
they read as four instruments rather than one blinking grid.

**The Matched Ground Rule.** A loop's background colour is the token of the element it is embedded
in, not "dark". Get it wrong and the video reads as a lighter rectangle pasted onto the page, which
is the one thing these must never look like.

### The product surface (signature)

The hero's frame is a real bezel around a real screenshot of the admin this repository ships,
captured from the running app. Its title bar is the install command with a working copy button
rather than three decorative window dots: a page selling a codebase should let you start it. The
image is deliberately allowed to run past the fold, and on a phone it is enlarged and clipped to its
left third so the rail and the figures stay legible rather than collapsing into a smudge.

**No div-based product mockups.** If there is no real screenshot for a slot, the slot gets no
picture — see the blog cards, which lost six pastel rectangles for exactly this reason.

### The spec chip

A 5px accent square followed by a monospaced measurement. It appears only against a real,
quantified claim, which is what keeps the one chromatic token meaning something.

### The proof band

Five measured facts in a `gap-px` lattice, spanning the frame, mono labels over `tabular-nums`
figures. Every figure here is generated by the repository being sold and cited by the Record
section, which is the only thing that entitles a landing page to a row of big numbers.

### Terminal card

Real output from the repository, quoted verbatim: `rounded-xl`, `bg-card`, a header row with a live
accent dot and a mono title, and a `<pre>` body with accent ticks. Terminal text is code, not copy;
it is hardcoded English by design, because a localised test summary would be a fabricated one.

### Pricing grid

One bordered frame, tiers divided by internal hairlines, never three floating cards. The featured
tier is marked by `bg-card` and a mono chip; it is not taller, not scaled and not glowing. `whoFor`,
`tagline` and the price sit in min-height blocks so the three feature lists begin on one line and
the three CTAs end on another, whatever a given locale's copy does.

### Comparison

A responsive grid, not a scrolling table. Below `md` the three columns stack per dimension and each
value carries its own small label; from `md` up the winning column is marked by fill. A comparison
whose second column is off-screen behind a horizontal scrollbar is not a comparison.

### Navigation

Transparent over the hero, materialising into `bg-background/72 backdrop-blur-xl` once the document
has moved. The state comes from an IntersectionObserver on a 1px sentinel, not a scroll listener.
The active section is marked with a 3px accent dot under the label. The bar's CTA is an outline: the
hero owns the one filled surface above the fold, and on a phone the bar drops the CTA entirely.

### Console chrome

A 16rem rail with mono group labels, 32px rows, and an active state of a subtle fill plus the icon
turning to the accent. The header carries the trail and a real ⌘K command palette that navigates
from `SIDEBAR_CONFIG`, so the palette and the rail can never disagree about what the console
contains. There is no notification bell: there is no notification system, and a console with a dead
control in its chrome cannot be trusted about the controls that are alive.

### Status

Three meanings and nothing decorative, resolved centrally in `admin/_lib/status-colors.ts`:
the accent for live/verified/published/public, a desaturated amber for waiting, `--destructive` for
failure, and neutral for everything else. Badges are hairline pills with a low-alpha wash and a dot;
a filled badge on a dark console is a light source, and a table of them is a christmas tree.

### Identity tiles

Two initials in a `rounded-md` neutral tile, in the sidebar, the tables and the blog cards.
Never a hashed gradient and never a generic person glyph: identity comes from the letters.

## Motion

`Reveal` is the page's one generic scroll entrance: IntersectionObserver at threshold 0.12,
one-shot, three ranks (`heading` / `block` / `quiet`), travel of 12–16px over 420–700ms on
`--ease-exp`. Twelve pixels, not thirty-two: at 32px the block is visibly somewhere else before it
is where it belongs, and the eye reads the motion instead of the content.

The hero entrance is four CSS enter animations with staggered delays and **no JavaScript at all**.
The headline is the LCP element; animating it from a timeline would hide it until hydration and push
the largest paint past the point where the visitor has already decided.

**Motion must be motivated.** Every animation in the system answers one of: hierarchy, sequence,
feedback, or state. The marquee is the page's only infinite loop, and it pauses under a pointer, a
focused descendant, or reduced motion. There is no scroll hijack, no pinning, no parallax and no
smooth-scroll library.

**The Reduced-Motion Parity Rule.** Every motion device ships its static path in the same component.
A reduced-motion visitor gets the complete page, minus nothing but movement.

## Do's and Don'ts

### Do

- **Do** style exclusively with semantic tokens; the only permitted derivation is an alpha modifier.
- **Do** read `var(--border)` in authored CSS, never `var(--color-border)`.
- **Do** spend `--ring` on state and nothing else.
- **Do** mark every quantified claim with the spec chip, and only quantified claims.
- **Do** keep figures in `tabular-nums` so columns hold still while data changes.
- **Do** give every new motion device a reduced-motion path that shows the full content statically.
- **Do** give every full-bleed band `gap-px` internal rules so it reflows correctly at every width.

### Don't

- **Don't** use box-shadows, glassmorphism, gradient fills or gradient text. Blur belongs to the two
  fixed chrome bars and nowhere else.
- **Don't** introduce colours outside the token set, add tokens, or rename existing ones.
- **Don't** give the primary action the accent, or give a decorative element any chroma at all.
- **Don't** build a product preview out of styled `<div>`s, and don't fill an empty media slot with
  a tinted rectangle.
- **Don't** put more than one `text-label` eyebrow in three sections.
- **Don't** hash a colour from an id. If the colour carries no information, it is noise.
- **Don't** ship a control that does nothing: a search field that does not search and a bell that
  opens nothing cost more trust than they buy.
