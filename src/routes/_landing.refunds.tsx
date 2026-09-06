import { createFileRoute } from "@tanstack/react-router"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { LegalPage } from "~/src/presentation/components/custom/legal-page/legal-page"

export const Route = createFileRoute("/_landing/refunds")({
  component: () => <LegalPage document="refunds" />,
  head: routeHead,
  loader: ({ context }) =>
    loadRouteMessages({
      metadataNamespace: "pages.legal.refunds",
      namespaces: ["pages.landing", "pages.legal.refunds"],
      pathname: "/refunds",
      queryClient: context.queryClient,
    }),
  staticData: { namespaces: ["pages.landing", "pages.legal.refunds"] },
})
