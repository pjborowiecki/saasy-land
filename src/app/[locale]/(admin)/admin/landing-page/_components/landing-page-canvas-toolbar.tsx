import type { JSX } from "react"

import { Monitor, Smartphone, Tablet, type LucideIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { cn } from "~/src/utils"

const ICON_STROKE_WIDTH = 1.5

/** The canvas renders the page at a fixed desktop width; this is that measurement, not a label. */
const CANVAS_VIEWPORT_WIDTH = "1200px"

const VIEWPORT_BUTTON_BASE =
  "flex h-9 w-11 items-center justify-center rounded-none transition-[color,background-color] duration-200 ease-exp outline-none focus-visible:relative focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none"

interface ViewportButtonProps {
  readonly icon: LucideIcon
  readonly isActive: boolean
  readonly label: string
}

function ViewportButton({ icon: Icon, isActive, label }: ViewportButtonProps): JSX.Element {
  return (
    <button
      aria-label={label}
      aria-pressed={isActive}
      className={cn(VIEWPORT_BUTTON_BASE, isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}
      type="button"
    >
      <Icon aria-hidden className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
    </button>
  )
}

export async function LandingPageCanvasToolbar(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.landing-page")

  return (
    <div className="flex h-12 shrink-0 items-center justify-between gap-4 border-b border-border px-3">
      <div className="flex divide-x divide-border rounded-lg border border-border">
        <ViewportButton icon={Monitor} isActive label={t("canvas.viewport.desktop")} />
        <ViewportButton icon={Tablet} isActive={false} label={t("canvas.viewport.tablet")} />
        <ViewportButton icon={Smartphone} isActive={false} label={t("canvas.viewport.mobile")} />
      </div>
      <p className="flex items-center gap-2 font-mono text-spec text-muted-foreground tabular-nums">
        <span aria-hidden className="size-1.5 shrink-0 bg-primary" />
        {CANVAS_VIEWPORT_WIDTH}
      </p>
    </div>
  )
}
