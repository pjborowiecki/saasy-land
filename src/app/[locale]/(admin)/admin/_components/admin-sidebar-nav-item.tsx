"use client"

import type { JSX } from "react"

import { useTranslations } from "next-intl"

import { cn } from "~/src/utils"

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

/**
 * One row of the console's navigation.
 *
 * The active row is marked by a fill and by its icon turning to the accent, not by a coloured
 * bar or a bold weight jump. The accent is the palette's only chroma and its job everywhere in
 * the product is to say "this is the live one", so the icon is where it belongs: it is the part
 * of the row the eye lands on when scanning a list of twelve.
 *
 * Icons at `strokeWidth={1.5}` and 16px, uniformly. A sidebar where the stroke weight drifts
 * between icons is the fastest way to make a console look assembled from parts.
 */
export function AdminSidebarNavItem({ item, pathname }: AdminSidebarNavItemProps): JSX.Element {
  const t = useTranslations("pages.admin.sidebar")

  const isActive = item.url === "/admin" ? pathname === "/admin" : pathname === item.url || pathname.startsWith(`${item.url}/`)

  const badgeKey = "badgeKey" in item ? item.badgeKey : undefined
  const badgeLabel = badgeKey !== undefined && isSidebarBadgeKey(badgeKey) ? t(`badges.${badgeKey}`) : undefined

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
      {badgeLabel === undefined ? undefined : (
        <SidebarMenuBadge className="top-1! h-5 rounded-md bg-sidebar-accent font-mono text-[0.6875rem] text-muted-foreground">
          {badgeLabel}
        </SidebarMenuBadge>
      )}
    </SidebarMenuItem>
  )
}
