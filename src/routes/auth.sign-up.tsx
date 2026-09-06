import { type JSX, type ReactNode, Suspense } from "react"

import { Link, createFileRoute } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { AuthPageFallback } from "~/src/presentation/components/custom/auth/components/auth-page-fallback"
import { AuthPageShell } from "~/src/presentation/components/custom/auth/components/auth-page-shell"
import { AuthSeparator } from "~/src/presentation/components/custom/auth/components/auth-separator"
import { OAuthButtons } from "~/src/presentation/components/custom/auth/components/oauth-buttons"
import { SignUpWithPasswordForm } from "~/src/presentation/components/custom/auth/sign-up/components/sign-up-with-password-form"

import { APP_NAME } from "~/src/presentation/branding"
import { ROUTES } from "~/src/routes"

const CROSS_LINK_CLASS =
  "font-medium text-foreground underline-offset-4 transition-colors duration-200 ease-exp hover:text-muted-foreground"

const LEGAL_LINK_CLASS = "text-foreground underline underline-offset-4 transition-colors duration-200 ease-exp hover:text-muted-foreground"

const renderSignInLink = (chunks: ReactNode) => (
  <Link className={CROSS_LINK_CLASS} to={ROUTES.SIGN_IN}>
    {chunks}
  </Link>
)

const renderTermsLink = (chunks: ReactNode) => (
  <Link className={LEGAL_LINK_CLASS} to={ROUTES.TERMS}>
    {chunks}
  </Link>
)

const renderPrivacyLink = (chunks: ReactNode) => (
  <Link className={LEGAL_LINK_CLASS} to={ROUTES.PRIVACY}>
    {chunks}
  </Link>
)

const authPageFallback = <AuthPageFallback />

const SignUpPage = (): JSX.Element => (
  <Suspense fallback={authPageFallback}>
    <SignUpPageContent />
  </Suspense>
)

const SignUpPageContent = (): JSX.Element => {
  const t = useTranslations("pages.auth.sign-up")

  return (
    <AuthPageShell
      description={t("form.description", { name: APP_NAME })}
      footer={t.rich("form.hasAccount", { signin: renderSignInLink })}
      title={t("form.title")}
    >
      <OAuthButtons intent="sign-up" />
      <AuthSeparator label={t("form.or")} />
      <SignUpWithPasswordForm />

      <p className="text-body-sm text-pretty text-muted-foreground">
        {t.rich("form.termsAndPrivacy", { privacy: renderPrivacyLink, terms: renderTermsLink })}
      </p>
    </AuthPageShell>
  )
}

export const Route = createFileRoute("/auth/sign-up")({
  component: SignUpPage,
  head: routeHead,
  loader: ({ context }) =>
    loadRouteMessages({
      metadataNamespace: "pages.auth.sign-up",
      namespaces: [
        "auth.errors",
        "auth.form",
        "auth.gate",
        "auth.layout",
        "auth.oauth",
        "auth.validations",
        "pages.auth.sign-up",
        "verification.validations",
      ],
      pathname: "/auth/sign-up",
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
      "pages.auth.sign-up",
      "verification.validations",
    ],
  },
  validateSearch: (search: Record<string, unknown>): { tier?: string | undefined } => ({
    tier: typeof search["tier"] === "string" ? search["tier"] : undefined,
  }),
})
