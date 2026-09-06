import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

import { LandingPagePropertiesBackgroundSection } from "~/src/presentation/components/custom/admin/landing-page/components/landing-page-properties-background-section"
import { LandingPagePropertiesButtonSection } from "~/src/presentation/components/custom/admin/landing-page/components/landing-page-properties-button-section"
import { LandingPagePropertiesContentSection } from "~/src/presentation/components/custom/admin/landing-page/components/landing-page-properties-content-section"
import { LandingPagePropertiesLayoutSection } from "~/src/presentation/components/custom/admin/landing-page/components/landing-page-properties-layout-section"
import { LandingPagePropertiesSpacingSection } from "~/src/presentation/components/custom/admin/landing-page/components/landing-page-properties-spacing-section"

interface LandingPagePropertiesHeaderProps {
  readonly description: string
  readonly sectionLabel: string
  readonly title: string
}

const LandingPagePropertiesHeader = ({ description, sectionLabel, title }: LandingPagePropertiesHeaderProps): JSX.Element => (
  <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-4 py-4">
    <div className="min-w-0">
      <h2 className="text-body-sm font-medium text-foreground">{title}</h2>
      <p className="mt-1 text-xs text-pretty text-muted-foreground">{description}</p>
    </div>
    <span className="shrink-0 rounded-sm bg-foreground px-2 py-1 font-mono text-label text-background uppercase">{sectionLabel}</span>
  </div>
)

export const LandingPagePropertiesPanel = (): JSX.Element => {
  const t = useTranslations("pages.admin.landing-page")

  return (
    <aside aria-label={t("properties.title")} className="flex w-full shrink-0 flex-col lg:h-full lg:w-80">
      <LandingPagePropertiesHeader
        description={t("properties.description")}
        sectionLabel={t("sidebar.sections.hero")}
        title={t("properties.title")}
      />

      <div className="custom-scrollbar min-h-0 flex-1 divide-y divide-border overflow-y-auto">
        <LandingPagePropertiesLayoutSection />
        <LandingPagePropertiesSpacingSection />
        <LandingPagePropertiesBackgroundSection />
        <LandingPagePropertiesContentSection />
        <LandingPagePropertiesButtonSection />
      </div>
    </aside>
  )
}
