import { type JSX, type ReactNode } from "react"

import { useRouterState } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarMenu } from "~/src/presentation/components/shadcn/sidebar"

import { AdminSidebarHeader } from "~/src/presentation/components/custom/admin/components/admin-sidebar-header"
import { AdminSidebarNavItem } from "~/src/presentation/components/custom/admin/components/admin-sidebar-nav-item"
import { SIDEBAR_CONFIG } from "~/src/presentation/components/custom/admin/constants/sidebar"

interface AdminSidebarProps {
  readonly children: ReactNode
}

/**
 * Four groups, twelve destinations, one hairline.
 *
 * Group labels are set in the monospace micro-label, the same role the marketing site uses for
 * column headings, and they are the only uppercase text in the console. They carry a lot of
 * structure for very little ink, which is what lets the rail stay at 16rem without the rows
 * feeling crowded.
 */
export const AdminSidebar = ({ children }: AdminSidebarProps): JSX.Element => {
  const t = useTranslations("pages.admin.sidebar")
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <Sidebar>
      <AdminSidebarHeader />
      <SidebarContent className="custom-scrollbar gap-5 px-2 pt-4">
        {SIDEBAR_CONFIG.map((group) => (
          <SidebarGroup className="p-0" key={group.titleKey}>
            <div className="mb-1.5 px-2 font-mono text-label text-muted-foreground uppercase">{t(`groups.${group.titleKey}`)}</div>
            <SidebarMenu className="gap-0.5">
              {group.items.map((item) => (
                <AdminSidebarNavItem item={item} key={item.titleKey} pathname={pathname} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2">{children}</SidebarFooter>
    </Sidebar>
  )
}
