"use client"

import { type JSX, type ReactNode } from "react"

import { useTranslations } from "next-intl"

import { CONSTANTS } from "~/src/constants"

import { usePathname } from "~/src/integrations/next-intl/i18n.navigation"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarMenu } from "~/src/components/shadcn/sidebar"

import { AdminSidebarHeader } from "~/src/app/[locale]/(admin)/admin/_components/admin-sidebar-header"
import { AdminSidebarNavItem } from "~/src/app/[locale]/(admin)/admin/_components/admin-sidebar-nav-item"

interface AdminSidebarProps {
  readonly children: ReactNode
}

export function AdminSidebar({ children }: AdminSidebarProps): JSX.Element {
  const t = useTranslations("pages.admin.sidebar")
  const pathname = usePathname()

  return (
    <Sidebar>
      <AdminSidebarHeader />
      <SidebarContent className="gap-6 pt-4">
        {CONSTANTS.SIDEBAR_CONFIG.map((group) => (
          <SidebarGroup key={group.titleKey}>
            <div className="mb-2 px-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
              {t(`groups.${group.titleKey}`)}
            </div>
            <SidebarMenu>
              {group.items.map((item) => (
                <AdminSidebarNavItem key={item.titleKey} item={item} pathname={pathname} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>{children}</SidebarFooter>
    </Sidebar>
  )
}
