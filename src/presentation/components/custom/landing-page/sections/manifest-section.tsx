import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

import { HighlightGroup, HighlightItem } from "~/src/presentation/components/custom/landing-page/components/hover-highlight"
import { Reveal } from "~/src/presentation/components/custom/landing-page/components/reveal"

const MANIFEST_ITEMS = ["auth", "data", "billing", "email", "admin", "ui", "i18n", "content", "tests", "tooling"] as const

const LEDGER_DELAY_MS = 100

export const ManifestSection = (): JSX.Element => {
  const t = useTranslations("pages.landing.manifest")

  return (
    <section className="relative border-t border-border">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <Reveal variant="heading">
          <h2 className="max-w-[16ch] text-headline-peak text-balance text-foreground">{t("title")}</h2>
          <p className="mt-5 max-w-2xl text-lead text-pretty text-muted-foreground">{t("lead")}</p>
        </Reveal>

        <Reveal className="mt-14 md:mt-20" delay={LEDGER_DELAY_MS}>
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
