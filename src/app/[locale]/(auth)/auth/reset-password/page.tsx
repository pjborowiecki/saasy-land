import type { Metadata } from "next"
import { type JSX, Suspense } from "react"

import { getTranslations } from "next-intl/server"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { AuthPageFallback } from "~/src/app/[locale]/(auth)/auth/_components/auth-page-fallback"
import { ResetPasswordForm } from "~/src/app/[locale]/(auth)/auth/reset-password/_components/reset-password-form"
import { APP_NAME } from "~/src/presentation/branding"
import { ROUTES } from "~/src/routes"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.auth.reset-password")

  return {
    description: t("metadata.description", { name: APP_NAME }),
    title: t("metadata.title"),
  }
}

const authPageFallback = <AuthPageFallback />

export default function ResetPasswordPage({ searchParams }: Readonly<PageProps<"/[locale]/auth/reset-password">>): JSX.Element {
  return (
    <Suspense fallback={authPageFallback}>
      <ResetPasswordPageContent searchParams={searchParams} />
    </Suspense>
  )
}

async function ResetPasswordPageContent({
  searchParams,
}: Pick<PageProps<"/[locale]/auth/reset-password">, "searchParams">): Promise<JSX.Element> {
  const [t, { error, token }] = await Promise.all([getTranslations("pages.auth.reset-password"), searchParams])

  return (
    <div className="reveal-elem flex w-full max-w-105 flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-medium tracking-tight text-foreground">{t("form.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("form.description")}</p>
      </div>

      <div className="relative flex flex-col gap-6 overflow-hidden rounded-xl border border-white/8 bg-white/2 p-8 shadow-2xl backdrop-blur-2xl md:p-10">
        <div className="pointer-events-none absolute -top-12 -right-32 z-0 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-[80px]" />
        {error === undefined && typeof token === "string" ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="flex flex-col gap-4 text-center">
            <p className="text-sm text-muted-foreground">{typeof error === "string" ? error : t("form.invalidToken")}</p>
            <Link
              href={ROUTES.FORGOT_PASSWORD}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-foreground px-4 text-sm text-background transition-all hover:bg-foreground/80"
            >
              {t("form.requestNewLink")}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
