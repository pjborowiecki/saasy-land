import type { JSX } from "react"

import { type LucideIcon, Grid3X3, ShieldAlert, UsersRound } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { LandingPageSectionActions } from "~/src/app/[locale]/(admin)/admin/landing-page/_components/landing-page-section-actions"

interface FeatureCardProps {
  readonly barWidth1: string
  readonly barWidth2: string
  readonly icon: LucideIcon
  readonly title: string
}

function LandingPageFeatureCard({ barWidth1, barWidth2, icon: Icon, title }: FeatureCardProps): JSX.Element {
  return (
    <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-border/40 bg-secondary/10 p-5 text-center transition-colors hover:bg-secondary/20">
      <Icon className="mb-3 size-8 text-fuchsia-500" />
      <h3 className="mb-2 text-sm font-medium text-foreground">{title}</h3>
      <div className={`mx-auto mb-1 h-1.5 ${barWidth1} rounded-full bg-border/50`} />
      <div className={`mx-auto h-1.5 ${barWidth2} rounded-full bg-border/50`} />
    </div>
  )
}

export async function LandingPageFeaturesSection(): Promise<JSX.Element> {
  const t = await getTranslations("admin.landingPage")

  return (
    <div className="group relative rounded-xl border border-dashed border-border/30 bg-secondary/5 p-12 transition-colors hover:border-border/60">
      <div className="absolute top-3 left-3 rounded-full bg-secondary px-3 py-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
        {t("sidebar.sections.features")}
      </div>
      <LandingPageSectionActions className="opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="mb-10 text-center opacity-70 transition-opacity group-hover:opacity-100">
        <h2 className="mb-3 text-2xl font-semibold text-foreground">{t("canvas.featuresHeading")}</h2>
        <p className="text-sm text-muted-foreground">{t("canvas.featuresSubheading")}</p>
      </div>
      <div className="grid grid-cols-1 gap-6 opacity-70 transition-opacity group-hover:opacity-100 md:grid-cols-3">
        <LandingPageFeatureCard barWidth1="w-20" barWidth2="w-16" icon={Grid3X3} title={t("canvas.feature1")} />
        <LandingPageFeatureCard barWidth1="w-24" barWidth2="w-12" icon={ShieldAlert} title={t("canvas.feature2")} />
        <LandingPageFeatureCard barWidth1="w-16" barWidth2="w-20" icon={UsersRound} title={t("canvas.feature3")} />
      </div>
    </div>
  )
}
