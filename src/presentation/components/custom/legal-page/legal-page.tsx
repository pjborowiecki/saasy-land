import { useTranslations } from "use-intl/react"

import { LEGAL_SECTIONS } from "~/src/presentation/components/custom/legal-page/constants"

export const LegalPage = ({ document }: Readonly<{ document: keyof typeof LEGAL_SECTIONS }>) => {
  const t = useTranslations(`pages.legal.${document}`)

  return (
    <div className="container mx-auto max-w-3xl px-6 py-16 md:py-24">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">{t("lastUpdated")}</p>
        <h1 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl" data-testid="legal-document-title">
          {t("title")}
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">{t("description")}</p>
      </div>

      <div className="mt-12 flex flex-col gap-10">
        {LEGAL_SECTIONS[document].map((section) => (
          <section className="flex flex-col gap-3" key={section}>
            <h2 className="text-xl font-medium text-foreground">{t(`sections.${section}.title`)}</h2>
            <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">{t(`sections.${section}.body`)}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
