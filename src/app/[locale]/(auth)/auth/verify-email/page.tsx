import type { Metadata } from "next"
import { type JSX, Suspense } from "react"

import { getTranslations } from "next-intl/server"

import type { Locale } from "~/src/integrations/next-intl/i18n.config"
import { routing } from "~/src/integrations/next-intl/i18n.routing"

import { AuthPageFallback } from "~/src/app/[locale]/(auth)/auth/_components/auth-page-fallback"
import { VerifyEmailPanel } from "~/src/app/[locale]/(auth)/auth/verify-email/_components/verify-email-panel"
import { APP_NAME } from "~/src/presentation/branding"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.auth.verify-email")

  return {
    description: t("metadata.description", { name: APP_NAME }),
    title: t("metadata.title"),
  }
}

export function generateStaticParams(): { locale: Locale }[] {
  return routing.locales.map((locale) => ({ locale }))
}

const authPageFallback = <AuthPageFallback />

export default function VerifyEmailPage({ searchParams }: Readonly<PageProps<"/[locale]/auth/verify-email">>): JSX.Element {
  return (
    <Suspense fallback={authPageFallback}>
      <VerifyEmailPageContent searchParams={searchParams} />
    </Suspense>
  )
}

async function VerifyEmailPageContent({
  searchParams,
}: Pick<PageProps<"/[locale]/auth/verify-email">, "searchParams">): Promise<JSX.Element> {
  const t = await getTranslations("pages.auth.verify-email")
  const resolvedSearchParams = await searchParams
  const token = typeof resolvedSearchParams["token"] === "string" ? resolvedSearchParams["token"] : undefined
  const email = typeof resolvedSearchParams["email"] === "string" ? resolvedSearchParams["email"] : undefined

  return (
    <div className="reveal-elem flex w-full max-w-105 flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-medium tracking-tight text-foreground">{t("form.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("form.description")}</p>
      </div>

      <div className="relative flex flex-col gap-6 overflow-hidden rounded-xl border border-white/8 bg-white/2 p-8 shadow-2xl backdrop-blur-2xl md:p-10">
        <div className="pointer-events-none absolute -top-12 -right-32 z-0 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-[80px]" />
        <VerifyEmailPanel {...(email === undefined ? {} : { email })} {...(token === undefined ? {} : { token })} />
      </div>
    </div>
  )
}
