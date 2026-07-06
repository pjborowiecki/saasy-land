"use client"

import { type JSX, useMemo } from "react"

import { useTranslations } from "next-intl"

import type { SidebarNavItem } from "~/src/constants/_constants/sidebar"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from "~/src/components/shadcn/sidebar"

type SidebarBadgeKey = "activeSessionsBadge"

function isSidebarBadgeKey(value: string): value is SidebarBadgeKey {
  return value === "activeSessionsBadge"
}

interface AdminSidebarNavItemProps {
  readonly item: SidebarNavItem
  readonly pathname: string
}

export function AdminSidebarNavItem({ item, pathname }: AdminSidebarNavItemProps): JSX.Element {
  const t = useTranslations("pages.admin.sidebar")

  const isActive = item.url === "/admin" ? pathname === "/admin" : pathname === item.url || pathname.startsWith(`${item.url}/`)

  const linkRender = useMemo(
    () => (
      <Link href={item.url}>
        <item.icon className="size-[18px] opacity-70" />
        <span className="text-[14px] font-medium">{t(`links.${item.titleKey}`)}</span>
      </Link>
    ),
    [item, t],
  )

  const badgeKey = "badgeKey" in item ? item.badgeKey : undefined
  const badgeLabel = badgeKey !== undefined && isSidebarBadgeKey(badgeKey) ? t(`badges.${badgeKey}`) : undefined

  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={isActive} className="h-9" render={linkRender} />
      {badgeLabel === undefined ? undefined : <SidebarMenuBadge>{badgeLabel}</SidebarMenuBadge>}
    </SidebarMenuItem>
  )
}
