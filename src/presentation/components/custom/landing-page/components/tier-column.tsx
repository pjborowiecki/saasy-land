import type { JSX, ReactNode } from "react"

import { Link } from "@tanstack/react-router"

import { cn } from "~/src/lib/cn"

import { HighlightItem } from "~/src/presentation/components/custom/landing-page/components/hover-highlight"
import { TierBand } from "~/src/presentation/components/custom/landing-page/components/tier-band"
import { TierFeature } from "~/src/presentation/components/custom/landing-page/components/tier-feature"

import { ROUTES } from "~/src/routes"
export interface Tier {
  readonly cta: string
  readonly features: readonly { id: string; label: string }[]
  readonly id: string
  readonly isFeatured: boolean
  readonly name: string
  readonly period: string
  readonly price: ReactNode
  readonly tagline: string
  readonly whoFor: string
}
export const TierColumn = ({ mostPopular, tier }: Readonly<{ mostPopular: string; tier: Tier }>): JSX.Element => (
  <HighlightItem
    className={cn(
      "border-border not-last:border-b md:not-last:border-r md:not-last:border-b-0",
      tier.isFeatured ? "bg-card" : "bg-background",
    )}
    contentClassName="flex h-full flex-col"
    id={tier.id}
  >
    <TierBand isFeatured={tier.isFeatured} mostPopular={mostPopular} />

    <div className="flex flex-1 flex-col p-7 md:p-8">
      <h3 className="text-title text-foreground">{tier.name}</h3>
      <p className="mt-1.5 text-body-sm text-pretty text-muted-foreground md:min-h-12">{tier.whoFor}</p>

      <p className="mt-7 flex items-baseline gap-2">
        <span className="text-price text-foreground tabular-nums">{tier.price}</span>
        <span className="font-mono text-spec text-muted-foreground">{tier.period}</span>
      </p>
      <p className="mt-3 text-body-sm text-pretty text-muted-foreground md:min-h-12">{tier.tagline}</p>

      <ul className="mt-7 space-y-3 border-t border-border pt-7">
        {tier.features.map((feature) => (
          <TierFeature key={feature.id} label={feature.label} />
        ))}
      </ul>

      <div className="mt-auto pt-10 md:pt-12">
        <Link
          className={cn(
            "inline-flex h-11 w-full items-center justify-center rounded-lg px-5 text-body-sm font-semibold transition-[background-color,border-color,transform] duration-200 ease-exp focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring active:translate-y-px",
            tier.isFeatured
              ? "bg-primary text-primary-foreground hover:bg-primary/88"
              : "border border-border text-foreground hover:bg-muted",
          )}
          to={ROUTES.SIGN_UP}
          search={{ tier: tier.id }}
        >
          {tier.cta}
        </Link>
      </div>
    </div>
  </HighlightItem>
)
