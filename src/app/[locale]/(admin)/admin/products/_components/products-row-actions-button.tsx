import type { JSX } from "react"

import { MoreHorizontal } from "lucide-react"

import { Button } from "~/src/components/shadcn/button"

export function ProductsRowActionsButton(): JSX.Element {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-secondary hover:text-foreground focus:opacity-100"
      aria-label="Row actions"
    >
      <MoreHorizontal className="size-4" />
    </Button>
  )
}
