import type { JSX } from "react"

import { ChevronsUpDown, User2 } from "lucide-react"

import { getCurrentSession } from "~/src/integrations/better-auth/auth.utils"

import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "~/src/components/shadcn/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "~/src/components/shadcn/sidebar"

import { SignOutButton } from "~/src/app/[locale]/(admin)/admin/_components/sign-out-button"

export async function UserWidget(): Promise<JSX.Element | null> {
  const session = await getCurrentSession()
  if (!session) return null

  const name = session.user.name ?? session.user.email
  const email = session.user.email

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="bg-sidebar-accent/50 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <User2 className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">{name}</span>
                  <span className="truncate text-muted-foreground text-xs">{email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56" side="bottom" align="end" sideOffset={4}>
            <div className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <User2 className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">{name}</span>
                  <span className="truncate text-muted-foreground text-xs">{email}</span>
                </div>
              </div>
            </div>
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
