"use client"

import { useSelectedLayoutSegment } from "next/navigation"
import type { JSX } from "react"

import { useTranslations } from "next-intl"

import { Tabs, TabsList, TabsTrigger } from "~/src/presentation/components/shadcn/tabs"

import { TABS } from "~/src/app/[locale]/(admin)/admin/users/_lib/tabs"

export function UsersNavTabs(): JSX.Element {
  const t = useTranslations("pages.admin.users")
  const selectedSegment = useSelectedLayoutSegment()

  const activeTab = TABS.find((tab) => tab.segment === selectedSegment) ?? TABS[0]

  return (
    <Tabs selectedKey={activeTab.id} className="w-full">
      <div className="border-b border-border">
        <TabsList variant="line" className="no-scrollbar flex-1 justify-start gap-6 overflow-x-auto">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.id} id={tab.id} href={tab.href} className="flex-none px-0 text-sm">
              {t(`tabs.${tab.id}`)}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  )
}
