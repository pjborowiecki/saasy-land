import type { JSX } from "react"

import { MoreHorizontal } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { Badge } from "~/src/presentation/components/shadcn/badge"
import { Button } from "~/src/presentation/components/shadcn/button"

import { getRoleTypeBadgeClass } from "~/src/presentation/components/custom/admin/constants/status-colors"
import type { AdminRoleRow } from "~/src/presentation/components/custom/admin/types"

type RoleRow = AdminRoleRow

interface AdminUsersRoleRowProps {
  readonly role: RoleRow
}

export const AdminUsersRoleRow = ({ role }: AdminUsersRoleRowProps): JSX.Element => {
  const tCommon = useTranslations("pages.admin")

  return (
    <tr className="group transition-colors hover:bg-muted/40">
      <td className="p-4">
        <span className="text-sm font-medium text-foreground">{role.name}</span>
      </td>
      <td className="max-w-sm truncate p-4 text-sm text-muted-foreground">{role.description}</td>
      <td className="p-4">
        <Badge variant="outline" className={`px-2 py-1 text-xs font-medium ${getRoleTypeBadgeClass()}`}>
          {role.type}
        </Badge>
      </td>
      <td className="p-4 text-sm text-muted-foreground">{role.usersCount}</td>
      <td className="p-4 text-right">
        <Button variant="ghost" size="icon" aria-label={tCommon("labels.rowActions")}>
          <MoreHorizontal className="size-4" />
        </Button>
      </td>
    </tr>
  )
}
