import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

function TableHeaderCell({ children }: { readonly children: string }): JSX.Element {
  return <th className="p-4 text-xs font-medium tracking-wider text-muted-foreground uppercase">{children}</th>
}

export async function UsersRolesTableHead(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.users")
  return (
    <thead>
      <tr className="border-b border-border/40 bg-secondary/20">
        <TableHeaderCell>{t("roles.table.headers.name")}</TableHeaderCell>
        <TableHeaderCell>{t("roles.table.headers.description")}</TableHeaderCell>
        <TableHeaderCell>{t("roles.table.headers.type")}</TableHeaderCell>
        <TableHeaderCell>{t("roles.table.headers.users")}</TableHeaderCell>
        <th className="w-12 p-4" aria-label="Actions" />
      </tr>
    </thead>
  )
}
