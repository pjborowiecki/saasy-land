import type { Metadata } from "next"
import { Suspense, type JSX } from "react"

import { getTranslations } from "next-intl/server"

import { AuthPageFallback } from "~/src/app/[locale]/(auth)/auth/_components/auth-page-fallback"
import { AuthPageShell } from "~/src/app/[locale]/(auth)/auth/_components/auth-page-shell"
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
    <AuthPageShell description={t("form.description")} title={t("form.title")}>
      <TwoFactorForm />
    </AuthPageShell>
  )
}
