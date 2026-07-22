"use client"

import { type JSX, type ReactNode } from "react"

import { useTranslations } from "next-intl"

import { Tabs, TabsList } from "~/src/presentation/components/shadcn/tabs"

import { UsersTabTrigger } from "~/src/app/[locale]/(admin)/admin/users/_components/users-tab-trigger"
import type { UsersPageTab } from "~/src/app/[locale]/(admin)/admin/users/_lib/users-page-tabs"

interface UsersPageTabsProps {
  readonly activeTab: UsersPageTab
  readonly children: ReactNode
  readonly description: string
  readonly title: string
}

export function UsersPageTabs({ activeTab, children, description, title }: Readonly<UsersPageTabsProps>): JSX.Element {
  const t = useTranslations("pages.admin.users")

  return (
    <Tabs selectedKey={activeTab} className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <div className="-mx-4 -mt-4 shrink-0 bg-secondary/20 px-4 pt-4 md:-mx-6 md:-mt-6 md:px-6 md:pt-6">
        <div className="mb-4">
          <h1 className="mb-1 text-2xl font-medium tracking-tight text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="flex border-b border-border/40">
          <TabsList variant="line" className="no-scrollbar flex-1 justify-start gap-6 overflow-x-auto">
            <UsersTabTrigger tab="allUsers" className="flex-none px-0 text-sm">
              {t("tabs.allUsers")}
            </UsersTabTrigger>
            <UsersTabTrigger tab="invitations" className="flex-none px-0 text-sm">
              {t("tabs.invitations")}
            </UsersTabTrigger>
            <UsersTabTrigger tab="roles" className="flex-none px-0 text-sm">
              {t("tabs.roles")}
            </UsersTabTrigger>
            <UsersTabTrigger tab="security" className="flex-none px-0 text-sm">
              {t("tabs.security")}
            </UsersTabTrigger>
          </TabsList>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden pt-4">{children}</div>
    </Tabs>
  )
}
