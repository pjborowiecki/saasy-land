import type { JSX } from "react"

import { ImageIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { cn } from "~/src/utils"

const ICON_STROKE_WIDTH = 1.5

const SWATCH_BASE =
  "flex size-11 items-center justify-center rounded-none border transition-[border-color] duration-200 ease-exp outline-none focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none"

interface SurfaceSwatchProps {
  readonly isSelected: boolean
  readonly label: string
  readonly surfaceClassName: string
}

function SurfaceSwatch({ isSelected, label, surfaceClassName }: SurfaceSwatchProps): JSX.Element {
  return (
    <button
      aria-label={label}
      aria-pressed={isSelected}
      className={cn(SWATCH_BASE, surfaceClassName, isSelected ? "border-ring" : "border-border hover:border-muted-foreground")}
      type="button"
    >
      {isSelected ? <span aria-hidden className="size-1.5 bg-primary" /> : undefined}
    </button>
  )
}

export async function LandingPagePropertiesBackgroundSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.landing-page")

  return (
    <div className="px-4 py-5">
      <h3 className="font-mono text-label text-muted-foreground uppercase">{t("properties.background")}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        <SurfaceSwatch isSelected label={t("properties.backgroundOptions.page")} surfaceClassName="bg-background" />
        <SurfaceSwatch isSelected={false} label={t("properties.backgroundOptions.panel")} surfaceClassName="bg-card" />
        <SurfaceSwatch isSelected={false} label={t("properties.backgroundOptions.raised")} surfaceClassName="bg-muted" />
        <button
          aria-label={t("properties.backgroundOptions.image")}
          className={cn(
            SWATCH_BASE,
            "border-dashed border-border bg-background text-muted-foreground hover:border-muted-foreground hover:text-foreground",
          )}
          type="button"
        >
          <ImageIcon aria-hidden className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
        </button>
      </div>
    </div>
  )
}
