import type { JSX } from "react"

import { ArrowRight } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { HighlightGroup, HighlightItem } from "~/src/app/[locale]/(landing)/_components/hover-highlight"
import { Reveal } from "~/src/app/[locale]/(landing)/_components/reveal"

const OPTIONS = ["free", "weekend", "heavyweights"] as const

const DIMENSIONS = ["model", "coverage", "designer", "mau", "course", "license"] as const

const TABLE_DELAY_MS = 100

interface CompareRowProps {
  readonly id: string
  readonly label: string
  readonly market: string
  readonly marketLabel: string
  readonly ours: string
  readonly oursLabel: string
}

/**
 * One dimension.
 *
 * Below `md` the three cells stack and each value carries its own small label; from `md` up they
 * sit on one line and the labels are the column headers instead. Nothing is hidden at any width,
 * which is the whole reason this is a grid and not a table with a horizontal scrollbar.
 */
function CompareRow({ id, label, market, marketLabel, ours, oursLabel }: CompareRowProps): JSX.Element {
  return (
    <HighlightItem contentClassName="grid gap-y-2 px-4 py-5 md:grid-cols-[1.1fr_1fr_1fr] md:items-baseline md:gap-x-0 md:py-0" id={id}>
      <dt className="text-body-sm font-medium text-foreground md:py-4 md:pr-6">{label}</dt>
      <dd className="text-body-sm text-pretty text-muted-foreground md:py-4 md:pr-6">
        <span className="mr-2 font-mono text-label text-muted-foreground/70 uppercase md:hidden">{marketLabel}</span>
        {market}
      </dd>
      <dd className="text-body-sm text-pretty text-foreground md:bg-card md:px-5 md:py-4">
        <span className="mr-2 font-mono text-label text-muted-foreground uppercase md:hidden">{oursLabel}</span>
        {ours}
      </dd>
    </HighlightItem>
  )
}

function CompareOption({ body, id, title }: Readonly<{ body: string; id: string; title: string }>): JSX.Element {
  return (
    <HighlightItem contentClassName="grid gap-x-10 px-4 py-6 md:grid-cols-[15rem_1fr] md:items-baseline" id={id}>
      <dt className="text-title text-foreground">{title}</dt>
      <dd className="mt-2 max-w-[62ch] text-body text-pretty text-muted-foreground md:mt-0">{body}</dd>
    </HighlightItem>
  )
}

/**
 * The market, and what each way in leaves you owing.
 *
 * Two movements. First the three alternatives as hairline rows, because they are prose and prose
 * in three equal cards becomes three captions. Then the actual comparison as a real table, since
 * that is what a six-by-two matrix is, and a table is the only structure a screen reader can
 * navigate cell by cell.
 *
 * The table keeps its columns at every width and scrolls horizontally under `md` rather than
 * reflowing into stacked blocks. A comparison that has been folded into a single column is no
 * longer a comparison: the whole value is that the two answers sit on the same line.
 */
export async function CompareSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.landing.compare")

  return (
    <section className="relative border-t border-border">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <Reveal variant="heading">
          <h2 className="max-w-[16ch] text-headline-peak text-balance text-foreground">{t("title")}</h2>
          <p className="mt-5 max-w-2xl text-lead text-pretty text-muted-foreground">{t("description")}</p>
        </Reveal>

        <Reveal className="mt-14 md:mt-20" delay={TABLE_DELAY_MS}>
          <HighlightGroup className="-mx-4 divide-y divide-border border-y border-border" element="dl" name="compare-options-highlight">
            {OPTIONS.map((option) => (
              <CompareOption body={t(`options.${option}.body`)} id={option} key={option} title={t(`options.${option}.title`)} />
            ))}
          </HighlightGroup>

          {/*
           * A responsive grid, not a scrolling table.
           *
           * As a `<table>` this needed a 608px minimum to keep three columns, so on a phone it
           * opened scrolled to the left and the only column that matters, the one about this
           * product, sat off-screen until the visitor thought to swipe a table sideways. Below
           * `md` the three columns become three stacked lines per dimension, each carrying its
           * own small label, and nothing is hidden.
           *
           * The winning column is marked by fill, never by a badge, a scale-up or a glow.
           */}
          <div className="mt-14 border-y border-border md:mt-16">
            {/* Bled and padded by the same 4, so the header tracks stay aligned with the rows now that
                the rows bleed for their hover ground. */}
            <div className="-mx-4 hidden border-b border-border px-4 md:grid md:grid-cols-[1.1fr_1fr_1fr]">
              <span />
              <span className="py-3 font-mono text-label text-muted-foreground uppercase">{t("columns.market")}</span>
              <span className="bg-card px-5 py-3 font-mono text-label text-foreground uppercase">{t("columns.saasyland")}</span>
            </div>

            <HighlightGroup className="-mx-4 divide-y divide-border" element="dl" name="compare-rows-highlight">
              {DIMENSIONS.map((dimension) => (
                <CompareRow
                  id={dimension}
                  key={dimension}
                  label={t(`dimensions.${dimension}.label`)}
                  market={t(`dimensions.${dimension}.market`)}
                  marketLabel={t("columns.market")}
                  ours={t(`dimensions.${dimension}.ours`)}
                  oursLabel={t("columns.saasyland")}
                />
              ))}
            </HighlightGroup>
          </div>

          <div className="mt-14 grid gap-x-16 gap-y-10 md:mt-16 md:grid-cols-2 md:items-start">
            <p className="text-statement text-pretty text-foreground">{t("close")}</p>
            <aside className="rounded-xl border border-border bg-card p-7 md:p-8">
              <h3 className="text-title text-foreground">{t("notFor.title")}</h3>
              <p className="mt-3 text-body text-pretty text-muted-foreground">{t("notFor.body")}</p>
            </aside>
          </div>

          <a
            className="group mt-12 inline-flex items-center gap-2 rounded-sm text-body-sm font-medium text-foreground transition-colors duration-200 ease-exp hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            href="#pricing"
          >
            {t("cta")}
            <ArrowRight
              aria-hidden
              className="size-3.5 transition-transform duration-200 ease-exp group-hover:translate-x-0.5 motion-reduce:transition-none"
              strokeWidth={2}
            />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
