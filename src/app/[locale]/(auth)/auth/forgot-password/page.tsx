import type { Metadata } from "next"
import { Suspense, type JSX, type ReactNode } from "react"

import { getTranslations } from "next-intl/server"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { AuthPageFallback } from "~/src/app/[locale]/(auth)/auth/_components/auth-page-fallback"
import { AuthPageShell } from "~/src/app/[locale]/(auth)/auth/_components/auth-page-shell"
import { ForgotPasswordForm } from "~/src/app/[locale]/(auth)/auth/forgot-password/_components/forgot-password-form"
import { APP_NAME } from "~/src/presentation/branding"
import { ROUTES } from "~/src/routes"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.auth.forgot-password")

  return {
    description: t("metadata.description", { name: APP_NAME }),
    title: t("metadata.title"),
  }
}

const CROSS_LINK_CLASS =
  "font-medium text-foreground underline-offset-4 transition-colors duration-200 ease-exp hover:text-muted-foreground"

const renderSignInLink = (chunks: ReactNode) => (
  <Link className={CROSS_LINK_CLASS} href={ROUTES.SIGN_IN}>
    {chunks}
  </Link>
)

const authPageFallback = <AuthPageFallback />

export default function ForgotPasswordPage(): JSX.Element {
  return (
    <Suspense fallback={authPageFallback}>
      <ForgotPasswordPageContent />
    </Suspense>
  )
}

async function ForgotPasswordPageContent(): Promise<JSX.Element> {
  const t = await getTranslations("pages.auth.forgot-password")

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
