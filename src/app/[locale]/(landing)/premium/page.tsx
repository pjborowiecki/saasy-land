import type { Metadata } from "next"
import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import type { Locale } from "~/src/integrations/next-intl/i18n.config"
import { routing } from "~/src/integrations/next-intl/i18n.routing"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.premium")

  return {
    description: t("description"),
    title: t("title"),
  }
}

export function generateStaticParams(): { locale: Locale }[] {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function PremiumPage(): Promise<JSX.Element> {
  const t = await getTranslations("pages.premium")

  return <div>{t("title")}</div>
}
