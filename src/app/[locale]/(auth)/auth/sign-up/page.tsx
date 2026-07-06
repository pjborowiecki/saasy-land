import type { Metadata } from "next"
import type { JSX, ReactNode } from "react"

import { getTranslations } from "next-intl/server"

import { CONSTANTS } from "~/src/constants"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { AuthSeparator } from "~/src/app/[locale]/(auth)/auth/_components/auth-separator"
import { OAuthButtons } from "~/src/app/[locale]/(auth)/auth/_components/oauth-buttons"
import { SignUpWithPasswordForm } from "~/src/app/[locale]/(auth)/auth/sign-up/_components/sign-up-with-password-form"

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/auth/sign-up">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "pages.auth.sign-up" })

  return {
    description: t("metadata.description", { name: CONSTANTS.APP_NAME }),
    title: t("metadata.title"),
  }
}

const renderSignInLink = (chunks: ReactNode) => (
  <Link href={CONSTANTS.ROUTES.SIGN_IN} className="font-medium text-foreground transition-colors hover:text-primary">
    {chunks}
  </Link>
)

const renderTermsLink = (chunks: ReactNode) => (
  <Link href={CONSTANTS.ROUTES.TERMS} className="text-foreground transition-colors hover:underline">
    {chunks}
  </Link>
)

const renderPrivacyLink = (chunks: ReactNode) => (
  <Link href={CONSTANTS.ROUTES.PRIVACY} className="text-foreground transition-colors hover:underline">
    {chunks}
  </Link>
)

export default async function SignUpPage({ params }: Readonly<PageProps<"/[locale]/auth/sign-up">>): Promise<JSX.Element> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "pages.auth.sign-up" })

  return (
    <div className="reveal-elem flex w-full max-w-[420px] flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-medium tracking-tight text-foreground">{t("form.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("form.description", { name: CONSTANTS.APP_NAME })}</p>
      </div>

      <div className="relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-white/8 bg-white/2 p-8 shadow-2xl backdrop-blur-2xl md:p-10">
        <div className="pointer-events-none absolute -top-12 -right-12 z-0 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-[60px]" />

        <div className="relative flex flex-col gap-6">
          <OAuthButtons />
          <AuthSeparator label={t("form.or")} />
          <SignUpWithPasswordForm />

          <p className="text-center text-sm leading-relaxed text-balance text-muted-foreground underline-offset-4">
            {t.rich("form.termsAndPrivacy", {
              privacy: renderPrivacyLink,
              terms: renderTermsLink,
            })}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 text-center">
        <p className="text-sm text-muted-foreground">
          {t.rich("form.hasAccount", {
            signin: renderSignInLink,
          })}
        </p>
      </div>
    </div>
  )
}
