import type { JSX } from "react"

import { createFileRoute } from "@tanstack/react-router"
import { CheckCircle } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { Button } from "~/src/presentation/components/shadcn/button"

import { CreateCourseForm } from "~/src/presentation/components/custom/admin/courses/create/components/create-course-form"

const CreateCoursePage = (): JSX.Element => {
  const t = useTranslations("pages.admin.courses.create")

  return (
    <div className="flex w-full animate-in flex-col space-y-8 duration-500 fade-in-50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-statement font-semibold text-foreground">{t("title")}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="px-3">
            {t("actions.cancel")}
          </Button>
          <Button className="gap-2 px-4">
            <CheckCircle className="size-4" />
            {t("actions.save")}
          </Button>
        </div>
      </div>

      <CreateCourseForm />
    </div>
  )
}

export const Route = createFileRoute("/admin/courses/create")({
  component: CreateCoursePage,
  head: routeHead,
  loader: ({ context }) =>
    loadRouteMessages({
      metadataNamespace: "pages.admin.courses.create",
      namespaces: [
        "auth.errors",
        "auth.validations",
        "pages.admin",
        "pages.admin.courses.create",
        "pages.admin.sidebar",
        "user.validations",
      ],
      pathname: "/admin/courses/create",
      queryClient: context.queryClient,
    }),
  staticData: {
    namespaces: ["auth.errors", "auth.validations", "pages.admin", "pages.admin.courses.create", "pages.admin.sidebar", "user.validations"],
  },
})
