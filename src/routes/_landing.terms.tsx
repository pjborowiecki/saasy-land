import { createFileRoute } from "@tanstack/react-router"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { LegalPage } from "~/src/presentation/components/custom/legal-page/legal-page"

export const Route = createFileRoute("/_landing/terms")({
  component: () => <LegalPage document="terms" />,
  head: routeHead,
  loader: ({ context }) =>
    loadRouteMessages({
      metadataNamespace: "pages.legal.terms",
      namespaces: ["pages.landing", "pages.legal.terms"],
      pathname: "/terms",
      queryClient: context.queryClient,
    }),
  staticData: { namespaces: ["pages.landing", "pages.legal.terms"] },
})
