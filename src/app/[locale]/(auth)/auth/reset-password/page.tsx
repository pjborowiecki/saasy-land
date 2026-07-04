import type { Metadata } from "next"
import type { JSX } from "react"
import { Suspense } from "react"

import { getTranslations } from "next-intl/server"

import { CONSTANTS } from "~/src/constants"
import type { Locale } from "~/src/constants/types"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"
import { routing } from "~/src/integrations/next-intl/i18n.routing"

import { ResetPasswordForm } from "~/src/app/[locale]/(auth)/auth/_components/reset-password-form"

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/auth/reset-password">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "auth.resetPasswordPage" })

  return {
    title: t("metadata.title"),
    description: t("metadata.description", { name: CONSTANTS.APP_NAME }),
  }
}

export function generateStaticParams(): Array<{ locale: Locale }> {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function ResetPasswordPage({
  params,
  searchParams,
}: Readonly<PageProps<"/[locale]/auth/reset-password">>): Promise<JSX.Element> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "auth.resetPasswordPage" })

  return (
    <div className="reveal-elem flex w-full max-w-[420px] flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-medium text-3xl text-foreground tracking-tight">{t("form.title")}</h1>
        <p className="text-muted-foreground text-sm">{t("form.description")}</p>
      </div>

      <div className="relative flex flex-col gap-6 overflow-hidden rounded-xl border border-white/8 bg-white/2 p-8 shadow-2xl backdrop-blur-2xl md:p-10">
        <div className="pointer-events-none absolute -top-12 -right-32 z-0 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-[80px]" />
        <Suspense fallback={null}>
          <ResetPasswordPageCard searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

async function ResetPasswordPageCard({
  searchParams,
}: Readonly<Pick<PageProps<"/[locale]/auth/reset-password">, "searchParams">>): Promise<JSX.Element> {
  const { error, token } = await searchParams

  const t = await getTranslations("auth.resetPasswordPage")

  if (!error && typeof token === "string") {
    return <ResetPasswordForm token={token} />
  }

  return (
    <div className="flex flex-col gap-4 text-center">
      <p className="text-muted-foreground text-sm">{typeof error === "string" ? error : t("form.invalidToken")}</p>
      <Link
        href={CONSTANTS.ROUTES.FORGOT_PASSWORD}
        className="inline-flex h-11 items-center justify-center rounded-lg bg-foreground px-4 text-background text-sm transition-all hover:bg-foreground/80"
      >
        {t("form.requestNewLink")}
      </Link>
    </div>
  )
}
