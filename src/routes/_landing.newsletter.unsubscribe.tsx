import type { JSX } from "react"

import { type SearchSchemaInput, createFileRoute, redirect } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { NEWSLETTER_TOKEN_LENGTH } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"
import { unsubscribeFromNewsletter } from "~/src/modules/newsletter-subscriber/use-cases/unsubscribe-from-newsletter"

import { UnsubscribeConfirmation } from "~/src/presentation/components/custom/landing-page/components/unsubscribe-confirmation"

import { ROUTES } from "~/src/routes"

const UnsubscribePage = ({ state }: { state: "success" | "error" }): JSX.Element => {
  const t = useTranslations("pages.newsletter.unsubscribe")

  return (
    <UnsubscribeConfirmation
      body={state === "success" ? t("body") : t(`${state}.body`)}
      note={t("note")}
      resubscribe={t("resubscribe")}
      title={state === "success" ? t("title") : t(`${state}.title`)}
    />
  )
}

export const Route = createFileRoute("/_landing/newsletter/unsubscribe")({
  validateSearch: (search: Record<string, unknown> & SearchSchemaInput) => ({
    status: search["status"] === "success" ? ("success" as const) : ("error" as const),
    token: typeof search["token"] === "string" ? search["token"] : undefined,
  }),
  loaderDeps: ({ search: { token } }) => ({ token: token ?? "" }),
  component: () => <UnsubscribePage state={Route.useSearch().status} />,
  errorComponent: () => <UnsubscribePage state="error" />,
  head: routeHead,
  loader: async ({ context, deps: { token } }) => {
    const messages = await loadRouteMessages({
      metadataNamespace: "pages.newsletter.unsubscribe",
      namespaces: ["pages.landing", "pages.newsletter"],
      pathname: ROUTES.NEWSLETTER_UNSUBSCRIBE,
      queryClient: context.queryClient,
    })
    if (token) {
      if (token.length !== NEWSLETTER_TOKEN_LENGTH) {
        throw redirect({ replace: true, search: { status: "error" }, to: ROUTES.NEWSLETTER_UNSUBSCRIBE })
      }
      await unsubscribeFromNewsletter({ data: { token } })
      throw redirect({ replace: true, search: { status: "success" }, to: ROUTES.NEWSLETTER_UNSUBSCRIBE })
    }
    return messages
  },
  preload: false,
  staticData: { namespaces: ["pages.landing", "pages.newsletter"] },
})
