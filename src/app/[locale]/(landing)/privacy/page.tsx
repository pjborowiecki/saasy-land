import type { Metadata } from "next"
import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { LegalDocument, LegalSection } from "~/src/app/[locale]/(landing)/_components/legal-document"
import { APP_NAME } from "~/src/presentation/branding"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.legal.privacy")

  return {
    description: t("metadata.description", { name: APP_NAME }),
    title: t("metadata.title"),
  }
}

export default async function PrivacyPage(): Promise<JSX.Element> {
  const t = await getTranslations("pages.legal.privacy")

  return (
    <LegalDocument description={t("description", { name: APP_NAME })} lastUpdated={t("lastUpdated")} title={t("title")}>
      <LegalSection body={t("sections.collection.body", { name: APP_NAME })} title={t("sections.collection.title")} />
      <LegalSection body={t("sections.usage.body", { name: APP_NAME })} title={t("sections.usage.title")} />
      <LegalSection body={t("sections.contact.body", { name: APP_NAME })} title={t("sections.contact.title")} />
    </LegalDocument>
  )
}
