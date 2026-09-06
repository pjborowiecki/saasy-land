import { type JSX, useEffect, useRef } from "react"

import { useMutation } from "@tanstack/react-query"
import { Link, createFileRoute } from "@tanstack/react-router"
import { useLocale, useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"
import { localizePathname } from "~/src/integrations/use-intl/i18n.paths"

import { NEWSLETTER_TOKEN_LENGTH } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"
import { confirmNewsletterSubscriptionMutation } from "~/src/modules/newsletter-subscriber/use-cases/confirm-newsletter-subscription"

import { ROUTES } from "~/src/routes"

const ConfirmNewsletterPage = (): JSX.Element => {
  const searchParams = Route.useSearch()
  const { token } = searchParams
  const t = useTranslations("pages.newsletter.confirm")
  const locale = useLocale()

  const confirm = useMutation(confirmNewsletterSubscriptionMutation)
  const { mutate } = confirm
  const submittedToken = useRef<string | undefined>(undefined)
  const validToken = typeof token === "string" && token.length === NEWSLETTER_TOKEN_LENGTH
  useEffect(() => {
    if (validToken && submittedToken.current !== token) {
      submittedToken.current = token
      mutate({ token })
    }
  }, [mutate, token, validToken])
  let state: "confirmed" | "expired" | "pending" | "error" = "expired"
  if (confirm.isError) {
    state = "error"
  } else if (validToken && (confirm.isIdle || confirm.isPending)) {
    state = "pending"
  } else if (confirm.data?.confirmed === true) {
    state = "confirmed"
  }

  return (
    <section className="relative">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-6 py-32 text-center md:py-40">
        <h1 className="text-headline-peak text-balance text-foreground">{t(`${state}.title`)}</h1>
        <p className="mt-5 text-lead text-pretty text-muted-foreground">{t(`${state}.body`)}</p>
        <p className="mt-8 text-body-sm text-pretty text-muted-foreground">{t(`${state}.note`)}</p>
        <Link
          className="mt-10 rounded-sm text-body-sm font-medium text-foreground underline underline-offset-4 transition-colors duration-200 ease-exp hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          to={localizePathname({ locale, pathname: ROUTES.HOME })}
        >
          {t(`${state}.action`)}
        </Link>
      </div>
    </section>
  )
}

export const Route = createFileRoute("/_landing/newsletter/confirm")({
  component: ConfirmNewsletterPage,
  head: routeHead,
  loader: ({ context }) =>
    loadRouteMessages({
      metadataNamespace: "pages.newsletter.confirm",
      namespaces: ["pages.landing", "pages.newsletter"],
      pathname: "/newsletter/confirm",
      queryClient: context.queryClient,
    }),
  staticData: { namespaces: ["pages.landing", "pages.newsletter"] },
  validateSearch: (search: Record<string, unknown>): Record<string, string | undefined> =>
    Object.fromEntries(Object.entries(search).filter((entry): entry is [string, string] => typeof entry[1] === "string")),
})
