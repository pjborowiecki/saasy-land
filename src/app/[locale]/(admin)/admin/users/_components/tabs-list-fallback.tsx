"use client"

import type { JSX } from "react"

import { useTranslations } from "next-intl"

import { TABS } from "~/src/app/[locale]/(admin)/admin/users/_lib/tabs"

export function TabsListFallback(): JSX.Element {
  const t = useTranslations("pages.admin.users.tabs")

  return (
    <div className="-mx-4 px-4 md:-mx-6 md:px-6">
      <div className="no-scrollbar flex h-auto w-full justify-start gap-6 overflow-x-auto border-b border-border p-0">
        {TABS.map((tab) => (
          <div key={tab} className="flex-none px-0 pb-3 text-sm font-medium text-muted-foreground">
            {t(tab)}
          </div>
        ))}
      </div>
    </div>
  )
}
