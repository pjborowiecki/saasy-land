import type { JSX } from "react"

import { createFileRoute } from "@tanstack/react-router"
import { Eye, Save, UploadCloud } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { Button } from "~/src/presentation/components/shadcn/button"

import { LandingPageEditorCanvas } from "~/src/presentation/components/custom/admin/landing-page/components/landing-page-editor-canvas"
import { LandingPagePropertiesPanel } from "~/src/presentation/components/custom/admin/landing-page/components/landing-page-properties-panel"
import { LandingPageSectionsSidebar } from "~/src/presentation/components/custom/admin/landing-page/components/landing-page-sections-sidebar"

const ICON_STROKE_WIDTH = 1.5

const LandingPageEditorActions = (): JSX.Element => {
  const t = useTranslations("pages.admin.landing-page")

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

const LandingPageEditor = (): JSX.Element => {
  const t = useTranslations("pages.admin.landing-page")

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

export const Route = createFileRoute("/admin/landing-page")({
  component: LandingPageEditor,
  head: routeHead,
  loader: ({ context }) =>
    loadRouteMessages({
      metadataNamespace: "pages.admin.landing-page",
      namespaces: ["auth.errors", "auth.validations", "pages.admin", "pages.admin.landing-page", "pages.admin.sidebar", "user.validations"],
      pathname: "/admin/landing-page",
      queryClient: context.queryClient,
    }),
  staticData: {
    namespaces: ["auth.errors", "auth.validations", "pages.admin", "pages.admin.landing-page", "pages.admin.sidebar", "user.validations"],
  },
})
