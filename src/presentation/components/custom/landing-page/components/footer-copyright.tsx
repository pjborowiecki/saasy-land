import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

import { APP_FOUNDED_YEAR } from "~/src/presentation/branding"

export const FooterCopyright = (): JSX.Element => {
  const t = useTranslations("common")

  const currentYear = new Date().getFullYear()
  const years = currentYear > APP_FOUNDED_YEAR ? `${APP_FOUNDED_YEAR}\u2013${currentYear}` : String(APP_FOUNDED_YEAR)

  return <span className="ml-2">{t("copyright", { years })}</span>
}
