import type { JSX } from "react"

import { useTranslations } from "next-intl"

function TableHeaderCell({ children }: { readonly children: string }): JSX.Element {
  return (
    <th className="h-9 px-3 text-left align-middle text-[0.6875rem] font-medium tracking-[0.04em] whitespace-nowrap text-muted-foreground uppercase">
      {children}
    </th>
  )
}

export function UsersInvitationsTableHead(): JSX.Element {
  const t = useTranslations("pages.admin.users")
  return (
    <thead>
      <tr className="border-b border-border bg-muted/40">
        <TableHeaderCell>{t("invitations.table.headers.email")}</TableHeaderCell>
        <TableHeaderCell>{t("invitations.table.headers.role")}</TableHeaderCell>
        <TableHeaderCell>{t("invitations.table.headers.status")}</TableHeaderCell>
        <TableHeaderCell>{t("invitations.table.headers.sentDate")}</TableHeaderCell>
        <th className="w-12 p-4" aria-label="Actions" />
      </tr>
    </thead>
  )
}
