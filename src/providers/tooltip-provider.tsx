import type { JSX } from "react"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

const DEFAULT_TOOLTIP_DELAY_MS = 0

export function TooltipProvider({ delay = DEFAULT_TOOLTIP_DELAY_MS, ...props }: Readonly<TooltipPrimitive.Provider.Props>): JSX.Element {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delay={delay} {...props} />
}
