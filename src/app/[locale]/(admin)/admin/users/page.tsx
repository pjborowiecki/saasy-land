import type { Metadata } from "next"
import { type JSX, Suspense } from "react"

import { getTranslations } from "next-intl/server"

import { ActiveTab } from "~/src/app/[locale]/(admin)/admin/users/_components/active-tab"
import { AllUsersTabFallback } from "~/src/app/[locale]/(admin)/admin/users/_components/all-users-tab/all-users-tab-fallback"
import { TabsList } from "~/src/app/[locale]/(admin)/admin/users/_components/tabs-list"
import { TabsListFallback } from "~/src/app/[locale]/(admin)/admin/users/_components/tabs-list-fallback"

const TABS_LIST_FALLBACK = <TabsListFallback />
const ACTIVE_TAB_FALLBACK = <AllUsersTabFallback />

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/admin/users">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "pages.admin.users" })

  return {
    description: t("metadata.description"),
    title: t("metadata.title"),
  }
}

export default async function UsersPage({ searchParams }: Readonly<PageProps<"/[locale]/admin/users">>): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.users")

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-background">
      <div className="-mx-4 -mt-4 shrink-0 bg-secondary/20 px-4 pt-4 pb-4 md:-mx-6 md:-mt-6 md:px-6 md:pt-6 md:pb-6">
        <h1 className="mb-1 text-2xl font-medium tracking-tight text-foreground">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden pt-4">
        <Suspense fallback={TABS_LIST_FALLBACK}>
          <TabsList />
        </Suspense>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden pt-4">
          <Suspense fallback={ACTIVE_TAB_FALLBACK}>
            <ActiveTab searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
