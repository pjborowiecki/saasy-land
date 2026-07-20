import type { JSX } from "react"

import { ChevronDown, Filter, PlusCircle, Search } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/components/shadcn/button"
import { Card } from "~/src/components/shadcn/card"
import { Input } from "~/src/components/shadcn/input"
import { TabsContent } from "~/src/components/shadcn/tabs"

import { AdminUsersRoleRow } from "~/src/app/[locale]/(admin)/admin/_components/admin-users-role-row"
import { UsersRolesPagination } from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/roles/_components/users-roles-pagination"
import { UsersRolesTableHead } from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/roles/_components/users-roles-table-head"
import { getAdminRoles } from "~/src/app/[locale]/(admin)/admin/users/_lib/users-data"

export async function UsersRolesTab(): Promise<JSX.Element> {
  const [t, roles] = await Promise.all([getTranslations("pages.admin.users"), getAdminRoles()])
  return (
    <TabsContent id="roles" className="mt-0 space-y-8 outline-none">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-medium tracking-tight text-foreground">{t("roles.title")}</h1>
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
            <tbody className="divide-y divide-border/40">
              {roles.map((role) => (
                <AdminUsersRoleRow key={role.id} role={role} />
              ))}
            </tbody>
          </table>
        </div>
        <UsersRolesPagination />
      </Card>
    </TabsContent>
  )
}
