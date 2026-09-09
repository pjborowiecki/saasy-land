import type { JSX } from "react"

import { Link, type SearchSchemaInput, createFileRoute, redirect } from "@tanstack/react-router"
import { useLocale, useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"
import { localizePathname } from "~/src/integrations/use-intl/i18n.paths"

import { NEWSLETTER_TOKEN_LENGTH } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"
import { confirmNewsletterSubscription } from "~/src/modules/newsletter-subscriber/use-cases/confirm-newsletter-subscription"

import { ROUTES } from "~/src/routes"

const ConfirmNewsletterPage = ({ state }: { state: "confirmed" | "expired" | "error" }): JSX.Element => {
  const t = useTranslations("pages.newsletter.confirm")
  const locale = useLocale()

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
  validateSearch: (search: Record<string, unknown> & SearchSchemaInput) => ({
    status: search["status"] === "confirmed" ? ("confirmed" as const) : ("expired" as const),
    token: typeof search["token"] === "string" ? search["token"] : undefined,
  }),
  loaderDeps: ({ search: { token } }) => ({ token: token ?? "" }),
  component: () => <ConfirmNewsletterPage state={Route.useSearch().status} />,
  errorComponent: () => <ConfirmNewsletterPage state="error" />,
  head: routeHead,
  loader: async ({ context, deps: { token } }) => {
    const messages = await loadRouteMessages({
      metadataNamespace: "pages.newsletter.confirm",
      namespaces: ["pages.landing", "pages.newsletter"],
      pathname: ROUTES.NEWSLETTER_CONFIRM,
      queryClient: context.queryClient,
    })
    if (token) {
      const result = token.length === NEWSLETTER_TOKEN_LENGTH ? await confirmNewsletterSubscription({ data: { token } }) : undefined
      throw redirect({
        replace: true,
        search: { status: result?.confirmed === true ? "confirmed" : "expired" },
        to: ROUTES.NEWSLETTER_CONFIRM,
      })
    }
    return messages
  },
  preload: false,
  staticData: { namespaces: ["pages.landing", "pages.newsletter"] },
})
