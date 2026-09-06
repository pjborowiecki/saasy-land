import { createFileRoute } from "@tanstack/react-router"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { LegalPage } from "~/src/presentation/components/custom/legal-page/legal-page"

export const Route = createFileRoute("/_landing/licence")({
  component: () => <LegalPage document="licence" />,
  head: routeHead,
  loader: ({ context }) =>
    loadRouteMessages({
      metadataNamespace: "pages.legal.licence",
      namespaces: ["pages.landing", "pages.legal.licence"],
      pathname: "/licence",
      queryClient: context.queryClient,
    }),
  staticData: { namespaces: ["pages.landing", "pages.legal.licence"] },
})
