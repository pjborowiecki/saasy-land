import type { JSX } from "react"

import { Lock, Play } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { cn } from "~/src/utils"

import { ConceptLoop } from "~/src/app/[locale]/(landing)/_components/concept-loop"
import { Reveal } from "~/src/app/[locale]/(landing)/_components/reveal"

/** Six each. The two tracks are the same length because they cover the same product twice. */
const LESSONS = ["l1", "l2", "l3", "l4", "l5", "l6"] as const
const TRACKS = ["walkthrough", "build"] as const

const LESSON_NUMBER_BASE = 1
const LESSON_NUMBER_PAD = 2

const SECOND_CARD_DELAY_MS = 100

interface BuilderCardProps {
  readonly body: string
  readonly imageAlt: string
  readonly spec: string
  readonly title: string
}

/**
 * The page designer, being used rather than photographed: a section is selected, its padding and
 * alignment change, the canvas responds, and the page publishes. A screenshot can only show that
 * the editor exists; the claim this card makes is that a marketing team can drive it.
 *
 * The loop sits beside its copy rather than above it. Stacked, the reader met a wide silent
 * screenshot and had to travel to the bottom of it to learn what they were looking at; abreast,
 * the claim is legible at the same moment as the evidence for it. The rule between them is the
 * card's own divider, so the two halves still read as one exhibit rather than two cards.
 */
function BuilderCard({ body, imageAlt, spec, title }: BuilderCardProps): JSX.Element {
  return (
    <article className="grid overflow-hidden rounded-xl border border-border bg-card lg:grid-cols-[1.35fr_1fr] lg:divide-x lg:divide-border">
      {/*
       * The loop is a framed panel in a padded well, not a flush fill.
       *
       * Flush, it looked like a mistake. The composition draws the console inset by its own
       * padding on its own `--card` ground, and with the cell painted the same colour that inset
       * became an unexplained sliver of space between the console and the card's hard border —
       * while the copy opposite sat a deliberate 36px off the divider. Matching the padding and
       * giving the video a hairline of its own turns an accident into a frame, and matches how
       * the preview slot in the masterclass card below treats its own media.
       */}
      <div className="flex items-center border-b border-border p-7 md:p-9 lg:border-b-0">
        <ConceptLoop className="overflow-hidden rounded-lg border border-border" label={imageAlt} name="page-designer" />
      </div>
      <div className="flex flex-col justify-center p-7 md:p-9">
        <h3 className="text-headline-support text-balance text-foreground">{title}</h3>
        <p className="mt-3 max-w-[52ch] text-body text-pretty text-muted-foreground">{body}</p>
        <p className="mt-7 flex items-center gap-2.5">
          <span aria-hidden className="size-1.25 shrink-0 rounded-xs bg-ring" />
          <span className="font-mono text-spec text-foreground">{spec}</span>
        </p>
      </div>
    </article>
  )
}

interface LessonRowProps {
  readonly index: number
  readonly isPreview: boolean
  readonly lockedLabel: string
  readonly title: string
}

/**
 * One lesson, and its state.
 *
 * The lock says what unlocks it, not that you are shut out. "Included with Masterclass" is the
 * same fact as a padlock and a paywall message, told as an inclusion rather than an exclusion,
 * which is the difference between a page that sells and a page that nags.
 */
function LessonRow({ index, isPreview, lockedLabel, title }: LessonRowProps): JSX.Element {
  return (
    <li className="flex items-baseline gap-4 border-b border-border py-3.5 last:border-b-0">
      <span aria-hidden className="font-mono text-spec text-muted-foreground/60 tabular-nums">
        {String(index + LESSON_NUMBER_BASE).padStart(LESSON_NUMBER_PAD, "0")}
      </span>
      <span className={cn("min-w-0 flex-1 text-body-sm text-pretty", isPreview ? "text-foreground" : "text-muted-foreground")}>
        {title}
      </span>
      {isPreview ? (
        <Play aria-hidden className="size-3 shrink-0 translate-y-0.5 fill-current text-ring" strokeWidth={0} />
      ) : (
        <Lock aria-hidden className="size-3 shrink-0 translate-y-0.5 text-muted-foreground/45" strokeWidth={2.25}>
          <title>{lockedLabel}</title>
        </Lock>
      )}
    </li>
  )
}

