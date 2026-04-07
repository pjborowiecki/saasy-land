import type { JSX } from "react"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

export function TooltipProvider({ delay = 0, ...props }: Readonly<TooltipPrimitive.Provider.Props>): JSX.Element {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delay={delay} {...props} />
}
