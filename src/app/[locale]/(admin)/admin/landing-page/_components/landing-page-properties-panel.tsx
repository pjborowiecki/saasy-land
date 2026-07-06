import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { LandingPagePropertiesBackgroundSection } from "~/src/app/[locale]/(admin)/admin/landing-page/_components/landing-page-properties-background-section"
import { LandingPagePropertiesButtonSection } from "~/src/app/[locale]/(admin)/admin/landing-page/_components/landing-page-properties-button-section"
import { LandingPagePropertiesContentSection } from "~/src/app/[locale]/(admin)/admin/landing-page/_components/landing-page-properties-content-section"
import { LandingPagePropertiesLayoutSection } from "~/src/app/[locale]/(admin)/admin/landing-page/_components/landing-page-properties-layout-section"
import { LandingPagePropertiesSpacingSection } from "~/src/app/[locale]/(admin)/admin/landing-page/_components/landing-page-properties-spacing-section"

export async function LandingPagePropertiesPanel(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.landing-page")

  return (
    <div className="flex h-full w-full shrink-0 flex-col lg:w-80">
      <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto rounded-xl border border-border/40 bg-card p-5">
        <LandingPagePropertiesHeader
          description={t("properties.description")}
          sectionLabel={t("sidebar.sections.hero")}
          title={t("properties.title")}
        />

        <LandingPagePropertiesLayoutSection />
        <LandingPagePropertiesSpacingSection />
        <LandingPagePropertiesBackgroundSection />
        <LandingPagePropertiesContentSection />
        <LandingPagePropertiesButtonSection />
      </div>
    </div>
  )
}

interface LandingPagePropertiesHeaderProps {
  readonly description: string
  readonly sectionLabel: string
  readonly title: string
}

function LandingPagePropertiesHeader({ description, sectionLabel, title }: LandingPagePropertiesHeaderProps): JSX.Element {
  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-4">
      <div>
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <span className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-2 py-1 text-[10px] font-bold tracking-wider text-fuchsia-500 uppercase">
        {sectionLabel}
      </span>
    </div>
  )
}
