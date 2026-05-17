"use client"

import type { JSX, ReactNode } from "react"
import { Suspense } from "react"

import { useTranslations } from "next-intl"

import { CONSTANTS } from "~/src/constants"

import { Link, usePathname } from "~/src/integrations/next-intl/i18n.navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/src/components/shadcn/sidebar"

interface AdminSidebarProps {
  userWidget: ReactNode
}

export function AdminSidebar({ userWidget }: AdminSidebarProps): JSX.Element {
  const t = useTranslations("admin.sidebar")
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="h-16 justify-center border-border/40 border-b py-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="font-bold">{t("logo")}</span>
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">{t("title")}</span>
                <span className="text-xs">{t("version")}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-6 pt-4">
        {CONSTANTS.SIDEBAR_CONFIG.map((group) => (
          <SidebarGroup key={group.titleKey}>
            <div className="mb-2 px-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">
              {t(`groups.${group.titleKey}`)}
            </div>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton
                    isActive={item.url === "/admin" ? pathname === "/admin" : pathname === item.url || pathname.startsWith(`${item.url}/`)}
                    className="h-9"
                    render={
                      <Link href={item.url}>
                        <item.icon className="size-[18px] opacity-70" />
                        <span className="font-medium text-[14px]">{t(`links.${item.titleKey}`)}</span>
                      </Link>
                    }
                  />
                  {"badgeKey" in item && item.badgeKey ? (
                    // biome-ignore lint/suspicious/noExplicitAny: Dynamic key access for Next-Intl
                    <SidebarMenuBadge>{t(`badges.${item.badgeKey}` as any)}</SidebarMenuBadge>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <Suspense fallback={<div className="h-10 animate-pulse rounded-lg bg-sidebar-accent/50" />}>{userWidget}</Suspense>
      </SidebarFooter>
    </Sidebar>
  )
}
