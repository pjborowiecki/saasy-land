import type { JSX } from "react"

import { Copy, Pen, Trash2 } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { cn } from "~/src/lib/cn"

const ICON_STROKE_WIDTH = 1.5

const ACTION_BUTTON_BASE =
  "flex size-9 items-center justify-center rounded-none bg-background transition-[color,background-color] duration-200 ease-exp outline-none focus-visible:relative focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none"

interface LandingPageSectionActionsProps {
  readonly className?: string
}

export const LandingPageSectionActions = ({ className }: LandingPageSectionActionsProps): JSX.Element => {
  const t = useTranslations("pages.admin.landing-page")

  return (
    <div className={cn("absolute top-3 right-3 z-10 flex divide-x divide-border border border-border", className)}>
      <button
        aria-label={t("canvas.sectionActions.edit")}
        className={cn(ACTION_BUTTON_BASE, "text-muted-foreground hover:text-foreground")}
        type="button"
      >
        <Pen aria-hidden className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
      </button>
      <button
        aria-label={t("canvas.sectionActions.duplicate")}
        className={cn(ACTION_BUTTON_BASE, "text-muted-foreground hover:text-foreground")}
        type="button"
      >
        <Copy aria-hidden className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
      </button>
      <button
        aria-label={t("canvas.sectionActions.delete")}
        className={cn(ACTION_BUTTON_BASE, "text-muted-foreground hover:text-destructive")}
        type="button"
      >
        <Trash2 aria-hidden className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
      </button>
    </div>
  )
}
