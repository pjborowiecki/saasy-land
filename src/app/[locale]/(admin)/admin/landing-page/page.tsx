import type { Metadata } from "next"
import type { JSX } from "react"

import { Eye, Save, UploadCloud } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/components/shadcn/button"

import { LandingPageEditorCanvas } from "~/src/app/[locale]/(admin)/admin/landing-page/_components/landing-page-editor-canvas"
import { LandingPagePropertiesPanel } from "~/src/app/[locale]/(admin)/admin/landing-page/_components/landing-page-properties-panel"
import { LandingPageSectionsSidebar } from "~/src/app/[locale]/(admin)/admin/landing-page/_components/landing-page-sections-sidebar"

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.landingPage" })

  return {
    description: t("description"),
    title: t("title"),
  }
}

export default async function LandingPageEditor({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<JSX.Element> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.landingPage" })

  return (
    <div className="flex h-[calc(100vh-(--spacing(16)))] w-full animate-in flex-col pb-8 duration-500 fade-in-50">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-medium tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Eye className="size-4" />
            {t("actions.preview")}
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Save className="size-4" />
            {t("actions.saveChanges")}
          </Button>
          <Button className="flex items-center gap-2 shadow-sm">
            <UploadCloud className="size-4" />
            {t("actions.publish")}
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row">
        <LandingPageSectionsSidebar />
        <LandingPageEditorCanvas />
        <LandingPagePropertiesPanel />
      </div>
    </div>
  )
}
