import type { JSX } from "react"

import { useSuspenseQuery } from "@tanstack/react-query"
import { Link, createFileRoute } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { currentLicenseQuery, licenseActivationsQuery } from "~/src/modules/license/use-cases/get-current-license"

import { CheckoutOptions } from "~/src/presentation/components/custom/app/components/checkout-options"
import { ActivationList } from "~/src/presentation/components/custom/app/license/components/activation-list"
import { LicensePanel } from "~/src/presentation/components/custom/app/license/components/license-panel"

import { ROUTES } from "~/src/routes"

const LicensePage = (): JSX.Element => {
  const t = useTranslations("pages.license")
  const license = useSuspenseQuery(currentLicenseQuery).data

  return (
    <div className="flex w-full flex-col gap-8 pb-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-statement font-semibold text-foreground">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </header>
      {license === null ? (
        <CheckoutOptions />
      ) : (
        <>
          <LicensePanel license={license} />
          {license.polarLicenseKeyId !== null && <ActivationList />}
        </>
      )}
      <Link
        className="w-fit text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        to={ROUTES.APP}
      >
        {t("back")}
      </Link>
    </div>
  )
}

export const Route = createFileRoute("/app/license")({
  component: LicensePage,
  head: routeHead,
  loader: async ({ context }) => {
    const [metadata] = await Promise.all([
      loadRouteMessages({
        metadataNamespace: "pages.license",
        namespaces: ["pages.license"],
        pathname: "/app/license",
        queryClient: context.queryClient,
      }),
      context.queryClient.query({ ...currentLicenseQuery, staleTime: "static" }),
      context.queryClient.query({ ...licenseActivationsQuery, staleTime: "static" }),
    ])
    return metadata
  },
  staticData: { namespaces: ["pages.license"] },
})
