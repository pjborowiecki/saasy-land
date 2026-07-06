import type { Metadata } from "next"
import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/app">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "pages.app" })

  return {
    description: t("description"),
    title: t("title"),
  }
}

export default async function AppPage({ params }: Readonly<PageProps<"/[locale]/app">>): Promise<JSX.Element> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "pages.app" })

  return (
    <div className="flex flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
    </div>
  )
}
