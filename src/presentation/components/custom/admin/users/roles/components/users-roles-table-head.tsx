import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

const TableHeaderCell = ({ children }: { readonly children: string }): JSX.Element => (
  <th className="h-9 px-3 text-left align-middle text-[0.6875rem] font-medium tracking-[0.04em] whitespace-nowrap text-muted-foreground uppercase">
    {children}
  </th>
)

export const UsersRolesTableHead = (): JSX.Element => {
  const tCommon = useTranslations("pages.admin")

  const t = useTranslations("pages.admin.users")

  return (
    <thead>
      <tr className="border-b border-border bg-muted/40">
        <TableHeaderCell>{t("roles.table.headers.name")}</TableHeaderCell>
        <TableHeaderCell>{t("roles.table.headers.description")}</TableHeaderCell>
        <TableHeaderCell>{t("roles.table.headers.type")}</TableHeaderCell>
        <TableHeaderCell>{t("roles.table.headers.users")}</TableHeaderCell>
        <th className="w-12 p-4" aria-label={tCommon("labels.actions")} />
      </tr>
    </thead>
  )
}
