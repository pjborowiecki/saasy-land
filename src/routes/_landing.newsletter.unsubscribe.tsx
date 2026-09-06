import { type JSX, useEffect, useRef } from "react"

import { useMutation } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { NEWSLETTER_TOKEN_LENGTH } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"
import { unsubscribeFromNewsletterMutation } from "~/src/modules/newsletter-subscriber/use-cases/unsubscribe-from-newsletter"

import { UnsubscribeConfirmation } from "~/src/presentation/components/custom/landing-page/components/unsubscribe-confirmation"

const UnsubscribePage = (): JSX.Element => {
  const searchParams = Route.useSearch()
  const { token } = searchParams
  const t = useTranslations("pages.newsletter.unsubscribe")

  const unsubscribe = useMutation(unsubscribeFromNewsletterMutation)
  const { mutate } = unsubscribe
  const submittedToken = useRef<string | undefined>(undefined)
  const validToken = typeof token === "string" && token.length === NEWSLETTER_TOKEN_LENGTH
  useEffect(() => {
    if (validToken && submittedToken.current !== token) {
      submittedToken.current = token
      mutate({ token })
    }
  }, [mutate, token, validToken])

  let state: "pending" | "error" | "success" = "pending"
  if (!validToken || unsubscribe.isError) {
    state = "error"
  } else if (unsubscribe.isSuccess) {
    state = "success"
  }
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
  component: UnsubscribePage,
  head: routeHead,
  loader: ({ context }) =>
    loadRouteMessages({
      metadataNamespace: "pages.newsletter.unsubscribe",
      namespaces: ["pages.landing", "pages.newsletter"],
      pathname: "/newsletter/unsubscribe",
      queryClient: context.queryClient,
    }),
  staticData: { namespaces: ["pages.landing", "pages.newsletter"] },
  validateSearch: (search: Record<string, unknown>): Record<string, string | undefined> =>
    Object.fromEntries(Object.entries(search).filter((entry): entry is [string, string] => typeof entry[1] === "string")),
})
