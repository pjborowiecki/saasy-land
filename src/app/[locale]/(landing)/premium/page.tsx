import type { Metadata } from "next"
import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.premium")

  return {
    description: t("description"),
    title: t("title"),
  }
}

export default async function PremiumPage(): Promise<JSX.Element> {
  const t = await getTranslations("pages.premium")

  return <div>{t("title")}</div>
}
