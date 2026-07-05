"use client"

import type { JSX } from "react"

import { ChevronsUpDown, User2 } from "lucide-react"

import { SidebarMenuButton } from "~/src/components/shadcn/sidebar"

interface UserWidgetTriggerProps {
  readonly email: string
  readonly name: string
}

export function UserWidgetTrigger({ email, name }: UserWidgetTriggerProps): JSX.Element {
  return (
    <SidebarMenuButton
      size="lg"
      className="bg-sidebar-accent/50 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
    >
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <User2 className="size-4" />
      </div>
      <div className="flex flex-col gap-0.5 leading-none">
        <span className="font-medium">{name}</span>
        <span className="truncate text-xs text-muted-foreground">{email}</span>
      </div>
      <ChevronsUpDown className="ml-auto size-4" />
    </SidebarMenuButton>
  )
}

export function UserWidgetMenuHeader({ email, name }: UserWidgetTriggerProps): JSX.Element {
  return (
    <div className="p-0 font-normal">
      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <User2 className="size-4" />
        </div>
        <div className="flex flex-col gap-0.5 leading-none">
          <span className="font-medium">{name}</span>
          <span className="truncate text-xs text-muted-foreground">{email}</span>
        </div>
      </div>
    </div>
  )
}
