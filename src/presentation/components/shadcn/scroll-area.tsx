import type { ComponentProps } from "react"

import { cn } from "~/src/lib/cn"

const ScrollArea = ({ className, children, ...props }: ComponentProps<"div">) => (
  <div
    data-slot="scroll-area"
    className={cn(
      "relative scrollbar-thin [scrollbar-color:var(--color-border)_transparent] overflow-auto outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1",
      className,
    )}
    {...props}
  >
    {children}
  </div>
)

export { ScrollArea }
