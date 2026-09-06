import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

const TableHeaderCell = ({ children }: { readonly children: string }): JSX.Element => (
  <th className="h-9 px-3 text-left align-middle text-[0.6875rem] font-medium tracking-[0.04em] whitespace-nowrap text-muted-foreground uppercase">
    {children}
  </th>
)

export const UsersInvitationsTableHead = (): JSX.Element => {
  const tCommon = useTranslations("pages.admin")

  const t = useTranslations("pages.admin.users")
  return (
    <thead>
      <tr className="border-b border-border bg-muted/40">
        <TableHeaderCell>{t("invitations.table.headers.email")}</TableHeaderCell>
        <TableHeaderCell>{t("invitations.table.headers.role")}</TableHeaderCell>
        <TableHeaderCell>{t("invitations.table.headers.status")}</TableHeaderCell>
        <TableHeaderCell>{t("invitations.table.headers.sentDate")}</TableHeaderCell>
        <th className="w-12 p-4" aria-label={tCommon("labels.actions")} />
      </tr>
    </thead>
  )
}
