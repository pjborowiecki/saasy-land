import { type JSX } from "react"

import { Link, createFileRoute } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { cn } from "~/src/lib/cn"

import { buttonVariants } from "~/src/presentation/components/shadcn/_lib/button-variants"

import { AuthPageShell } from "~/src/presentation/components/custom/auth/components/auth-page-shell"
import { AUTH_PRIMARY_BUTTON_CLASS } from "~/src/presentation/components/custom/auth/constants/auth-styles"
import { ResetPasswordForm } from "~/src/presentation/components/custom/auth/reset-password/components/reset-password-form"

import { ROUTES } from "~/src/routes"

const ResetPasswordPage = (): JSX.Element => {
  const t = useTranslations("pages.auth.reset-password")
  const { error, token } = Route.useSearch()
  const resetToken = error === undefined && typeof token === "string" ? token : undefined

  return (
    <AuthPageShell description={t("form.description")} title={t("form.title")}>
      {resetToken === undefined ? (
        <>
          <p className="text-body text-pretty text-destructive">{typeof error === "string" ? error : t("form.invalidToken")}</p>
          <Link className={cn(buttonVariants(), AUTH_PRIMARY_BUTTON_CLASS)} to={ROUTES.FORGOT_PASSWORD}>
            {t("form.requestNewLink")}
          </Link>
        </>
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
