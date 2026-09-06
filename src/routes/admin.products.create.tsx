import type { JSX } from "react"

import { createFileRoute } from "@tanstack/react-router"
import { CheckCircle } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { Button } from "~/src/presentation/components/shadcn/button"

import { CreateProductForm } from "~/src/presentation/components/custom/admin/products/create/components/create-product-form"

const CreateProductPage = (): JSX.Element => {
  const t = useTranslations("pages.admin.products.create")

  return (
    <div className="flex w-full animate-in flex-col space-y-8 duration-500 fade-in-50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-statement font-semibold text-foreground">{t("title")}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="h-9 px-3">
            {t("actions.cancel")}
          </Button>
          <Button className="h-9 gap-2 px-4">
            <CheckCircle className="size-4" />
            {t("actions.save")}
          </Button>
        </div>
      </div>

      <CreateProductForm />
    </div>
  )
}

export const Route = createFileRoute("/admin/products/create")({
  component: CreateProductPage,
  head: routeHead,
  loader: ({ context }) =>
    loadRouteMessages({
      metadataNamespace: "pages.admin.products.create",
      namespaces: [
        "auth.errors",
        "auth.validations",
        "pages.admin",
        "pages.admin.products",
        "pages.admin.products.create",
        "pages.admin.sidebar",
        "user.validations",
      ],
      pathname: "/admin/products/create",
      queryClient: context.queryClient,
    }),
  staticData: {
    namespaces: [
      "auth.errors",
      "auth.validations",
      "pages.admin",
      "pages.admin.products",
      "pages.admin.products.create",
      "pages.admin.sidebar",
      "user.validations",
    ],
  },
})
