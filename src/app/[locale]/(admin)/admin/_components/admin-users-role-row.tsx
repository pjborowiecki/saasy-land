import type { JSX } from "react"

import { MoreHorizontal } from "lucide-react"

import { Badge } from "~/src/components/shadcn/badge"
import { Button } from "~/src/components/shadcn/button"

import { getRoleTypeBadgeClass } from "~/src/app/[locale]/(admin)/admin/_lib/status-colors"
import type { AdminRoleRow } from "~/src/app/[locale]/(admin)/admin/_types"

type RoleRow = AdminRoleRow

interface AdminUsersRoleRowProps {
  readonly role: RoleRow
}

export function AdminUsersRoleRow({ role }: AdminUsersRoleRowProps): JSX.Element {
  return (
    <tr className="group transition-colors hover:bg-secondary/20">
      <td className="p-4 text-center">
        <input type="checkbox" aria-label="Select row" className="size-4 shrink-0 rounded border border-input accent-primary" />
      </td>
      <td className="p-4">
        <span className="text-sm font-medium text-foreground">{role.name}</span>
      </td>
      <td className="max-w-sm truncate p-4 text-sm text-muted-foreground">{role.description}</td>
      <td className="p-4">
        <Badge variant="outline" className={`px-2 py-1 text-xs font-medium ${getRoleTypeBadgeClass(role.typeColor)}`}>
          {role.type}
        </Badge>
      </td>
      <td className="p-4 text-sm text-muted-foreground">{role.usersCount}</td>
      <td className="p-4 text-right">
        <Button variant="ghost" size="icon" aria-label="Row actions">
          <MoreHorizontal className="size-4" />
        </Button>
      </td>
    </tr>
  )
}
