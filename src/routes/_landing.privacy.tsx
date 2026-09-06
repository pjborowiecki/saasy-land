import { createFileRoute } from "@tanstack/react-router"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { LegalPage } from "~/src/presentation/components/custom/legal-page/legal-page"

export const Route = createFileRoute("/_landing/privacy")({
  component: () => <LegalPage document="privacy" />,
  head: routeHead,
  loader: ({ context }) =>
    loadRouteMessages({
      metadataNamespace: "pages.legal.privacy",
      namespaces: ["pages.landing", "pages.legal.privacy"],
      pathname: "/privacy",
      queryClient: context.queryClient,
    }),
  staticData: { namespaces: ["pages.landing", "pages.legal.privacy"] },
})
