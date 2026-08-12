import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

/**
 * THE GATE — the world half of the split.
 *
 * No photograph. A 16:9 image cropped into a tall half-screen column throws away whatever
 * composition made it work, and a still dimmed far enough for type to sit beside it is not
 * carrying the page anyway.
 *
 * What the column is actually for is the last thing a buyer reads before they commit, so it says
 * something instead: the promise in the page's own display face, and the three facts that answer
 * "why am I signing up" in the page's own spec-chip idiom. Same ground, same accent, same
 * hairline, and nothing to compress or crop at any viewport.
 */
const ASSURANCE_IDS = ["coverage", "pricing", "ownership"] as const

export async function AuthGateFrame(): Promise<JSX.Element> {
  const t = await getTranslations("auth.gate")

  return (
    <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-background p-12 lg:flex xl:p-16">
      {/*
       * The one graphic element: the same measured field the marketing hero is drawn on, so the
       * two surfaces read as one product. It introduces no colour and no new token.
       */}
      <div aria-hidden className="field-grid pointer-events-none absolute inset-0" />

      <p className="relative max-w-md text-display-gate text-balance text-foreground">{t("headline")}</p>

      <ul className="relative flex flex-col gap-5">
        {ASSURANCE_IDS.map((id) => (
          <li className="flex items-start gap-3" key={id}>
            <span aria-hidden className="mt-2 size-1.25 shrink-0 rounded-xs bg-ring" />
            <span className="font-mono text-spec text-muted-foreground">{t(`assurances.${id}`)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
