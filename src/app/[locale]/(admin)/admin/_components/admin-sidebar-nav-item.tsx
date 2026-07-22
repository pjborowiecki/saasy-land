"use client"

import type { JSX } from "react"

import { useTranslations } from "next-intl"

import { SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from "~/src/presentation/components/shadcn/sidebar"

import type { SidebarNavItem } from "~/src/app/[locale]/(admin)/admin/_lib/sidebar"

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

  const badgeKey = "badgeKey" in item ? item.badgeKey : undefined
  const badgeLabel = badgeKey !== undefined && isSidebarBadgeKey(badgeKey) ? t(`badges.${badgeKey}`) : undefined

  return (
    <SidebarMenuItem>
      <SidebarMenuButton className="h-9" href={item.url} isActive={isActive}>
        <item.icon className="size-[18px] opacity-70" />
        <span className="text-[14px] font-medium">{t(`links.${item.titleKey}`)}</span>
      </SidebarMenuButton>
      {badgeLabel === undefined ? undefined : <SidebarMenuBadge>{badgeLabel}</SidebarMenuBadge>}
    </SidebarMenuItem>
  )
}
