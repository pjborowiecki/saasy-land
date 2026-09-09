import type { JSX } from "react"

import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { LICENSE_STATUS } from "~/src/modules/license/license.constants"
import { currentLicenseQuery } from "~/src/modules/license/use-cases/get-current-license"

import { Badge } from "~/src/presentation/components/shadcn/badge"
import { LinkButton } from "~/src/presentation/components/shadcn/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "~/src/presentation/components/shadcn/card"

import { CheckoutOptions } from "~/src/presentation/components/custom/app/components/checkout-options"

import { CONTACT_EMAIL } from "~/src/presentation/branding"
import { ROUTES } from "~/src/routes"

const AppPage = (): JSX.Element => {
  const t = useTranslations("pages.app")
  const license = useTranslations("pages.license")
  const owned = useSuspenseQuery(currentLicenseQuery).data
  let status: "active" | "revoked" | "pending" = "pending"
  if (owned?.status === LICENSE_STATUS.REVOKED) {
    status = "revoked"
  } else if (typeof owned?.key === "string" && owned.key.length > 0) {
    status = "active"
  }

  return (
    <div className="flex w-full flex-col gap-8 pb-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-statement font-semibold text-foreground">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </header>
      {owned === null ? (
        <CheckoutOptions />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              <h2>{t("overview.license.title")}</h2>
            </CardTitle>
            <CardDescription>{t("overview.license.description")}</CardDescription>
            <CardAction>
              <Badge variant={status === "revoked" ? "destructive" : "secondary"}>{t(`overview.license.${status}`)}</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-lg font-semibold text-foreground">{license(`tier.${owned.tier}`)}</p>
            <LinkButton href={ROUTES.APP_LICENSE} size="sm" variant="outline">
              {t("license")}
            </LinkButton>
          </CardContent>
        </Card>
      )}
      <div className="grid gap-8 sm:grid-cols-2">
        <section className="flex flex-col items-start gap-3">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold">{t("overview.docs.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("overview.docs.description")}</p>
          </div>
          <LinkButton href={ROUTES.DOCS} size="sm" variant="outline">
            {t("overview.docs.action")}
          </LinkButton>
        </section>
        <section className="flex flex-col items-start gap-3">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold">{t("overview.support.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("overview.support.description")}</p>
          </div>
          <LinkButton href={`mailto:${CONTACT_EMAIL}`} size="sm" variant="outline">
            {t("overview.support.action")}
          </LinkButton>
        </section>
      </div>
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
