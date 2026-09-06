import type { JSX } from "react"

import { ChevronDown, Filter, PlusCircle, Search } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Card } from "~/src/presentation/components/shadcn/card"
import { Input } from "~/src/presentation/components/shadcn/input"

import { AdminUsersRoleRow } from "~/src/presentation/components/custom/admin/users/roles/components/users-role-row"
import { UsersRolesPagination } from "~/src/presentation/components/custom/admin/users/roles/components/users-roles-pagination"
import { UsersRolesTableHead } from "~/src/presentation/components/custom/admin/users/roles/components/users-roles-table-head"
import { useDemoRoles } from "~/src/presentation/components/custom/admin/users/roles/hooks/use-demo-roles"

export const UsersRolesTab = (): JSX.Element => {
  const t = useTranslations("pages.admin.users")
  const roles = useDemoRoles()
  return (
    <div className="mt-0 space-y-8 outline-none">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-statement font-semibold text-foreground">{t("roles.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("roles.description")}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" className="h-9 gap-2">
            <PlusCircle className="size-4" />
            {t("roles.actions.createRole")}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="group relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
          <Input aria-label={t("roles.search.placeholder")} placeholder={t("roles.search.placeholder")} className="h-10 w-full pl-10" />
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-10 gap-2 whitespace-nowrap">
            <Filter className="size-4 text-muted-foreground" />
            {t("roles.filters.type")}
            <ChevronDown className="ml-1 size-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <UsersRolesTableHead />
            <tbody className="divide-y divide-border">
              {roles.map((role) => (
                <AdminUsersRoleRow key={role.id} role={role} />
              ))}
            </tbody>
          </table>
        </div>
        <UsersRolesPagination />
      </Card>
    </div>
  )
}
