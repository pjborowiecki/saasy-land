import type { Metadata } from "next"
import { Suspense, type JSX } from "react"

import { getTranslations } from "next-intl/server"

import { AuthPageFallback } from "~/src/app/[locale]/(auth)/auth/_components/auth-page-fallback"
import { TwoFactorForm } from "~/src/app/[locale]/(auth)/auth/two-factor/_components/two-factor-form"
import { APP_NAME } from "~/src/presentation/branding"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.auth.two-factor")

  return {
    description: t("metadata.description", { name: APP_NAME }),
    title: t("metadata.title"),
  }
}

const authPageFallback = <AuthPageFallback />

export default function TwoFactorPage(): JSX.Element {
  return (
    <Suspense fallback={authPageFallback}>
      <TwoFactorPageContent />
    </Suspense>
  )
}

async function TwoFactorPageContent(): Promise<JSX.Element> {
  const t = await getTranslations("pages.auth.two-factor")

  return (
    <div className="reveal-elem flex w-full max-w-105 flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-medium tracking-tight text-foreground">{t("form.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("form.description")}</p>
      </div>

      <div className="relative flex flex-col gap-6 overflow-hidden rounded-xl border border-white/8 bg-white/2 p-8 shadow-2xl backdrop-blur-2xl md:p-10">
        <div className="pointer-events-none absolute -top-12 -right-32 z-0 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-[80px]" />
        <TwoFactorForm />
      </div>
    </div>
  )
}
