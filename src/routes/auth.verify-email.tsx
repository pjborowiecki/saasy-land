import { createFileRoute, redirect } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"
import { localizePathname } from "~/src/integrations/use-intl/i18n.paths"
import { getCurrentLocale } from "~/src/integrations/use-intl/i18n.utils"

import { AuthPageShell } from "~/src/presentation/components/custom/auth/components/auth-page-shell"
import { VerifyEmailPanel } from "~/src/presentation/components/custom/auth/verify-email/components/verify-email-panel"

import { ROUTES } from "~/src/routes"

const VerifyEmailPage = () => {
  const { email, error } = Route.useSearch()
  const t = useTranslations("pages.auth.verify-email")

  return (
    <AuthPageShell description={t("form.description")} title={t("form.title")}>
      <VerifyEmailPanel email={email} invalid={Boolean(error)} />
    </AuthPageShell>
  )
}

export const Route = createFileRoute("/auth/verify-email")({
  beforeLoad: ({ preload, search }) => {
    if (preload) {
      return
    }
    if (search.token) {
      const callbackURL = localizePathname({
        locale: getCurrentLocale(),
        pathname: `${ROUTES.VERIFY_EMAIL}?verified=true`,
      })
      const query = new URLSearchParams({ callbackURL, token: search.token })
      throw redirect({ href: `${ROUTES.API_AUTH_VERIFY_EMAIL}?${query}`, reloadDocument: true, replace: true })
    }
    if (search.verified && !search.error) {
      throw redirect({ replace: true, to: ROUTES.AUTH_CALLBACK })
    }
  },
  component: VerifyEmailPage,
  head: routeHead,
  loader: ({ context }) =>
    loadRouteMessages({
      metadataNamespace: "pages.auth.verify-email",
      namespaces: [
        "auth.errors",
        "auth.form",
        "auth.gate",
        "auth.layout",
        "auth.oauth",
        "auth.validations",
        "pages.auth.verify-email",
        "verification.validations",
      ],
      pathname: ROUTES.VERIFY_EMAIL,
      queryClient: context.queryClient,
    }),
  staticData: {
    namespaces: [
      "auth.errors",
      "auth.form",
      "auth.gate",
      "auth.layout",
      "auth.oauth",
      "auth.validations",
      "pages.auth.verify-email",
      "verification.validations",
    ],
  },
  validateSearch: (search: Record<string, unknown>) => ({
    email: typeof search["email"] === "string" ? search["email"] : "",
    error: typeof search["error"] === "string" ? search["error"] : "",
    token: typeof search["token"] === "string" ? search["token"] : "",
    verified: search["verified"] === true || search["verified"] === "true",
  }),
})
