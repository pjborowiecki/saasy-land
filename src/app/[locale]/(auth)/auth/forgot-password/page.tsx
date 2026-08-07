import type { Metadata } from "next"
import { Suspense, type JSX, type ReactNode } from "react"

import { getTranslations } from "next-intl/server"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { AuthPageFallback } from "~/src/app/[locale]/(auth)/auth/_components/auth-page-fallback"
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

const renderSignInLink = (chunks: ReactNode) => (
  <Link href={ROUTES.SIGN_IN} className="font-medium text-foreground transition-colors hover:text-primary">
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
    <div className="reveal-elem flex w-full max-w-105 flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-medium tracking-tight text-foreground">{t("form.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("form.description")}</p>
      </div>

      <div className="relative flex flex-col gap-6 overflow-hidden rounded-xl border border-white/8 bg-white/2 p-8 shadow-2xl backdrop-blur-2xl md:p-10">
        <div className="pointer-events-none absolute -top-12 -right-32 z-0 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-[80px]" />
        <ForgotPasswordForm />
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {t.rich("form.rememberPassword", {
            signin: renderSignInLink,
          })}
        </p>
      </div>
    </div>
  )
}
