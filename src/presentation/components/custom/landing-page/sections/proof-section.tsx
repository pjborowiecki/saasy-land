import type { JSX } from "react"
import reactPackage from "react/package.json"

import { useQuery } from "@tanstack/react-query"
import { useFormatter, useTranslations } from "use-intl/react"

import { starCountQuery } from "~/src/integrations/github/github.queries"

import { Skeleton } from "~/src/presentation/components/shadcn/skeleton"

import { HighlightGroup, HighlightItem } from "~/src/presentation/components/custom/landing-page/components/hover-highlight"

const FACT_KEYS = ["coverage", "tests", "locales", "components", "mau", "stars", "upkeep", "types", "tables", "admin"] as const

const MAJOR = 0

const REACT_MAJOR = `React ${reactPackage.version.split(".")[MAJOR]}`

export const ProofSection = (): JSX.Element => {
  const t = useTranslations("pages.landing.proof")
  const format = useFormatter()
  const { data: stars } = useQuery(starCountQuery)

  const measured = {
    stars: typeof stars === "number" ? format.number(stars) : <Skeleton aria-hidden className="h-7 w-16" />,
    upkeep: REACT_MAJOR,
  }

  return (
    <section className="relative border-t border-border">
      <div className="mx-auto w-full max-w-7xl">
        <HighlightGroup className="grid grid-cols-2 gap-px bg-border md:grid-cols-5" element="dl" name="proof-highlight">
          {FACT_KEYS.map((key) => (
            <HighlightItem className="bg-background" contentClassName="px-6 py-8 md:px-8 md:py-10" id={key} key={key}>
              <dt className="font-mono text-label break-words text-muted-foreground uppercase">{t(`facts.${key}.label`)}</dt>
              <dd className="mt-3 text-[1.75rem] leading-none font-semibold tracking-[-0.035em] text-foreground tabular-nums">
                {key === "stars" || key === "upkeep" ? measured[key] : t(`facts.${key}.value`)}
              </dd>
              <dd className="mt-2 text-body-sm text-pretty text-muted-foreground">{t(`facts.${key}.note`)}</dd>
            </HighlightItem>
          ))}
        </HighlightGroup>
      </div>
    </section>
  )
}
