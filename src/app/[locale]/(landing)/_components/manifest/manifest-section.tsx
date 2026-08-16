import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { HighlightGroup, HighlightItem } from "~/src/app/[locale]/(landing)/_components/shared/hover-highlight"
import { Reveal } from "~/src/app/[locale]/(landing)/_components/shared/reveal"

/** The ten parts, in assembly order: the door first, then what it opens onto, then the proof. */
const MANIFEST_ITEMS = ["auth", "data", "billing", "email", "admin", "ui", "i18n", "content", "tests", "tooling"] as const

const LEDGER_DELAY_MS = 100

/**
 * A ledger, not a grid of tiles.
 *
 * Ten identical bordered cards with an icon in the corner is the shape that makes the middle of
 * a landing page read as a template: same box, same glyph, same weight, ten times, with nothing
 * in the layout saying which parts are load bearing. A hairline-divided ledger has no box to
 * repeat, so the only rhythm left is the one the copy sets.
 *
 * The row under the cursor is the one being read, so it lights: the ground warms one step and
 * the description resolves to full strength. Both properties are composited and both run on the
 * page's own easing, so ten of these cost nothing and none of them shift layout. The warm ground
 * bleeds past the gutter, which is what makes it read as the ledger lighting up rather than as a
 * card appearing under the pointer.
 */
export async function ManifestSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.landing.manifest")

  return (
    <section className="relative border-t border-border">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <Reveal variant="heading">
          <h2 className="max-w-[16ch] text-headline-peak text-balance text-foreground">{t("title")}</h2>
          <p className="mt-5 max-w-2xl text-lead text-pretty text-muted-foreground">{t("lead")}</p>
        </Reveal>

        <Reveal className="mt-14 md:mt-20" delay={LEDGER_DELAY_MS}>
          {/*
           * The rules and the highlight bleed past the text measure, together.
           *
           * Flush with the text, a lit row had its label touching the edge of its own highlight,
           * which reads as cramped; bleeding only the highlight made it wider than the hairlines
           * above and below it, which reads as a card escaping the ledger. Pulling the list out
           * and padding the rows back in keeps the rule and the highlight identical to each other
           * while giving the copy room, and the labels stay on the measure the heading is set to.
           */}
          <HighlightGroup className="-mx-4 divide-y divide-border border-y border-border md:-mx-6" element="dl" name="manifest-highlight">
            {MANIFEST_ITEMS.map((item) => (
              <HighlightItem
                className="group"
                contentClassName="grid gap-x-10 px-4 py-6 md:grid-cols-[15rem_1fr] md:items-baseline md:px-6 md:py-7"
                id={item}
                key={item}
              >
                <dt className="text-title text-foreground">{t(`items.${item}.label`)}</dt>
                <dd className="mt-2 max-w-[62ch] text-body text-pretty text-muted-foreground transition-colors duration-400 ease-exp group-hover:text-foreground md:mt-0">
                  {t(`items.${item}.body`)}
                </dd>
              </HighlightItem>
            ))}
          </HighlightGroup>
        </Reveal>
      </div>
    </section>
  )
}
