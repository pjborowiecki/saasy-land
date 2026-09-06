import { type JSX, Suspense } from "react"

import { Link, createFileRoute } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { cn } from "~/src/lib/cn"

import { buttonVariants } from "~/src/presentation/components/shadcn/_lib/button-variants"

import { AuthPageFallback } from "~/src/presentation/components/custom/auth/components/auth-page-fallback"
import { AuthPageShell } from "~/src/presentation/components/custom/auth/components/auth-page-shell"
import { AUTH_PRIMARY_BUTTON_CLASS } from "~/src/presentation/components/custom/auth/constants/auth-styles"
import { ResetPasswordForm } from "~/src/presentation/components/custom/auth/reset-password/components/reset-password-form"

import { ROUTES } from "~/src/routes"

const authPageFallback = <AuthPageFallback />

const ResetPasswordPage = (): JSX.Element => {
  const searchParams = Route.useSearch()
  return (
    <Suspense fallback={authPageFallback}>
      <ResetPasswordPageContent searchParams={searchParams} />
    </Suspense>
  )
}

/** A dead link is a dead end: state the fault, then give the one control that fixes it. */
const ResetPasswordInvalidToken = ({ message, requestLabel }: Readonly<{ message: string; requestLabel: string }>): JSX.Element => (
  <>
    <p className="text-body text-pretty text-destructive">{message}</p>
    <Link className={cn(buttonVariants(), AUTH_PRIMARY_BUTTON_CLASS)} to={ROUTES.FORGOT_PASSWORD}>
      {requestLabel}
    </Link>
  </>
)

const ResetPasswordPageContent = ({ searchParams }: { searchParams: Record<string, string | undefined> }): JSX.Element => {
  const t = useTranslations("pages.auth.reset-password")
  const { error, token } = searchParams
  const resetToken = error === undefined && typeof token === "string" ? token : undefined

  return (
    <AuthPageShell description={t("form.description")} title={t("form.title")}>
      {resetToken === undefined ? (
        <ResetPasswordInvalidToken
          message={typeof error === "string" ? error : t("form.invalidToken")}
          requestLabel={t("form.requestNewLink")}
        />
      ) : (
        <ResetPasswordForm token={resetToken} />
      )}
    </AuthPageShell>
  )
}

export const Route = createFileRoute("/auth/reset-password")({
  component: ResetPasswordPage,
  head: routeHead,
  loader: ({ context }) =>
    loadRouteMessages({
      metadataNamespace: "pages.auth.reset-password",
      namespaces: [
        "auth.errors",
        "auth.form",
        "auth.gate",
        "auth.layout",
        "auth.oauth",
        "auth.validations",
        "pages.auth.reset-password",
        "verification.validations",
      ],
      pathname: "/auth/reset-password",
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
      "pages.auth.reset-password",
      "verification.validations",
    ],
  },
  validateSearch: (search: Record<string, unknown>): Record<string, string | undefined> =>
    Object.fromEntries(Object.entries(search).filter((entry): entry is [string, string] => typeof entry[1] === "string")),
})
