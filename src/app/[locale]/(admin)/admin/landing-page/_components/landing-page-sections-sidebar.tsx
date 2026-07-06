import type { JSX } from "react"

import { Grid3X3, HelpCircle, ImageIcon, Mail, MonitorPlay, Tags, UsersRound, Video, type LucideIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

const LANDING_SECTIONS: {
  icon: LucideIcon
  key: "contact" | "faq" | "features" | "gallery" | "hero" | "pricing" | "testimonials" | "video"
}[] = [
  { icon: MonitorPlay, key: "hero" },
  { icon: Grid3X3, key: "features" },
  { icon: Video, key: "video" },
  { icon: UsersRound, key: "testimonials" },
  { icon: Tags, key: "pricing" },
  { icon: ImageIcon, key: "gallery" },
  { icon: HelpCircle, key: "faq" },
  { icon: Mail, key: "contact" },
]

export async function LandingPageSectionsSidebar(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.landing-page")
  return (
    <div className="flex h-full w-full shrink-0 flex-col lg:w-64">
      <div className="custom-scrollbar flex-1 overflow-y-auto rounded-xl border border-border/40 bg-card p-4">
        <h3 className="mb-4 text-sm font-medium text-foreground">{t("sidebar.addSection")}</h3>
        <div className="space-y-2">
          {LANDING_SECTIONS.map(({ icon: Icon, key }) => (
            <div
              key={key}
              className="group flex cursor-grab items-center gap-3 rounded-lg border border-border/40 bg-secondary/20 p-3 transition-colors hover:bg-secondary/40"
            >
              <Icon className="size-4.5 text-muted-foreground transition-colors group-hover:text-foreground" />
              <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                {t(`sidebar.sections.${key}`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
