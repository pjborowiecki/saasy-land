import type { Metadata } from "next"
import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { UsersRolesTab } from "~/src/app/[locale]/(admin)/admin/users/roles/_components/users-roles-tab"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.admin.users")
  return { description: t("metadata.description"), title: `${t("tabs.roles")} | ${t("metadata.title")}` }
}

export default function RolesPage(): JSX.Element {
  return <UsersRolesTab />
}
