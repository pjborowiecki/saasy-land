import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { JSX } from "react"

import { hasLocale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { CONSTANTS } from "~/src/constants"
import type { Locale } from "~/src/constants/types"

import { routing } from "~/src/integrations/next-intl/i18n.routing"

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/premium">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "premiumPage" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export function generateStaticParams(): Array<{ locale: Locale }> {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function PremiumPage({ params }: Readonly<PageProps<"/[locale]/premium">>): Promise<JSX.Element> {
  const { locale } = await params

  if (!hasLocale(CONSTANTS.I18N.LOCALES, locale)) notFound()

  const t = await getTranslations({ locale, namespace: "premiumPage" })

  return <div>{t("title")}</div>
}
