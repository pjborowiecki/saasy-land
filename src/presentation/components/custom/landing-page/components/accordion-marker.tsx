import type { JSX } from "react"

export const AccordionMarker = (): JSX.Element => (
  <span aria-hidden className="relative mt-1.5 size-3 shrink-0">
    <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-muted-foreground transition-colors duration-200 ease-exp group-aria-expanded/accordion-trigger:bg-foreground" />
    <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-muted-foreground transition-[opacity,transform] duration-300 ease-exp group-aria-expanded/accordion-trigger:scale-y-0 group-aria-expanded/accordion-trigger:opacity-0" />
  </span>
)
