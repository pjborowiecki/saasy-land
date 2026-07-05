import type { JSX } from "react"

import { LandingPageAddSectionDivider } from "~/src/app/[locale]/(admin)/admin/landing-page/_components/landing-page-add-section-divider"
import { LandingPageCanvasToolbar } from "~/src/app/[locale]/(admin)/admin/landing-page/_components/landing-page-canvas-toolbar"
import { LandingPageFeaturesSection } from "~/src/app/[locale]/(admin)/admin/landing-page/_components/landing-page-features-section"
import { LandingPageHeroSection } from "~/src/app/[locale]/(admin)/admin/landing-page/_components/landing-page-hero-section"

export function LandingPageEditorCanvas(): JSX.Element {
  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border/40 bg-card shadow-lg">
      <LandingPageCanvasToolbar />

      <div className="custom-scrollbar flex-1 overflow-y-auto bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px] p-4 lg:p-8">
        <div className="mx-auto max-w-4xl space-y-4">
          <LandingPageHeroSection />
          <LandingPageAddSectionDivider />
          <LandingPageFeaturesSection />
        </div>
      </div>
    </div>
  )
}
