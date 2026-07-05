import type { JSX } from "react"

import { ArrowDown, Monitor, Smartphone, Tablet } from "lucide-react"

export function LandingPageCanvasToolbar(): JSX.Element {
  return (
    <div className="flex h-12 shrink-0 items-center justify-between border-b border-border/40 bg-secondary/10 px-4">
      <div className="flex items-center gap-2">
        <div className="size-3 rounded-full border border-red-500/50 bg-red-500/20" />
        <div className="size-3 rounded-full border border-amber-500/50 bg-amber-500/20" />
        <div className="size-3 rounded-full border border-emerald-500/50 bg-emerald-500/20" />
      </div>
      <div className="flex items-center gap-1 rounded-lg border border-border/40 bg-secondary/30 p-1">
        <button type="button" className="rounded bg-secondary p-1.5 text-foreground shadow-sm">
          <Monitor className="size-4" />
        </button>
        <button type="button" className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground">
          <Tablet className="size-4" />
        </button>
        <button type="button" className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground">
          <Smartphone className="size-4" />
        </button>
      </div>
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        1200px
        <ArrowDown className="size-3" />
      </div>
    </div>
  )
}
