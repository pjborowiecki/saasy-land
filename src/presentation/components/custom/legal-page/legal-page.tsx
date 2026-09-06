import { useTranslations } from "use-intl/react"

import { LegalDocument, LegalSection } from "~/src/presentation/components/custom/legal-page/components/legal-document"
import { LEGAL_SECTIONS } from "~/src/presentation/components/custom/legal-page/constants"
import type { LegalDocumentKind } from "~/src/presentation/components/custom/legal-page/types"

export const LegalPage = ({ document }: Readonly<{ document: LegalDocumentKind }>) => {
  const t = useTranslations(`pages.legal.${document}`)

  return (
    <LegalDocument description={t("description")} lastUpdated={t("lastUpdated")} title={t("title")}>
      {LEGAL_SECTIONS[document].map((section) => (
        <LegalSection key={section} body={t(`sections.${section}.body`)} title={t(`sections.${section}.title`)} />
      ))}
    </LegalDocument>
  )
}
