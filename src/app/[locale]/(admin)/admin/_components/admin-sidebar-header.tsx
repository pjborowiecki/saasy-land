"use client"

import type { JSX } from "react"

import { useTranslations } from "next-intl"

import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "~/src/components/shadcn/sidebar"

export function AdminSidebarHeader(): JSX.Element {
  const t = useTranslations("pages.admin.sidebar")

  return (
    <SidebarHeader className="h-16 justify-center border-b border-border/40 py-0">
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
  )
}
