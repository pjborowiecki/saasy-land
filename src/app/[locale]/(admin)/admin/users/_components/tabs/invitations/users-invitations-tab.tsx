import type { JSX } from "react"

import { ChevronDown, Filter, Link, Mail, Search } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/components/shadcn/button"
import { Card } from "~/src/components/shadcn/card"
import { Input } from "~/src/components/shadcn/input"
import { TabsContent } from "~/src/components/shadcn/tabs"

import { AdminUsersInvitationRow } from "~/src/app/[locale]/(admin)/admin/_components/admin-users-invitation-row"
import { UsersInvitationsPagination } from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/invitations/_components/users-invitations-pagination"
import { UsersInvitationsTableHead } from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/invitations/_components/users-invitations-table-head"
import { getAdminInvitations } from "~/src/app/[locale]/(admin)/admin/users/_lib/users-data"

export async function UsersInvitationsTab(): Promise<JSX.Element> {
  const [t, invitations] = await Promise.all([getTranslations("pages.admin.users"), getAdminInvitations()])
  return (
    <TabsContent value="invitations" className="mt-0 space-y-8 outline-none">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-medium tracking-tight text-foreground">{t("invitations.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("invitations.description")}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <Link className="size-4 text-muted-foreground" />
            {t("invitations.actions.copyLink")}
          </Button>
          <Button size="sm" className="h-9 gap-2">
            <Mail className="size-4" />
            {t("invitations.actions.sendInvite")}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="group relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
          <Input
            aria-label={t("invitations.search.placeholder")}
            placeholder={t("invitations.search.placeholder")}
            className="h-10 w-full pl-10"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-10 gap-2 whitespace-nowrap">
            <Filter className="size-4 text-muted-foreground" />
            {t("invitations.filters.role")}
            <ChevronDown className="ml-1 size-4 text-muted-foreground" />
          </Button>
          <Button variant="outline" size="sm" className="h-10 gap-2 whitespace-nowrap">
            {t("invitations.filters.status")}
            <ChevronDown className="ml-1 size-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <UsersInvitationsTableHead />
            <tbody className="divide-y divide-border/40">
              {invitations.map((invite) => (
                <AdminUsersInvitationRow key={invite.id} invite={invite} />
              ))}
            </tbody>
          </table>
        </div>
        <UsersInvitationsPagination />
      </Card>
    </TabsContent>
  )
}
