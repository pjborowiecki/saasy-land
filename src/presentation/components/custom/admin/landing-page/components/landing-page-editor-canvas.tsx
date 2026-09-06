import type { JSX } from "react"

import { cn } from "~/src/lib/cn"

import { LandingPageAddSectionDivider } from "~/src/presentation/components/custom/admin/landing-page/components/landing-page-add-section-divider"
import { LandingPageCanvasToolbar } from "~/src/presentation/components/custom/admin/landing-page/components/landing-page-canvas-toolbar"
import { LandingPageFeaturesSection } from "~/src/presentation/components/custom/admin/landing-page/components/landing-page-features-section"
import { LandingPageHeroSection } from "~/src/presentation/components/custom/admin/landing-page/components/landing-page-hero-section"
import { backgroundGridPatternClassName } from "~/src/presentation/components/custom/background"

export const LandingPageEditorCanvas = (): JSX.Element => (
  <div className="flex min-h-0 min-w-0 flex-1 flex-col">
    <LandingPageCanvasToolbar />

    {/*
     * The grid is the canvas's own ruling, so it belongs on its own layer: applied to the
     * scroll container it took `opacity-20` with it and faded every previewed section to a
     * ghost. Behind the content it reads as the workbench it is meant to be.
     */}
    <div className="relative min-h-0 flex-1 bg-background">
      <div aria-hidden className={cn("pointer-events-none absolute inset-0", backgroundGridPatternClassName)} />
      <div className="custom-scrollbar relative h-full overflow-y-auto p-4 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <LandingPageHeroSection />
          <LandingPageAddSectionDivider />
          <LandingPageFeaturesSection />
        </div>
      </div>
    </div>
  </div>
)
