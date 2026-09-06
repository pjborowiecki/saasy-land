import { type JSX, type ReactNode, Suspense } from "react"

import { Link, createFileRoute } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { AuthPageFallback } from "~/src/presentation/components/custom/auth/components/auth-page-fallback"
import { AuthPageShell } from "~/src/presentation/components/custom/auth/components/auth-page-shell"
import { ForgotPasswordForm } from "~/src/presentation/components/custom/auth/forgot-password/components/forgot-password-form"

import { ROUTES } from "~/src/routes"

const CROSS_LINK_CLASS =
  "font-medium text-foreground underline-offset-4 transition-colors duration-200 ease-exp hover:text-muted-foreground"

const renderSignInLink = (chunks: ReactNode) => (
  <Link className={CROSS_LINK_CLASS} to={ROUTES.SIGN_IN}>
    {chunks}
  </Link>
)

const authPageFallback = <AuthPageFallback />

const ForgotPasswordPage = (): JSX.Element => (
  <Suspense fallback={authPageFallback}>
    <ForgotPasswordPageContent />
  </Suspense>
)

const ForgotPasswordPageContent = (): JSX.Element => {
  const t = useTranslations("pages.auth.forgot-password")

  return (
    <AuthPageShell
      description={t("form.description")}
      footer={t.rich("form.rememberPassword", { signin: renderSignInLink })}
      title={t("form.title")}
    >
      <ForgotPasswordForm />
    </AuthPageShell>
  )
}

export const Route = createFileRoute("/auth/forgot-password")({
  component: ForgotPasswordPage,
  head: routeHead,
  loader: ({ context }) =>
    loadRouteMessages({
      metadataNamespace: "pages.auth.forgot-password",
      namespaces: [
        "auth.errors",
        "auth.form",
        "auth.gate",
        "auth.layout",
        "auth.oauth",
        "auth.validations",
        "pages.auth.forgot-password",
        "verification.validations",
      ],
      pathname: "/auth/forgot-password",
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
      "pages.auth.forgot-password",
      "verification.validations",
    ],
  },
})
