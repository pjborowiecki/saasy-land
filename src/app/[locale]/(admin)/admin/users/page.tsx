import type { Metadata } from "next"
import { Suspense, type JSX } from "react"

import { getTranslations } from "next-intl/server"

import { UsersPageTabs } from "~/src/app/[locale]/(admin)/admin/users/_components/users-page-tabs"
import { UsersTabFallback } from "~/src/app/[locale]/(admin)/admin/users/_components/users-tab-fallback"
import { UsersTabPanel } from "~/src/app/[locale]/(admin)/admin/users/_components/users-tab-panel"
import { loadUsersPageSearchParams } from "~/src/app/[locale]/(admin)/admin/users/_lib/users-search-params"

const USERS_TAB_SUSPENSE_FALLBACK = <UsersTabFallback />

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "pages.admin.users" })

  return {
    description: t("metadata.description"),
    title: t("metadata.title"),
  }
}

export default async function UsersPage({ params, searchParams }: Readonly<PageProps<"/[locale]/admin/users">>): Promise<JSX.Element> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "pages.admin.users" })

  return (
    <div className="flex min-h-0 w-full flex-1 animate-in flex-col overflow-hidden duration-500 fade-in-50">
      <Suspense fallback={USERS_TAB_SUSPENSE_FALLBACK}>
        <UsersPageTabbedContent description={t("description")} searchParams={searchParams} title={t("title")} />
      </Suspense>
    </div>
  )
}

async function UsersPageTabbedContent({
  description,
  searchParams,
  title,
}: Readonly<
  Pick<PageProps<"/[locale]/admin/users">, "searchParams"> & {
    description: string
    title: string
  }
>): Promise<JSX.Element> {
  const { tab } = await loadUsersPageSearchParams(searchParams)

  return (
    <UsersPageTabs activeTab={tab} description={description} title={title}>
      <Suspense fallback={USERS_TAB_SUSPENSE_FALLBACK}>
        <UsersTabPanel tab={tab} />
      </Suspense>
    </UsersPageTabs>
  )
}
