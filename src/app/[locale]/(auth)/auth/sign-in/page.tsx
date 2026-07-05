import type { Metadata } from "next"
import type { JSX, ReactNode } from "react"

import { getTranslations } from "next-intl/server"

import { CONSTANTS } from "~/src/constants"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { AuthSeparator } from "~/src/app/[locale]/(auth)/auth/_components/auth-separator"
import { OAuthButtons } from "~/src/app/[locale]/(auth)/auth/_components/oauth-buttons"
import { SignInWithPasswordForm } from "~/src/app/[locale]/(auth)/auth/sign-in/_components/sign-in-with-password-form"

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/auth/sign-in">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "auth.signInPage" })

  return {
    description: t("metadata.description", { name: CONSTANTS.APP_NAME }),
    title: t("metadata.title"),
  }
}

const renderSignUpLink = (chunks: ReactNode) => (
  <Link href={CONSTANTS.ROUTES.SIGN_UP} className="font-medium text-foreground transition-colors hover:text-primary">
    {chunks}
  </Link>
)

export default async function SignInPage({ params }: Readonly<PageProps<"/[locale]/auth/sign-in">>): Promise<JSX.Element> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "auth.signInPage" })

  return (
    <div className="reveal-elem flex w-full max-w-[420px] flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-medium tracking-tight text-foreground">{t("form.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("form.description", { name: CONSTANTS.APP_NAME })}</p>
      </div>

      <div className="relative flex flex-col gap-6 overflow-hidden rounded-xl border border-white/8 bg-white/2 p-8 shadow-2xl backdrop-blur-2xl md:p-10">
        <div className="pointer-events-none absolute -top-12 -right-32 z-0 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-[80px]" />

        <OAuthButtons />
        <AuthSeparator label={t("form.or")} />
        <SignInWithPasswordForm />
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {t.rich("form.noAccount", {
            signup: renderSignUpLink,
          })}
        </p>
      </div>
    </div>
  )
}
