import type { Metadata } from "next"
import { type JSX, Suspense } from "react"

import { getTranslations } from "next-intl/server"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { cn } from "~/src/utils"

import { buttonVariants } from "~/src/presentation/components/shadcn/_lib/button-variants"

import { AuthPageFallback } from "~/src/app/[locale]/(auth)/auth/_components/auth-page-fallback"
import { AuthPageShell } from "~/src/app/[locale]/(auth)/auth/_components/auth-page-shell"
import { AUTH_PRIMARY_BUTTON_CLASS } from "~/src/app/[locale]/(auth)/auth/_constants/auth-styles"
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

/** A dead link is a dead end: state the fault, then give the one control that fixes it. */
function ResetPasswordInvalidToken({ message, requestLabel }: Readonly<{ message: string; requestLabel: string }>): JSX.Element {
  return (
    <>
      <p className="text-body text-pretty text-destructive">{message}</p>
      <Link className={cn(buttonVariants(), AUTH_PRIMARY_BUTTON_CLASS)} href={ROUTES.FORGOT_PASSWORD}>
        {requestLabel}
      </Link>
    </>
  )
}

async function ResetPasswordPageContent({
  searchParams,
}: Pick<PageProps<"/[locale]/auth/reset-password">, "searchParams">): Promise<JSX.Element> {
  const [t, { error, token }] = await Promise.all([getTranslations("pages.auth.reset-password"), searchParams])
  const resetToken = error === undefined && typeof token === "string" ? token : undefined

  return (
    <AuthPageShell description={t("form.description")} title={t("form.title")}>
      {resetToken === undefined ? (
        <ResetPasswordInvalidToken
          message={typeof error === "string" ? error : t("form.invalidToken")}
          requestLabel={t("form.requestNewLink")}
        />
      ) : (
        <ResetPasswordForm token={resetToken} />
      )}
    </AuthPageShell>
  )
}
