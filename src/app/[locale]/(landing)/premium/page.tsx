import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { JSX } from "react"

import { hasLocale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { I18N, type Locale } from "~/src/integrations/next-intl/i18n.config"
import { routing } from "~/src/integrations/next-intl/i18n.routing"

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/premium">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "pages.premium" })

  return {
    description: t("description"),
    title: t("title"),
  }
}

export function generateStaticParams(): { locale: Locale }[] {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function PremiumPage({ params }: Readonly<PageProps<"/[locale]/premium">>): Promise<JSX.Element> {
  const { locale } = await params

  if (!hasLocale(I18N.LOCALES, locale)) {
    notFound()
  }

  const t = await getTranslations({ locale, namespace: "pages.premium" })

  return <div>{t("title")}</div>
}
