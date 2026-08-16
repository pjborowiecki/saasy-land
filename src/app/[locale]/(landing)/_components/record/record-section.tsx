import type { JSX } from "react"

import { Check } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { ConceptLoop } from "~/src/app/[locale]/(landing)/_components/shared/concept-loop"
import { HighlightGroup, HighlightItem } from "~/src/app/[locale]/(landing)/_components/shared/hover-highlight"
import { Reveal } from "~/src/app/[locale]/(landing)/_components/shared/reveal"

const RECORD_ITEMS = ["coverage", "gate", "suites", "locales", "auth", "author"] as const

const LEDGER_DELAY_MS = 100

function RecordRow({ claim, evidence, id }: Readonly<{ claim: string; evidence: string; id: string }>): JSX.Element {
  return (
    <HighlightItem contentClassName="grid gap-x-10 px-4 py-5 md:grid-cols-[1fr_1.5fr] md:items-baseline" id={id}>
      <dt className="flex items-baseline gap-2.5 text-body-sm font-medium text-foreground">
        <Check aria-hidden className="size-3.5 shrink-0 translate-y-0.5 text-ring" strokeWidth={2.25} />
        {claim}
      </dt>
      <dd className="mt-1.5 ml-6 font-mono text-spec wrap-break-word text-muted-foreground md:mt-0 md:ml-0">{evidence}</dd>
    </HighlightItem>
  )
}

/**
 * The receipt.
 *
 * This section is the reason the rest of the page is allowed to state numbers. Every figure the
 * page quotes is listed here beside the file that generates it, so the claims are checkable
 * before anyone pays. It replaces the testimonial block, which is the correct trade for this
 * audience: there is nothing to verify in a quote.
 *
 * A description list, not a table. The mapping really is term to definition, the evidence column
 * is long enough that a two-column table would need a horizontal scroll on a phone, and a `<dl>`
 * reflows to a single stack without any of the cells losing their pairing.
 */
export async function RecordSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.landing.record")

  return (
    <section aria-label={t("ariaLabel")} className="relative border-t border-border">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <Reveal variant="heading">
          <h2 className="max-w-[16ch] text-headline-peak text-balance text-foreground">{t("title")}</h2>
          <p className="mt-5 max-w-2xl text-lead text-pretty text-muted-foreground">{t("lead")}</p>
        </Reveal>

        <Reveal className="mt-14 md:mt-20" delay={LEDGER_DELAY_MS}>
          <div className="grid gap-x-10 border-b border-border pb-3 md:grid-cols-[1fr_1.5fr]">
            <p className="font-mono text-label text-muted-foreground uppercase">{t("columns.claim")}</p>
            <p className="hidden font-mono text-label text-muted-foreground uppercase md:block">{t("columns.evidence")}</p>
          </div>

          <HighlightGroup className="-mx-4 divide-y divide-border" element="dl" name="record-highlight">
            {RECORD_ITEMS.map((item) => (
              <RecordRow claim={t(`items.${item}.claim`)} evidence={t(`items.${item}.evidence`)} id={item} key={item} />
            ))}
          </HighlightGroup>

          {/*
           * The list says where to look; the loop shows the looking. It sits under the receipt
           * because it is a worked example of the rows above it, not a summary of them.
           *
           * Width-capped. This is a band drawn for a ~600px cell, and the Record section runs the
           * full measure, so left unconstrained it rendered at 1:1 and its labels came out twice
           * the size of the rows they are illustrating.
           */}
          <ConceptLoop className="mt-12 max-w-2xl max-sm:hidden" name="record-audit" />
        </Reveal>
      </div>
    </section>
  )
}
