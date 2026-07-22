import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { JSX } from "react"

import { hasLocale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { I18N, type Locale } from "~/src/integrations/next-intl/i18n.config"
import { routing } from "~/src/integrations/next-intl/i18n.routing"

import { LegalDocument, LegalSection } from "~/src/app/[locale]/(landing)/_components/legal-document"
import { APP_NAME } from "~/src/presentation/branding"

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/terms">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "pages.legal.terms" })

  return {
    description: t("metadata.description", { name: APP_NAME }),
    title: t("metadata.title"),
  }
}

export function generateStaticParams(): { locale: Locale }[] {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function TermsPage({ params }: Readonly<PageProps<"/[locale]/terms">>): Promise<JSX.Element> {
  const { locale } = await params

  if (!hasLocale(I18N.LOCALES, locale)) {
    notFound()
  }

  const t = await getTranslations({ locale, namespace: "pages.legal.terms" })

  return (
    <LegalDocument description={t("description", { name: APP_NAME })} lastUpdated={t("lastUpdated")} title={t("title")}>
      <LegalSection body={t("sections.acceptance.body", { name: APP_NAME })} title={t("sections.acceptance.title")} />
      <LegalSection body={t("sections.accounts.body", { name: APP_NAME })} title={t("sections.accounts.title")} />
      <LegalSection body={t("sections.changes.body", { name: APP_NAME })} title={t("sections.changes.title")} />
    </LegalDocument>
  )
}
