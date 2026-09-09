import { type JSX } from "react"

import { useRouter } from "@tanstack/react-router"
import { Settings } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "~/src/presentation/components/shadcn/dropdown-menu"
import { SidebarMenu, SidebarMenuItem } from "~/src/presentation/components/shadcn/sidebar"

import { SignOutButton } from "~/src/presentation/components/custom/admin/components/sign-out-button"
import { UserWidgetTrigger } from "~/src/presentation/components/custom/admin/components/user-widget-trigger"

import { ROUTES } from "~/src/routes"

interface UserWidgetClientProps {
  readonly email: string
  readonly name: string
}

export const UserWidgetClient = ({ email, name }: UserWidgetClientProps): JSX.Element => {
  const router = useRouter()
  const t = useTranslations("pages.admin.components.userWidget")

  const handleOpenSettings = () => {
    void router.navigate({ to: ROUTES.ADMIN_SETTINGS })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenuTrigger>
          <UserWidgetTrigger email={email} name={name} />
          <DropdownMenu className="min-w-56" offset={4} placement="top start">
            <DropdownMenuItem onAction={handleOpenSettings}>
              <Settings className="size-4" />
              {t("settings")}
            </DropdownMenuItem>
            <SignOutButton />
          </DropdownMenu>
        </DropdownMenuTrigger>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
