import type { JSX } from "react"

import { Check } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { ConceptLoop } from "~/src/presentation/components/custom/landing-page/components/concept-loop"
import { HighlightGroup, HighlightItem } from "~/src/presentation/components/custom/landing-page/components/hover-highlight"
import { Reveal } from "~/src/presentation/components/custom/landing-page/components/reveal"

const RECORD_ITEMS = ["coverage", "gate", "suites", "locales", "auth", "author"] as const

const LEDGER_DELAY_MS = 100

const RecordRow = ({ claim, evidence, id }: Readonly<{ claim: string; evidence: string; id: string }>): JSX.Element => (
  <HighlightItem contentClassName="grid gap-x-10 px-4 py-5 md:grid-cols-[1fr_1.5fr] md:items-baseline" id={id}>
    <dt className="flex items-baseline gap-2.5 text-body-sm font-medium text-foreground">
      <Check aria-hidden className="size-3.5 shrink-0 translate-y-0.5 text-ring" strokeWidth={2.25} />
      {claim}
    </dt>
    <dd className="mt-1.5 ml-6 font-mono text-spec wrap-break-word text-muted-foreground md:mt-0 md:ml-0">{evidence}</dd>
  </HighlightItem>
)

export const RecordSection = (): JSX.Element => {
  const t = useTranslations("pages.landing.record")

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

          <ConceptLoop className="mt-12 max-w-2xl max-sm:hidden" name="record-audit" />
        </Reveal>
      </div>
    </section>
  )
}
