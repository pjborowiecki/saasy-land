import { type JSX, Suspense } from "react"

import { createFileRoute } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { AuthPageFallback } from "~/src/presentation/components/custom/auth/components/auth-page-fallback"
import { AuthPageShell } from "~/src/presentation/components/custom/auth/components/auth-page-shell"
import { VerifyEmailPanel } from "~/src/presentation/components/custom/auth/verify-email/components/verify-email-panel"

const authPageFallback = <AuthPageFallback />

const VerifyEmailPage = (): JSX.Element => {
  const searchParams = Route.useSearch()
  return (
    <Suspense fallback={authPageFallback}>
      <VerifyEmailPageContent searchParams={searchParams} />
    </Suspense>
  )
}

const VerifyEmailPageContent = ({ searchParams }: { searchParams: Record<string, string | undefined> }): JSX.Element => {
  const t = useTranslations("pages.auth.verify-email")
  const resolvedSearchParams = searchParams
  const token = typeof resolvedSearchParams["token"] === "string" ? resolvedSearchParams["token"] : undefined
  const email = typeof resolvedSearchParams["email"] === "string" ? resolvedSearchParams["email"] : undefined

  return (
    <AuthPageShell description={t("form.description")} title={t("form.title")}>
      <VerifyEmailPanel {...(email === undefined ? {} : { email })} {...(token === undefined ? {} : { token })} />
    </AuthPageShell>
  )
}

export const Route = createFileRoute("/auth/verify-email")({
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
      pathname: "/auth/verify-email",
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
  validateSearch: (search: Record<string, unknown>): Record<string, string | undefined> =>
    Object.fromEntries(Object.entries(search).filter((entry): entry is [string, string] => typeof entry[1] === "string")),
})
