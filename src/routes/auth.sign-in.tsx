import { type JSX, type ReactNode, Suspense } from "react"

import { Link, createFileRoute } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { redirectIfSignedIn } from "~/src/integrations/better-auth/auth.routes"
import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { AuthPageFallback } from "~/src/presentation/components/custom/auth/components/auth-page-fallback"
import { AuthPageShell } from "~/src/presentation/components/custom/auth/components/auth-page-shell"
import { AuthSeparator } from "~/src/presentation/components/custom/auth/components/auth-separator"
import { OAuthButtons } from "~/src/presentation/components/custom/auth/components/oauth-buttons"
import { SignInWithPasswordForm } from "~/src/presentation/components/custom/auth/sign-in/components/sign-in-with-password-form"

import { APP_NAME } from "~/src/presentation/branding"
import { ROUTES } from "~/src/routes"

const CROSS_LINK_CLASS =
  "font-medium text-foreground underline-offset-4 transition-colors duration-200 ease-exp hover:text-muted-foreground"

const renderSignUpLink = (chunks: ReactNode) => (
  <Link className={CROSS_LINK_CLASS} to={ROUTES.SIGN_UP}>
    {chunks}
  </Link>
)

const authPageFallback = <AuthPageFallback />

const SignInPage = (): JSX.Element => (
  <Suspense fallback={authPageFallback}>
    <SignInPageContent />
  </Suspense>
)

const SignInPageContent = (): JSX.Element => {
  const t = useTranslations("pages.auth.sign-in")

  return (
    <AuthPageShell
      description={t("form.description", { name: APP_NAME })}
      footer={t.rich("form.noAccount", { signup: renderSignUpLink })}
      title={t("form.title")}
    >
      <OAuthButtons />
      <AuthSeparator label={t("form.or")} />
      <SignInWithPasswordForm />
    </AuthPageShell>
  )
}

export const Route = createFileRoute("/auth/sign-in")({
  beforeLoad: redirectIfSignedIn,
  component: SignInPage,
  head: routeHead,
  loader: ({ context }) =>
    loadRouteMessages({
      metadataNamespace: "pages.auth.sign-in",
      namespaces: [
        "auth.errors",
        "auth.form",
        "auth.gate",
        "auth.layout",
        "auth.oauth",
        "auth.validations",
        "pages.auth.sign-in",
        "verification.validations",
      ],
      pathname: "/auth/sign-in",
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
      "pages.auth.sign-in",
      "verification.validations",
    ],
  },
})
