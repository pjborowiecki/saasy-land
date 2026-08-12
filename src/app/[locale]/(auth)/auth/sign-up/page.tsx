import type { Metadata } from "next"
import { Suspense, type JSX, type ReactNode } from "react"

import { getTranslations } from "next-intl/server"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { AuthPageFallback } from "~/src/app/[locale]/(auth)/auth/_components/auth-page-fallback"
import { AuthPageShell } from "~/src/app/[locale]/(auth)/auth/_components/auth-page-shell"
import { AuthSeparator } from "~/src/app/[locale]/(auth)/auth/_components/auth-separator"
import { OAuthButtons } from "~/src/app/[locale]/(auth)/auth/_components/oauth-buttons"
import { SignUpWithPasswordForm } from "~/src/app/[locale]/(auth)/auth/sign-up/_components/sign-up-with-password-form"
import { APP_NAME } from "~/src/presentation/branding"
import { ROUTES } from "~/src/routes"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.auth.sign-up")

  return {
    description: t("metadata.description", { name: APP_NAME }),
    title: t("metadata.title"),
  }
}

const CROSS_LINK_CLASS =
  "font-medium text-foreground underline-offset-4 transition-colors duration-200 ease-exp hover:text-muted-foreground"

const LEGAL_LINK_CLASS = "text-foreground underline underline-offset-4 transition-colors duration-200 ease-exp hover:text-muted-foreground"

const renderSignInLink = (chunks: ReactNode) => (
  <Link className={CROSS_LINK_CLASS} href={ROUTES.SIGN_IN}>
    {chunks}
  </Link>
)

const renderTermsLink = (chunks: ReactNode) => (
  <Link className={LEGAL_LINK_CLASS} href={ROUTES.TERMS}>
    {chunks}
  </Link>
)

const renderPrivacyLink = (chunks: ReactNode) => (
  <Link className={LEGAL_LINK_CLASS} href={ROUTES.PRIVACY}>
    {chunks}
  </Link>
)

const authPageFallback = <AuthPageFallback />

export default function SignUpPage(): JSX.Element {
  return (
    <Suspense fallback={authPageFallback}>
      <SignUpPageContent />
    </Suspense>
  )
}

async function SignUpPageContent(): Promise<JSX.Element> {
  const t = await getTranslations("pages.auth.sign-up")

  return (
    <AuthPageShell
      description={t("form.description", { name: APP_NAME })}
      footer={t.rich("form.hasAccount", { signin: renderSignInLink })}
      title={t("form.title")}
    >
      <OAuthButtons />
      <AuthSeparator label={t("form.or")} />
      <SignUpWithPasswordForm />

      <p className="text-body-sm text-pretty text-muted-foreground">
        {t.rich("form.termsAndPrivacy", { privacy: renderPrivacyLink, terms: renderTermsLink })}
      </p>
    </AuthPageShell>
  )
}
