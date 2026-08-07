import type { JSX } from "react"

import { useTranslations } from "next-intl"

function TableHeaderCell({ children }: { readonly children: string }): JSX.Element {
  return <th className="p-4 text-xs font-medium tracking-wider text-muted-foreground uppercase">{children}</th>
}

export function UsersInvitationsTableHead(): JSX.Element {
  const t = useTranslations("pages.admin.users")
  return (
    <thead>
      <tr className="border-b border-border/40 bg-secondary/20">
        <TableHeaderCell>{t("invitations.table.headers.email")}</TableHeaderCell>
        <TableHeaderCell>{t("invitations.table.headers.role")}</TableHeaderCell>
        <TableHeaderCell>{t("invitations.table.headers.status")}</TableHeaderCell>
        <TableHeaderCell>{t("invitations.table.headers.sentDate")}</TableHeaderCell>
        <th className="w-12 p-4" aria-label="Actions" />
      </tr>
    </thead>
  )
}
