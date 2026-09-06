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

  if (license === null) {
    return (
      <div className="flex flex-col gap-8 p-8">
        <CheckoutOptions />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10 p-8">
      <LicensePanel license={license} />
      {license.polarLicenseKeyId !== null && <ActivationList />}
      <Link className="text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground" to={ROUTES.APP}>
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
