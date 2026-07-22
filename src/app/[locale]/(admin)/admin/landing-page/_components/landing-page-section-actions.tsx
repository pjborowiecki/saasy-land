import type { JSX } from "react"

import { Copy, Pen, Trash2 } from "lucide-react"

import { cn } from "~/src/utils"

import { Button } from "~/src/presentation/components/shadcn/button"

interface LandingPageSectionActionsProps {
  readonly className?: string
}

export function LandingPageSectionActions({ className }: LandingPageSectionActionsProps): JSX.Element {
  return (
    <div className={cn("absolute top-3 right-3 z-10 flex gap-1", className)}>
      <Button size="icon" variant="secondary" className="size-8 hover:bg-secondary/80">
        <Pen className="size-4" />
      </Button>
      <Button size="icon" variant="secondary" className="size-8 hover:bg-secondary/80">
        <Copy className="size-4" />
      </Button>
      <Button
        size="icon"
        variant="destructive"
        className="size-8 bg-destructive/20 text-destructive hover:bg-destructive/30 hover:text-destructive"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  )
}
