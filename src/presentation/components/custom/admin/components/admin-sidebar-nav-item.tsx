import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

import { cn } from "~/src/lib/cn"

import { SidebarMenuButton, SidebarMenuItem } from "~/src/presentation/components/shadcn/sidebar"

import type { SidebarNavItem } from "~/src/presentation/components/custom/admin/constants/sidebar"

import { ROUTES } from "~/src/routes"

interface AdminSidebarNavItemProps {
  readonly item: SidebarNavItem
  readonly pathname: string
}

export const AdminSidebarNavItem = ({ item, pathname }: AdminSidebarNavItemProps): JSX.Element => {
  const t = useTranslations("pages.admin.sidebar")

  const isActive = item.url === ROUTES.ADMIN ? pathname === ROUTES.ADMIN : pathname === item.url || pathname.startsWith(`${item.url}/`)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className="h-8 gap-2.5 rounded-md px-2 text-[0.8125rem] transition-colors duration-200 ease-exp data-active:font-medium"
        href={item.url}
        isActive={isActive}
      >
        <item.icon
          className={cn("size-4 transition-colors duration-200 ease-exp", isActive ? "text-ring" : "text-muted-foreground")}
          strokeWidth={1.5}
        />
        <span className={isActive ? "text-foreground" : "text-sidebar-foreground/80"}>{t(`links.${item.titleKey}`)}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
