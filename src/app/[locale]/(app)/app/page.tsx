import type { Metadata } from "next"
import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { CONSTANTS } from "~/src/constants"

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/app">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "appPage" })

  return {
    description: t("metadata.description"),
  }
}

export default async function AppPage({ params }: Readonly<PageProps<"/[locale]/app">>): Promise<JSX.Element> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "appPage" })

  return (
    <div>
      <p>{t("welcome", { name: CONSTANTS.APP_NAME })}</p>
    </div>
  )
}
