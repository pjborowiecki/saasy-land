import type { Metadata } from "next"
import type { JSX } from "react"

import { Eye, Save, UploadCloud } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/presentation/components/shadcn/button"

import { LandingPageEditorCanvas } from "~/src/app/[locale]/(admin)/admin/landing-page/_components/landing-page-editor-canvas"
import { LandingPagePropertiesPanel } from "~/src/app/[locale]/(admin)/admin/landing-page/_components/landing-page-properties-panel"
import { LandingPageSectionsSidebar } from "~/src/app/[locale]/(admin)/admin/landing-page/_components/landing-page-sections-sidebar"

const ICON_STROKE_WIDTH = 1.5

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.admin.landing-page")

  return {
    description: t("description"),
    title: t("title"),
  }
}

async function LandingPageEditorActions(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.landing-page")

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="lg" className="gap-2">
        <Eye className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
        {t("actions.preview")}
      </Button>
      <Button variant="outline" size="lg" className="gap-2">
        <Save className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
        {t("actions.saveChanges")}
      </Button>
      <Button size="lg" className="gap-2">
        <UploadCloud className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
        {t("actions.publish")}
      </Button>
    </div>
  )
}

export default async function LandingPageEditor(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.landing-page")

  return (
    <div className="flex min-h-0 w-full flex-1 animate-in flex-col pb-4 duration-500 fade-in-50 motion-reduce:animate-none">
      <header className="mb-6 flex shrink-0 flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-statement font-semibold text-balance text-foreground">{t("title")}</h1>
          <p className="mt-0.5 max-w-2xl text-body-sm text-pretty text-muted-foreground">{t("description")}</p>
        </div>
        <LandingPageEditorActions />
      </header>

      <div className="flex min-h-0 flex-1 flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-card lg:flex-row lg:divide-x lg:divide-y-0">
        <LandingPageSectionsSidebar />
        <LandingPageEditorCanvas />
        <LandingPagePropertiesPanel />
      </div>
    </div>
  )
}
