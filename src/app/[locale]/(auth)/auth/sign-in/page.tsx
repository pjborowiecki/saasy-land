import type { Metadata } from "next"
import { Suspense, type JSX, type ReactNode } from "react"

import { getTranslations } from "next-intl/server"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { AuthPageFallback } from "~/src/app/[locale]/(auth)/auth/_components/auth-page-fallback"
import { AuthPageShell } from "~/src/app/[locale]/(auth)/auth/_components/auth-page-shell"
import { AuthSeparator } from "~/src/app/[locale]/(auth)/auth/_components/auth-separator"
import { OAuthButtons } from "~/src/app/[locale]/(auth)/auth/_components/oauth-buttons"
import { SignInWithPasswordForm } from "~/src/app/[locale]/(auth)/auth/sign-in/_components/sign-in-with-password-form"
import { APP_NAME } from "~/src/presentation/branding"
import { ROUTES } from "~/src/routes"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.auth.sign-in")

  return {
    description: t("metadata.description", { name: APP_NAME }),
    title: t("metadata.title"),
  }
}

const CROSS_LINK_CLASS =
  "font-medium text-foreground underline-offset-4 transition-colors duration-200 ease-exp hover:text-muted-foreground"

const renderSignUpLink = (chunks: ReactNode) => (
  <Link className={CROSS_LINK_CLASS} href={ROUTES.SIGN_UP}>
    {chunks}
  </Link>
)

const authPageFallback = <AuthPageFallback />

export default function SignInPage(): JSX.Element {
  return (
    <Suspense fallback={authPageFallback}>
      <SignInPageContent />
    </Suspense>
  )
}

async function SignInPageContent(): Promise<JSX.Element> {
  const t = await getTranslations("pages.auth.sign-in")

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
