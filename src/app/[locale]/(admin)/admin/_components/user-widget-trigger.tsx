"use client"

import type { ComponentProps, JSX } from "react"

import { ChevronsUpDown, User2 } from "lucide-react"

import { SidebarMenuButton } from "~/src/components/shadcn/sidebar"

interface UserWidgetTriggerProps {
  readonly email: string
  readonly name: string
}

export function UserWidgetTrigger({
  email,
  name,
  ...props
}: UserWidgetTriggerProps & ComponentProps<typeof SidebarMenuButton>): JSX.Element {
  return (
    <SidebarMenuButton
      size="lg"
      className="bg-sidebar-accent/50 data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
      {...props}
    >
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <User2 className="size-4" />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5 leading-none">
        <span className="truncate font-medium">{name}</span>
        <span className="truncate text-xs text-muted-foreground">{email}</span>
      </div>
      <ChevronsUpDown className="ml-auto size-4 shrink-0" />
    </SidebarMenuButton>
  )
}
