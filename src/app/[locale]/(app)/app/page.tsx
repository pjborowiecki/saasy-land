import type { Metadata } from "next"
import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { getLicense } from "~/src/modules/license/use-cases/get-license.use-case"

import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"
import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { CheckoutOptions } from "~/src/app/[locale]/(app)/app/_components/checkout-options"
import { ROUTES } from "~/src/routes"

export const instant = false

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.app")

  return {
    description: t("description"),
    title: t("title"),
  }
}

export default async function AppPage(): Promise<JSX.Element> {
  const t = await getTranslations("pages.app")
  const session = await getCurrentSession()
  const owned = session ? await getLicense(session.user.id) : undefined

  return (
    <div className="flex flex-col gap-8 p-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </header>
      {owned === undefined ? (
        <CheckoutOptions />
      ) : (
        <Link
          className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors duration-200 hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          href={ROUTES.APP_LICENSE}
        >
          {t("license")}
        </Link>
      )}
    </div>
  )
}
