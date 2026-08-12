import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { ConceptLoop } from "~/src/app/[locale]/(landing)/_components/concept-loop"
import { Reveal } from "~/src/app/[locale]/(landing)/_components/reveal"

/**
 * Four stations between an empty folder and a company, in the order you meet them, each paired
 * with the loop that draws its claim.
 *
 * The pairing is the point: every one of these four cells asserts something a sentence can only
 * state, and a loop can demonstrate. Metered pricing is a curve, so it is drawn as one. A gate
 * either stops a bad commit or it does not, so it is shown stopping one. Locale formatting is
 * `Intl` output, so it is real `Intl` output. Nothing here is an abstract shape standing in for
 * an idea.
 */
const STATIONS = [
  { id: "auth", loop: "cost-curve", offsetSeconds: 0 },
  { id: "tests", loop: "merge-gate", offsetSeconds: 2 },
  { id: "i18n", loop: "locale-format", offsetSeconds: 4 },
  { id: "edge", loop: "scaffold-cli", offsetSeconds: 6 },
] as const

const GRID_DELAY_MS = 100

interface StationCellProps {
  readonly body: string
  readonly loop: string
  readonly offsetSeconds: number
  readonly spec: string
  readonly title: string
}

/**
 * One station: the claim in words, then the loop that draws it.
 *
 * THE LOOP LIVES INSIDE THE CELL'S PADDING. Run full-bleed it touched both cell walls, so the
 * loop in the left cell and the loop in the right cell met at a single hairline and the pair read
 * as one band spanning the lattice: it was not possible to tell which animation belonged to which
 * claim. Inset, each one is separated from its neighbour by two gutters of ground, and every loop
 * is unambiguously part of the square it explains.
 *
 * There is no rule between the copy and the loop. The loop is rendered on `--background`, the
 * same colour this cell is filled with, so it has no edge of its own and needs no border to
 * belong: it simply continues the cell.
 */
function StationCell({ body, loop, offsetSeconds, spec, title }: StationCellProps): JSX.Element {
  return (
    <div className="flex flex-col bg-background p-7 md:p-10">
      <h3 className="text-headline-support text-balance text-foreground">{title}</h3>
      <p className="mt-4 max-w-[44ch] text-body text-pretty text-muted-foreground">{body}</p>
      <SpecChip label={spec} />
      <ConceptLoop className="mt-7 max-sm:hidden md:mt-9" name={loop} offsetSeconds={offsetSeconds} />
    </div>
  )
}

/**
 * THE SPEC CHIP — the system's fact marker, and the accent's main job on the page.
 *
 * A 5px accent square followed by a monospaced measurement. It appears only against a real,
 * quantified claim ("$0 per MAU, forever", "100% test coverage"), never as a flourish, which is
 * what keeps the one chromatic token in the palette meaning something. If it is cyan, it is a
 * number the repository can be held to.
 */
function SpecChip({ label }: Readonly<{ label: string }>): JSX.Element {
  return (
    <p className="mt-auto flex items-center gap-2.5 pt-8">
      <span aria-hidden className="size-1.25 shrink-0 rounded-xs bg-ring" />
      <span className="font-mono text-spec text-foreground">{label}</span>
    </p>
  )
}

/**
 * The four things that already run.
 *
 * A two-by-two lattice rather than a row of four cards: four equal columns turns the copy into
 * captions, and the argument in each cell is a paragraph long. The lattice is drawn with `gap-px`
 * over a hairline ground so the same markup produces correct rules at one, two and four columns
 * without a breakpoint-specific set of border utilities.
 */
export async function LineSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.landing.line")

  return (
    <section className="relative border-t border-border" id="line">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <Reveal variant="heading">
          <h2 className="max-w-[16ch] text-headline-peak text-balance text-foreground">{t("title")}</h2>
          <p className="mt-5 max-w-2xl text-lead text-pretty text-muted-foreground">{t("description")}</p>
        </Reveal>

        <Reveal className="mt-14 md:mt-20" delay={GRID_DELAY_MS}>
          <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-2">
            {STATIONS.map((station) => (
              <StationCell
                body={t(`stations.${station.id}.body`)}
                key={station.id}
                loop={station.loop}
                offsetSeconds={station.offsetSeconds}
                spec={t(`stations.${station.id}.spec`)}
                title={t(`stations.${station.id}.title`)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
