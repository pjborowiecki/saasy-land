"use client"

import { type JSX, useCallback, useMemo } from "react"

import { Settings } from "lucide-react"
import { useTranslations } from "next-intl"

import { CONSTANTS } from "~/src/constants"

import { useRouter } from "~/src/integrations/next-intl/i18n.navigation"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/src/components/shadcn/dropdown-menu"
import { SidebarMenu, SidebarMenuItem } from "~/src/components/shadcn/sidebar"

import { SignOutButton } from "~/src/app/[locale]/(admin)/admin/_components/sign-out-button"
import { UserWidgetTrigger } from "~/src/app/[locale]/(admin)/admin/_components/user-widget-trigger"

interface UserWidgetClientProps {
  readonly email: string
  readonly name: string
}

export function UserWidgetClient({ email, name }: UserWidgetClientProps): JSX.Element {
  const router = useRouter()
  const t = useTranslations("pages.admin.components.userWidget")
  const triggerRender = useMemo(() => <UserWidgetTrigger email={email} name={name} />, [email, name])

  const handleOpenSettings = useCallback(() => {
    router.push(CONSTANTS.ROUTES.ADMIN_SETTINGS)
  }, [router])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={triggerRender} />
          <DropdownMenuContent align="start" className="min-w-56" side="top" sideOffset={4}>
            <DropdownMenuItem onClick={handleOpenSettings}>
              <Settings className="size-4" />
              {t("settings")}
            </DropdownMenuItem>
            <SignOutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
