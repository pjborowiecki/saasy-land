import type { JSX } from "react"

import { useSuspenseQuery } from "@tanstack/react-query"
import { Link, createFileRoute } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { currentLicenseQuery } from "~/src/modules/license/use-cases/get-current-license"

import { CheckoutOptions } from "~/src/presentation/components/custom/app/components/checkout-options"

import { ROUTES } from "~/src/routes"

const AppPage = (): JSX.Element => {
  const t = useTranslations("pages.app")
  const owned = useSuspenseQuery(currentLicenseQuery).data

  return (
    <div className="flex flex-col gap-8 p-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </header>
      {owned === null ? (
        <CheckoutOptions />
      ) : (
        <Link
          className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors duration-200 hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          to={ROUTES.APP_LICENSE}
        >
          {t("license")}
        </Link>
      )}
    </div>
  )
}

export const Route = createFileRoute("/app/")({
  component: AppPage,
  head: routeHead,
  loader: async ({ context }) => {
    const [metadata] = await Promise.all([
      loadRouteMessages({
        metadataNamespace: "pages.app",
        namespaces: ["pages.app", "pages.license"],
        pathname: "/app",
        queryClient: context.queryClient,
      }),
      context.queryClient.query({ ...currentLicenseQuery, staleTime: "static" }),
    ])
    return metadata
  },
  staticData: { namespaces: ["pages.app", "pages.license"] },
})
