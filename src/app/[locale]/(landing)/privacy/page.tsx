import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { JSX } from "react"

import { hasLocale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { I18N, type Locale } from "~/src/integrations/next-intl/i18n.config"
import { routing } from "~/src/integrations/next-intl/i18n.routing"

import { LegalDocument, LegalSection } from "~/src/app/[locale]/(landing)/_components/legal-document"
import { APP_NAME } from "~/src/presentation/branding"

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/privacy">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "pages.legal.privacy" })

  return {
    description: t("metadata.description", { name: APP_NAME }),
    title: t("metadata.title"),
  }
}

export function generateStaticParams(): { locale: Locale }[] {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function PrivacyPage({ params }: Readonly<PageProps<"/[locale]/privacy">>): Promise<JSX.Element> {
  const { locale } = await params

  if (!hasLocale(I18N.LOCALES, locale)) {
    notFound()
  }

  const t = await getTranslations({ locale, namespace: "pages.legal.privacy" })

  return (
    <LegalDocument description={t("description", { name: APP_NAME })} lastUpdated={t("lastUpdated")} title={t("title")}>
      <LegalSection body={t("sections.collection.body", { name: APP_NAME })} title={t("sections.collection.title")} />
      <LegalSection body={t("sections.usage.body", { name: APP_NAME })} title={t("sections.usage.title")} />
      <LegalSection body={t("sections.contact.body", { name: APP_NAME })} title={t("sections.contact.title")} />
    </LegalDocument>
  )
}