/**
 * THE COURSES — proof of quality, not a list of promises.
 *
 * This was an accordion of six chapter titles. An accordion answers "what is covered", which is
 * the second question a buyer has; the first is "is any of it any good", and a list of headings
 * cannot answer that at any length. So the first lesson plays, free, right here. The page already
 * tells people to read the docs and the coverage report before paying — the course should be
 * checkable on the same terms, and one watchable lesson outsells six accurate summaries.
 *
 * Two tracks side by side, because they are two different promises: the walkthrough is orientation
 * in something you now own, the build is the thing being made from nothing. Stacked, the second
 * would read as an appendix to the first.
 */
async function MasterclassCard({ body, title }: Readonly<{ body: string; title: string }>): Promise<JSX.Element> {
  const t = await getTranslations("pages.landing.studio.masterclass")

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="p-7 md:p-9">
        <h3 className="text-headline-support text-balance text-foreground">{title}</h3>
        <p className="mt-3 max-w-[68ch] text-body text-pretty text-muted-foreground">{body}</p>
      </div>

      {/* The player slot. A still frame and a play mark until the first lesson is cut; swap the
          inner content for the real thing and nothing around it has to move. */}
      <div className="border-y border-border bg-background px-7 py-8 md:px-9 md:py-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
          <div className="flex aspect-video w-full shrink-0 items-center justify-center rounded-lg border border-border bg-card md:w-80">
            <span aria-hidden className="flex size-11 items-center justify-center rounded-full border border-ring/40 bg-ring/10">
              <Play className="size-4 translate-x-px fill-current text-ring" strokeWidth={0} />
            </span>
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-2.5">
              <span aria-hidden className="size-1.25 shrink-0 rounded-xs bg-ring" />
              <span className="font-mono text-label text-ring uppercase">{t("previewLabel")}</span>
            </p>
            <p className="mt-3 text-title text-balance text-foreground">{t("previewTitle")}</p>
            <p className="mt-2 max-w-[46ch] text-body-sm text-pretty text-muted-foreground">{t("previewNote")}</p>
          </div>
        </div>
      </div>

      <div className="grid divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
        {TRACKS.map((track) => (
          <div className="p-7 md:p-9" key={track}>
            <p className="font-mono text-label text-muted-foreground uppercase">{t(`tracks.${track}.label`)}</p>
            <p className="mt-2 max-w-[42ch] text-body-sm text-pretty text-muted-foreground/80">{t(`tracks.${track}.note`)}</p>
            <ul className="mt-5 border-t border-border">
              {LESSONS.map((lesson, index) => (
                <LessonRow
                  index={index}
                  isPreview={track === "walkthrough" && index === 0}
                  key={lesson}
                  lockedLabel={t("lockedLabel")}
                  title={t(`tracks.${track}.lessons.${lesson}`)}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  )
}

/**
 * The two things a starter kit almost never includes.
 *
 * Stacked, not paired. These are two separate claims — a tool, and an education — and standing
 * them side by side asked the reader to hold both at once while a tall accordion fought a wide
 * screenshot for the same vertical run. Each now gets the full measure and its own turn: the page
 * designer states its case beside its own footage, and only then does the course begin.
 *
 * The screenshot is the actual page designer running inside the admin. There is no browser chrome
 * drawn around it and no laptop mock under it, because both would be decoration around an image
 * that is already the evidence.
 */
export async function StudioSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.landing.studio")

  return (
    <section className="relative border-t border-border" id="studio">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <Reveal variant="heading">
          <h2 className="max-w-[18ch] text-headline-peak text-balance text-foreground">{t("title")}</h2>
          <p className="mt-5 max-w-2xl text-lead text-pretty text-muted-foreground">{t("description")}</p>
        </Reveal>

        <Reveal className="mt-14 md:mt-20">
          <BuilderCard body={t("builder.body")} imageAlt={t("builder.imageAlt")} spec={t("builder.spec")} title={t("builder.title")} />
        </Reveal>

        <Reveal className="mt-6" delay={SECOND_CARD_DELAY_MS}>
          <MasterclassCard body={t("masterclass.body")} title={t("masterclass.title")} />
        </Reveal>
      </div>
    </section>
  )
}
