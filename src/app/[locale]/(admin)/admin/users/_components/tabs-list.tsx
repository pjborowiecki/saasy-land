"use client"

import { useCallback, useTransition, type JSX } from "react"

import type { Key } from "@react-types/shared"
import { useTranslations } from "next-intl"
import { useQueryState } from "nuqs"

import { Tabs, TabsList as UiTabsList, TabsTrigger } from "~/src/presentation/components/shadcn/tabs"

import { searchParams } from "~/src/app/[locale]/(admin)/admin/users/_lib/search-params"
import { TABS, type UsersPageTab } from "~/src/app/[locale]/(admin)/admin/users/_lib/tabs"

function isUsersPageTab(value: string): value is UsersPageTab {
  return (TABS as readonly string[]).includes(value)
}

export function TabsList(): JSX.Element {
  const [isPending, startTransition] = useTransition()

  const [activeTab, setActiveTab] = useQueryState("tab", searchParams.tab.withOptions({ startTransition }))

  const t = useTranslations("pages.admin.users.tabs")

  const handleSelectionChange = useCallback(
    (key: Key) => {
      if (typeof key !== "string" || !isUsersPageTab(key)) {
        return
      }
      void setActiveTab(key)
    },
    [setActiveTab],
  )

  return (
    <div aria-busy={isPending || undefined} className="-mx-4 px-4 md:-mx-6 md:px-6">
      <Tabs selectedKey={activeTab} onSelectionChange={handleSelectionChange}>
        <UiTabsList
          variant="line"
          className="no-scrollbar h-auto w-full justify-start gap-6 overflow-x-auto rounded-none border-b border-border bg-transparent p-0"
        >
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab}
              id={tab}
              className="flex-none rounded-none px-0 pb-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(tab)}
            </TabsTrigger>
          ))}
        </UiTabsList>
      </Tabs>
    </div>
  )
}
