import type { JSX } from "react"

import { cn } from "~/src/lib/cn"
/**
 * The marker band, present on every column so the three heads start on one line.
 *
 * A rule, not a badge. The page marks things with hairlines and spends the accent on marks a few
 * pixels wide, so a filled chip read as a sticker from another site; the same signal is carried
 * by drawing the featured column's top edge in the accent and setting its label in the same
 * colour. Louder than the muted 11px caption it replaces, quiet enough to belong here.
 */
export const TierBand = ({ isFeatured, mostPopular }: Readonly<{ isFeatured: boolean; mostPopular: string }>): JSX.Element => (
  <div className={cn("flex h-10 items-center border-b border-border px-7 md:px-8", isFeatured && "border-t-2 border-t-ring")}>
    {isFeatured && <span className="font-mono text-spec tracking-[0.1em] text-ring uppercase">{mostPopular}</span>}
  </div>
)
