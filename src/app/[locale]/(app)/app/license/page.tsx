import type { Metadata } from "next"
import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { getLicense } from "~/src/modules/license/use-cases/get-license.use-case"

import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"
import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { CheckoutOptions } from "~/src/app/[locale]/(app)/app/_components/checkout-options"
import { ActivationList } from "~/src/app/[locale]/(app)/app/license/_components/activation-list"
import { LicensePanel } from "~/src/app/[locale]/(app)/app/license/_components/license-panel"
import { ROUTES } from "~/src/routes"

export const instant = false

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.license")

  return {
    description: t("description"),
    robots: { follow: false, index: false },
    title: t("title"),
  }
}

export default async function LicensePage(): Promise<JSX.Element> {
  const t = await getTranslations("pages.license")
  const session = await getCurrentSession()
  const license = session ? await getLicense(session.user.id) : undefined

  if (license === undefined) {
    return (
      <div className="flex flex-col gap-8 p-8">
        <CheckoutOptions />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10 p-8">
      <LicensePanel license={license} />
      {license.polarLicenseKeyId !== null && <ActivationList licenseKeyId={license.polarLicenseKeyId} />}
      <Link className="text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground" href={ROUTES.APP}>
        {t("back")}
      </Link>
    </div>
  )
}
