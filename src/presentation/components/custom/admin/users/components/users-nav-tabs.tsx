import type { JSX } from "react"

import { useRouterState } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { Tabs, TabsList, TabsTrigger } from "~/src/presentation/components/shadcn/tabs"

import { TABS } from "~/src/presentation/components/custom/admin/users/constants/tabs"

export const UsersNavTabs = (): JSX.Element => {
  const t = useTranslations("pages.admin.users")
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  const activeTab = TABS.find((tab) => pathname.endsWith(`/${tab.segment}`)) ?? TABS[0]

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
