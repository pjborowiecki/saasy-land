import type { JSX } from "react"

import { Grid3X3, type LucideIcon, ShieldAlert, UsersRound } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { LandingPageSectionActions } from "~/src/presentation/components/custom/admin/landing-page/components/landing-page-section-actions"

const ICON_STROKE_WIDTH = 1.5

const REVEAL_ON_INTERACTION =
  "opacity-0 transition-opacity duration-200 ease-exp group-focus-within:opacity-100 group-hover:opacity-100 motion-reduce:transition-none"

interface FeatureCardProps {
  readonly barWidth1: string
  readonly barWidth2: string
  readonly icon: LucideIcon
  readonly title: string
}

const LandingPageFeatureCard = ({ barWidth1, barWidth2, icon: Icon, title }: FeatureCardProps): JSX.Element => (
  <div className="flex h-36 flex-col bg-card p-5">
    <Icon aria-hidden className="size-4 shrink-0 text-ring" strokeWidth={ICON_STROKE_WIDTH} />
    <p className="mt-4 text-body-sm font-medium text-foreground">{title}</p>
    <span aria-hidden className={`mt-4 block h-1.5 bg-muted ${barWidth1}`} />
    <span aria-hidden className={`mt-1.5 block h-1.5 bg-muted ${barWidth2}`} />
  </div>
)

export const LandingPageFeaturesSection = (): JSX.Element => {
  const t = useTranslations("pages.admin.landing-page")

  return (
    <section aria-label={t("sidebar.sections.features")} className="group relative border border-border bg-card px-6 py-14 sm:px-12">
      <span
        className={`absolute -top-px -left-px border border-border bg-background px-2 py-1 font-mono text-label text-muted-foreground uppercase ${REVEAL_ON_INTERACTION}`}
      >
        {t("sidebar.sections.features")}
      </span>
      <LandingPageSectionActions className={REVEAL_ON_INTERACTION} />

      <div className="mx-auto max-w-2xl text-center">
        <p className="text-2xl font-semibold tracking-tight text-balance text-foreground">{t("canvas.featuresHeading")}</p>
        <p className="mt-3 text-body-sm text-pretty text-muted-foreground">{t("canvas.featuresSubheading")}</p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-3">
        <LandingPageFeatureCard barWidth1="w-20" barWidth2="w-16" icon={Grid3X3} title={t("canvas.feature1")} />
        <LandingPageFeatureCard barWidth1="w-24" barWidth2="w-12" icon={ShieldAlert} title={t("canvas.feature2")} />
        <LandingPageFeatureCard barWidth1="w-16" barWidth2="w-20" icon={UsersRound} title={t("canvas.feature3")} />
      </div>
    </section>
  )
}
