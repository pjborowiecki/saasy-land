# Concept loops

The landing page's eight animated assets, authored in [Remotion](https://remotion.dev) and rendered
to video in `public/motion/`.

This project is **not part of the app build**. It has its own `package.json`, its own React and its
own `tsconfig.json`, and it is excluded from the app's TypeScript program (`tsconfig.json`), from
`vp check` (`vite.config.ts` → `ignorePatterns`) and from deployment (`.vercelignore`). Nothing in
`src/` imports from here; the only thing that crosses the boundary is the rendered output.

## What each loop is for

Files are kebab-case, like the rest of the repository. Composition ids match their filename, their
rendered output and the `name` passed to `<ConceptLoop>`, so there is one string per loop and no
mapping to remember. Only the exported React components are PascalCase, because JSX requires it.

| Id              | Component      | Sits in                    | Draws                                                        |
| --------------- | -------------- | -------------------------- | ------------------------------------------------------------ |
| `app-tour`      | `AppTour`      | Hero → product bezel       | The console toured from dashboard to analytics and back       |
| `cost-curve`    | `CostCurve`    | The line → auth cell       | Metered pricing curving away from a bill that stays at `$0`   |
| `merge-gate`    | `MergeGate`    | The line → tests cell      | Commits reaching the coverage gate; the broken one stopped    |
| `locale-format` | `LocaleFormat` | The line → i18n cell       | One number and one date re-formatted by `Intl` per locale     |
| `scaffold-cli`  | `ScaffoldCli`  | The line → edge cell       | The CLI answering a prompt and writing the repository's tree  |
| `coverage-run`  | `CoverageRun`  | Quality control → terminal | `bun run test:coverage`, printing and counting to 100         |
| `page-designer` | `PageDesigner` | Studio → builder card      | Alignment and padding cycling, with the canvas answering      |
| `record-audit`  | `RecordAudit`  | Record → under the receipt | Each claim resolving to the file it is read out of            |

Loops are placed at page positions 1, 6, 7, 9 and 10 of 14. The last four sections (Compare,
Pricing, FAQ, Gate) are deliberately still: they are decision-making surfaces, and motion beside a
price or a CTA competes with the decision rather than supporting it.

**Film cannot sit beside a control.** The CLI section (position 5) had a `stack-run` loop for
exactly one afternoon. The moment the choice matrix beside it became interactive, the video was
asserting `✓ billing` next to a matrix the visitor had just set to `Billing: None`, and a rendered
frame cannot answer for a state it was rendered before. Its run is markup now, staggered in CSS.
The test is simple: if a visitor can change the thing a loop depicts, the loop has to be markup.
Remotion is for claims the page makes, not for state the page holds.

## Rules these follow

**The ground must match the surface.** `Plate` takes a `ground` colour, and it has to be the exact
token of the element the video is embedded in: `--background` for the four bands (they sit at the
head of a cell in the lattice), `--card` for the terminal (it sits inside a card). A mismatch shows
up immediately as a lighter rectangle pasted onto the page.

**Tokens are mirrored, not imported.** `src/theme.ts` is a copy of the `.dark` values in
`src/presentation/styles/globals.css`. If a token is retuned there, retune it here and re-render.

**Nothing is invented.** Every figure on screen is one the page already stands behind: 140 test
files, 1284 tests, 54 locales, 195 timezones, four coverage rows at 100. The metered-pricing curve
in `cost-curve` is deliberately unlabelled and unscaled, because putting a dollar figure on it would
mean quoting a competitor's price sheet.

**A loop must never look like a reload.** This is the rule the first version of the hero broke, in
two ways at once: its poster showed a finished console while the video started from an empty one,
and it rebuilt itself from nothing on every repeat. Both read as the page refreshing.

So for anything that depicts a product surface, the last frame must be *byte-identical* to the
first, `seam` must be off, and the poster must be frame 0. Check it:

```bash
npx remotion still app-tour /tmp/a.png --frame=0
npx remotion still app-tour /tmp/b.png --frame=599   # durationInFrames - 1
shasum -a 1 /tmp/a.png /tmp/b.png                   # the two hashes must match
```

That constraint is why `app-tour` is a tour rather than an assembly, and why `page-designer` cycles
its alignment left, centre, right and back rather than editing once and snapping.

For the small data bands (`cost-curve`, `merge-gate`, `locale-format`, `scaffold-cli`,
`coverage-run`, `record-audit`) the `Plate` seam is still used: those replay a measurement, a replay is what the
viewer expects, and their posters are the resolved frame so a reduced-motion visitor sees the
finished result.

**Screens swap, they do not dissolve.** Cross-fading two dense UI screens stacks their headings and
figures for a quarter of a second and reads as a rendering fault. The outgoing screen goes to zero,
the working area is empty for a beat, then the incoming screen arrives.

## Working on them

```bash
cd remotion
npm i
npx remotion studio          # preview at http://localhost:3000/<CompositionId>
```

## Re-rendering

From `remotion/`, for each composition:

```bash
npx remotion render cost-curve ../public/motion/cost-curve.webm --codec=vp9 --crf=36
```

VP9 only, no H.264 companion. These are flat vector surfaces, so VP9 lands them at 55-140KB each
where H.264 needed 370-520KB for the same quality. A browser that cannot play VP9 keeps showing the
`poster`, which is the right fallback at a twentieth of the bytes.

`app-tour` and `page-designer` are 1600x1000 surfaces at `--crf=38`; the bands are 1200x440 and the
terminal 1200x520 at `--crf=36`. Everything runs at 60fps: these are continuous UI motions, and at
30 the eye reads the steps rather than the movement.

**Mind the display scale.** A band is drawn for a ~600px cell. `record-audit` sits in a full-measure
section, so it is width-capped at the call site; without that it rendered at 1:1 and its labels came
out twice the size of the rows they illustrate.

Posters are a still of the loop's resolved state, rendered to PNG and encoded to WebP:

```bash
npx remotion still cost-curve /tmp/cost-curve.png --frame=200
```

`remotion still` does not emit WebP, so the PNG is converted afterwards. Poster frames currently
used: `app-tour` **0**, `page-designer` **0**, `cost-curve` 200, `merge-gate` 212,
`locale-format` 200, `scaffold-cli` 215, `coverage-run` 300, `record-audit` 60.

`app-tour` and `page-designer` must use frame 0: it is both the first and the last frame of their
loops, so the poster, the start of playback and the wrap point are all the same picture. It also
means the hero's LCP paint is a fully drawn console.
