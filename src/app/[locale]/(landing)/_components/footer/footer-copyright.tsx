import { connection } from "next/server"
import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { APP_FOUNDED_YEAR } from "~/src/presentation/branding"

export async function FooterCopyright(): Promise<JSX.Element> {
  await connection()
  const t = await getTranslations("common")

  const currentYear = new Date().getFullYear()
  const years = currentYear > APP_FOUNDED_YEAR ? `${APP_FOUNDED_YEAR}\u2013${currentYear}` : String(APP_FOUNDED_YEAR)

  return <span className="ml-2">{t("copyright", { years })}</span>
}
