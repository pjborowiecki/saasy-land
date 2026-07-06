import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { UsersTableCheckbox } from "~/src/app/[locale]/(admin)/admin/users/_components/users-table-checkbox"

function TableHeaderCell({ children }: { readonly children: string }): JSX.Element {
  return <th className="p-4 text-xs font-medium tracking-wider text-muted-foreground uppercase">{children}</th>
}

export async function UsersInvitationsTableHead(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.users")
  return (
    <thead>
      <tr className="border-b border-border/40 bg-secondary/20">
        <th className="w-12 p-4 text-center">
          <UsersTableCheckbox selectAll />
        </th>
        <TableHeaderCell>{t("invitations.table.headers.email")}</TableHeaderCell>
        <TableHeaderCell>{t("invitations.table.headers.role")}</TableHeaderCell>
        <TableHeaderCell>{t("invitations.table.headers.status")}</TableHeaderCell>
        <TableHeaderCell>{t("invitations.table.headers.sentDate")}</TableHeaderCell>
        <th className="w-12 p-4" aria-label="Actions" />
      </tr>
    </thead>
  )
}
