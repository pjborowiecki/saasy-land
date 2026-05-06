import type { Metadata } from "next"
import type { JSX, ReactNode } from "react"

import { getTranslations } from "next-intl/server"

import { CONSTANTS } from "~/src/constants"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { AuthSeparator } from "~/src/app/[locale]/(auth)/auth/_components/auth-separator"
import { OAuthButtons } from "~/src/app/[locale]/(auth)/auth/_components/oauth-buttons"
import { SignUpWithPasswordForm } from "~/src/app/[locale]/(auth)/auth/_components/sign-up-with-password-form"

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/auth/sign-up">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "auth.signUpPage" })

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
  const t = await getTranslations({ locale, namespace: "auth.signUpPage" })

  return (
    <div className="reveal-elem flex w-full max-w-[420px] flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-medium text-3xl text-foreground tracking-tight">{t("form.title")}</h1>
        <p className="text-muted-foreground text-sm">{t("form.description", { name: CONSTANTS.APP_NAME })}</p>
      </div>

      <div className="relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-white/8 bg-white/2 p-8 shadow-2xl backdrop-blur-2xl md:p-10">
        <div className="pointer-events-none absolute -top-12 -right-12 z-0 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-[60px]" />

        <div className="relative flex flex-col gap-6">
          <OAuthButtons />
          <AuthSeparator label={t("form.or")} />
          <SignUpWithPasswordForm />

          <p className="text-balance text-center text-muted-foreground text-sm leading-relaxed underline-offset-4">
            {t.rich("form.termsAndPrivacy", {
              terms: renderTermsLink,
              privacy: renderPrivacyLink,
            })}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 text-center">
        <p className="text-muted-foreground text-sm">
          {t.rich("form.hasAccount", {
            signin: renderSignInLink,
          })}
        </p>
      </div>
    </div>
  )
}
