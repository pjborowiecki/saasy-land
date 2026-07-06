import type { JSX } from "react"

import { ChevronDown, Filter, Search } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/components/shadcn/button"
import { Card } from "~/src/components/shadcn/card"
import { Input } from "~/src/components/shadcn/input"
import { TabsContent } from "~/src/components/shadcn/tabs"

import type { AdminUserRow } from "~/src/app/[locale]/(admin)/admin/_types"
import { UsersAllUsersPagination } from "~/src/app/[locale]/(admin)/admin/users/_components/users-all-users-pagination"
import { UsersAllUsersRow } from "~/src/app/[locale]/(admin)/admin/users/_components/users-all-users-row"
import { UsersAllUsersTableHead } from "~/src/app/[locale]/(admin)/admin/users/_components/users-all-users-table-head"

interface UsersAllUsersTabProps {
  readonly users: readonly AdminUserRow[]
}

export async function UsersAllUsersTab({ users }: UsersAllUsersTabProps): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.users")
  return (
    <TabsContent value="allUsers" className="mt-6 space-y-8 outline-none">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="group relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
          <Input aria-label={t("search.placeholder")} placeholder={t("search.placeholder")} className="h-10 w-full pl-10" />
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-10 gap-2 whitespace-nowrap">
            <Filter className="size-4 text-muted-foreground" />
            {t("filters.role")}
            <ChevronDown className="ml-1 size-4 text-muted-foreground" />
          </Button>
          <Button variant="outline" size="sm" className="h-10 gap-2 whitespace-nowrap">
            {t("filters.status")}
            <ChevronDown className="ml-1 size-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <UsersAllUsersTableHead />
            <tbody className="divide-y divide-border/40">
              {users.map((user) => (
                <UsersAllUsersRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>
        <UsersAllUsersPagination />
      </Card>
    </TabsContent>
  )
}
