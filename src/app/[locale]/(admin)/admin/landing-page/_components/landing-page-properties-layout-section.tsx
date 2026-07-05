import type { JSX } from "react"

import { AlignCenter, AlignLeft, AlignRight } from "lucide-react"
import { getTranslations } from "next-intl/server"

export async function LandingPagePropertiesLayoutSection(): Promise<JSX.Element> {
  const t = await getTranslations("admin.landingPage")

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{t("properties.layout")}</h4>
      <div className="grid grid-cols-3 gap-2 rounded-lg border border-border/40 bg-secondary/20 p-1">
        <button
          type="button"
          className="flex justify-center rounded border border-transparent p-2 text-muted-foreground transition-colors hover:bg-secondary/40"
        >
          <AlignLeft className="size-4.5" />
        </button>
        <button type="button" className="flex justify-center rounded bg-secondary p-2 text-foreground shadow-sm">
          <AlignCenter className="size-4.5" />
        </button>
        <button
          type="button"
          className="flex justify-center rounded border border-transparent p-2 text-muted-foreground transition-colors hover:bg-secondary/40"
        >
          <AlignRight className="size-4.5" />
        </button>
      </div>
    </div>
  )
}
