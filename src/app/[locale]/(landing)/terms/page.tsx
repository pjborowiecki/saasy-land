import type { Metadata } from "next"
import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { LegalDocument, LegalSection } from "~/src/app/[locale]/(landing)/_components/legal/legal-document"
import { APP_NAME } from "~/src/presentation/branding"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.legal.terms")

  return {
    description: t("metadata.description", { name: APP_NAME }),
    title: t("metadata.title"),
  }
}

export default async function TermsPage(): Promise<JSX.Element> {
  const t = await getTranslations("pages.legal.terms")

  return (
    <LegalDocument description={t("description", { name: APP_NAME })} lastUpdated={t("lastUpdated")} title={t("title")}>
      <LegalSection body={t("sections.acceptance.body", { name: APP_NAME })} title={t("sections.acceptance.title")} />
      <LegalSection body={t("sections.accounts.body", { name: APP_NAME })} title={t("sections.accounts.title")} />
      <LegalSection body={t("sections.changes.body", { name: APP_NAME })} title={t("sections.changes.title")} />
    </LegalDocument>
  )
}
