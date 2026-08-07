import type { Metadata } from "next"
import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { UsersSecurityTab } from "~/src/app/[locale]/(admin)/admin/users/security/_components/users-security-tab"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.admin.users")
  return { description: t("metadata.description"), title: `${t("tabs.security")} | ${t("metadata.title")}` }
}

export default function SecurityPage(): JSX.Element {
  return <UsersSecurityTab />
}
