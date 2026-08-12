import type { Metadata } from "next"
import { type JSX, Suspense } from "react"

import { getTranslations } from "next-intl/server"

import { AuthPageFallback } from "~/src/app/[locale]/(auth)/auth/_components/auth-page-fallback"
import { AuthPageShell } from "~/src/app/[locale]/(auth)/auth/_components/auth-page-shell"
import { VerifyEmailPanel } from "~/src/app/[locale]/(auth)/auth/verify-email/_components/verify-email-panel"
import { APP_NAME } from "~/src/presentation/branding"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.auth.verify-email")

  return {
    description: t("metadata.description", { name: APP_NAME }),
    title: t("metadata.title"),
  }
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
  const [t, resolvedSearchParams] = await Promise.all([getTranslations("pages.auth.verify-email"), searchParams])
  const token = typeof resolvedSearchParams["token"] === "string" ? resolvedSearchParams["token"] : undefined
  const email = typeof resolvedSearchParams["email"] === "string" ? resolvedSearchParams["email"] : undefined

  return (
    <AuthPageShell description={t("form.description")} title={t("form.title")}>
      <VerifyEmailPanel {...(email === undefined ? {} : { email })} {...(token === undefined ? {} : { token })} />
    </AuthPageShell>
  )
}
