import type { Metadata } from "next"
import type { JSX } from "react"

import { ChevronDown, Filter, Link, Mail, Search } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Card } from "~/src/presentation/components/shadcn/card"
import { Input } from "~/src/presentation/components/shadcn/input"

import { ADMIN_INVITATION_ROWS } from "~/src/app/[locale]/(admin)/admin/_lib/mock-data"
import { AdminUsersInvitationRow } from "~/src/app/[locale]/(admin)/admin/users/invitations/_components/users-invitation-row"
import { UsersInvitationsPagination } from "~/src/app/[locale]/(admin)/admin/users/invitations/_components/users-invitations-pagination"
import { UsersInvitationsTableHead } from "~/src/app/[locale]/(admin)/admin/users/invitations/_components/users-invitations-table-head"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.admin.users")
  return { description: t("metadata.description"), title: `${t("tabs.invitations")} | ${t("metadata.title")}` }
}

export default async function InvitationsPage(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.users")
  const invitations = ADMIN_INVITATION_ROWS

  return (
    <div className="space-y-6 outline-none">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-1 sm:flex-row">
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

        <div className="flex shrink-0 items-center gap-3">
          <Button variant="outline" size="sm" className="h-10 gap-2">
            <Link className="size-4 text-muted-foreground" />
            {t("invitations.actions.copyLink")}
          </Button>
          <Button size="sm" className="h-10 gap-2">
            <Mail className="size-4" />
            {t("invitations.actions.sendInvite")}
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <UsersInvitationsTableHead />
            <tbody className="divide-y divide-border">
              {invitations.map((invite) => (
                <AdminUsersInvitationRow key={invite.id} invite={invite} />
              ))}
            </tbody>
          </table>
        </div>
        <UsersInvitationsPagination />
      </Card>
    </div>
  )
}
