import type { JSX } from "react"

import { ImageIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

export async function LandingPagePropertiesBackgroundSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.landing-page")

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{t("properties.background")}</h4>
      <div className="flex flex-wrap gap-3">
        <div className="flex size-10 cursor-pointer items-center justify-center rounded-lg border-2 border-fuchsia-500 bg-background ring-4 ring-fuchsia-500/10">
          <div className="size-1.5 rounded-full bg-fuchsia-500" />
        </div>
        <div className="size-10 cursor-pointer rounded-lg border border-border/40 bg-secondary transition-colors hover:border-border" />
        <div className="size-10 cursor-pointer rounded-lg border border-border/40 bg-linear-to-br from-secondary to-background transition-colors hover:border-border" />
        <div className="flex size-10 cursor-pointer items-center justify-center rounded-lg border border-dashed border-border/40 bg-secondary/20 text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground">
          <ImageIcon className="size-4.5" />
        </div>
      </div>
    </div>
  )
}
