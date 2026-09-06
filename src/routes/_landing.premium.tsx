import type { JSX } from "react"

import { createFileRoute } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

const PremiumPage = (): JSX.Element => {
  const t = useTranslations("pages.premium")

  return <div>{t("title")}</div>
}

export const Route = createFileRoute("/_landing/premium")({
  component: PremiumPage,
  head: routeHead,
  loader: ({ context }) =>
    loadRouteMessages({
      metadataNamespace: "pages.premium",
      namespaces: ["pages.landing", "pages.premium"],
      pathname: "/premium",
      queryClient: context.queryClient,
    }),
  staticData: { namespaces: ["pages.landing", "pages.premium"] },
})
