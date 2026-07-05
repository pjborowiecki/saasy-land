"use client"

import { type JSX, useMemo } from "react"

import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "~/src/components/shadcn/dropdown-menu"
import { SidebarMenu, SidebarMenuItem } from "~/src/components/shadcn/sidebar"

import { SignOutButton } from "~/src/app/[locale]/(admin)/admin/_components/sign-out-button"
import { UserWidgetMenuHeader, UserWidgetTrigger } from "~/src/app/[locale]/(admin)/admin/_components/user-widget-trigger"

interface UserWidgetClientProps {
  readonly email: string
  readonly name: string
}

export function UserWidgetClient({ email, name }: UserWidgetClientProps): JSX.Element {
  const triggerRender = useMemo(() => <UserWidgetTrigger email={email} name={name} />, [email, name])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={triggerRender} />
          <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56" side="bottom" align="end" sideOffset={4}>
            <UserWidgetMenuHeader email={email} name={name} />
            <DropdownMenuSeparator />
            <div className="p-1">
              <SignOutButton />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
