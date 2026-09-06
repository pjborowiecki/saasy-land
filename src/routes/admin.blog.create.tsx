import type { JSX } from "react"

import { createFileRoute } from "@tanstack/react-router"
import { Eye, Save, Send } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { Button } from "~/src/presentation/components/shadcn/button"

import { CreateBlogPostEditor } from "~/src/presentation/components/custom/admin/blog/create/components/create-blog-post-editor"
import { CreateBlogPostSettings } from "~/src/presentation/components/custom/admin/blog/create/components/create-blog-post-settings"

const CreateBlogPostPage = (): JSX.Element => {
  const t = useTranslations("pages.admin.blog.create")

  return (
    <div className="flex w-full animate-in flex-col space-y-8 duration-500 fade-in-50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-statement font-semibold text-foreground">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9 gap-2 px-4 shadow-sm">
            <Eye className="size-4" />
            {t("actions.preview")}
          </Button>
          <Button variant="outline" className="h-9 gap-2 px-4 shadow-sm">
            <Save className="size-4" />
            {t("actions.saveDraft")}
          </Button>
          <Button className="h-9 gap-2 px-4 shadow-sm">
            <Send className="size-4" />
            {t("actions.publish")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
        <CreateBlogPostEditor />
        <CreateBlogPostSettings />
      </div>
    </div>
  )
}

export const Route = createFileRoute("/admin/blog/create")({
  component: CreateBlogPostPage,
  head: routeHead,
  loader: ({ context }) =>
    loadRouteMessages({
      metadataNamespace: "pages.admin.blog.create",
      namespaces: [
        "auth.errors",
        "auth.validations",
        "pages.admin",
        "pages.admin.blog",
        "pages.admin.blog.create",
        "pages.admin.sidebar",
        "user.validations",
      ],
      pathname: "/admin/blog/create",
      queryClient: context.queryClient,
    }),
  staticData: {
    namespaces: [
      "auth.errors",
      "auth.validations",
      "pages.admin",
      "pages.admin.blog",
      "pages.admin.blog.create",
      "pages.admin.sidebar",
      "user.validations",
    ],
  },
})
