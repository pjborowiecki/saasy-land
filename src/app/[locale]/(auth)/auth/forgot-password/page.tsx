import type { Metadata } from "next"
import type { JSX, ReactNode } from "react"

import { getTranslations } from "next-intl/server"

import { CONSTANTS } from "~/src/constants"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { ForgotPasswordForm } from "~/src/app/[locale]/(auth)/auth/_components/forgot-password-form"

export async function generateMetadata({ params }: Readonly<{ params: Promise<{ locale: string }> }>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "auth.forgotPasswordPage" })

  return {
    title: t("metadata.title"),
    description: t("metadata.description", { name: CONSTANTS.APP_NAME }),
  }
}

const renderSignInLink = (chunks: ReactNode) => (
  <Link href={CONSTANTS.ROUTES.SIGN_IN} className="font-medium text-foreground transition-colors hover:text-primary">
    {chunks}
  </Link>
)

export default async function ForgotPasswordPage({ params }: Readonly<{ params: Promise<{ locale: string }> }>): Promise<JSX.Element> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "auth.forgotPasswordPage" })

  return (
    <div className="reveal-elem flex w-full max-w-[420px] flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-medium text-3xl text-foreground tracking-tight">{t("form.title")}</h1>
        <p className="text-muted-foreground text-sm">{t("form.description")}</p>
      </div>

      <div className="relative flex flex-col gap-6 overflow-hidden rounded-xl border border-white/8 bg-white/2 p-8 shadow-2xl backdrop-blur-2xl md:p-10">
        <div className="pointer-events-none absolute -top-12 -right-32 z-0 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-[80px]" />
        <ForgotPasswordForm />
      </div>

      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          {t.rich("form.rememberPassword", {
            signin: renderSignInLink,
          })}
        </p>
      </div>
    </div>
  )
}
