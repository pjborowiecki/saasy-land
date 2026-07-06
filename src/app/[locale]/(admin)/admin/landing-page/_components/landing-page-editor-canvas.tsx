import type { JSX } from "react"

import { cn } from "~/src/lib/_utils/ui"

import { backgroundGridPatternClassName } from "~/src/components/custom/background"

import { LandingPageAddSectionDivider } from "~/src/app/[locale]/(admin)/admin/landing-page/_components/landing-page-add-section-divider"
import { LandingPageCanvasToolbar } from "~/src/app/[locale]/(admin)/admin/landing-page/_components/landing-page-canvas-toolbar"
import { LandingPageFeaturesSection } from "~/src/app/[locale]/(admin)/admin/landing-page/_components/landing-page-features-section"
import { LandingPageHeroSection } from "~/src/app/[locale]/(admin)/admin/landing-page/_components/landing-page-hero-section"

export function LandingPageEditorCanvas(): JSX.Element {
  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border/40 bg-card shadow-lg">
      <LandingPageCanvasToolbar />

      <div className={cn("custom-scrollbar flex-1 overflow-y-auto p-4 lg:p-8", backgroundGridPatternClassName)}>
        <div className="mx-auto max-w-4xl space-y-4">
          <LandingPageHeroSection />
          <LandingPageAddSectionDivider />
          <LandingPageFeaturesSection />
        </div>
      </div>
    </div>
  )
}
