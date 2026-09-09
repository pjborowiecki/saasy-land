import type { JSX } from "react"

import { cn } from "~/src/lib/cn"

export const TierBand = ({ isFeatured, mostPopular }: Readonly<{ isFeatured: boolean; mostPopular: string }>): JSX.Element => (
  <div className={cn("flex h-10 items-center border-b border-border px-7 md:px-8", isFeatured && "border-t-2 border-t-ring")}>
    {isFeatured && <span className="font-mono text-spec tracking-[0.1em] text-ring uppercase">{mostPopular}</span>}
  </div>
)
