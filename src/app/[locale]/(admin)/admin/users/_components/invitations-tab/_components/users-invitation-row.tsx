import type { JSX } from "react"

import { MoreHorizontal } from "lucide-react"

import { Badge } from "~/src/presentation/components/shadcn/badge"
import { Button } from "~/src/presentation/components/shadcn/button"

import { getStatusBadgeClass } from "~/src/app/[locale]/(admin)/admin/_lib/status-colors"
import type { AdminInvitationRow } from "~/src/app/[locale]/(admin)/admin/_types"

type InvitationRow = AdminInvitationRow

interface AdminUsersInvitationRowProps {
  readonly invite: InvitationRow
}

export function AdminUsersInvitationRow({ invite }: AdminUsersInvitationRowProps): JSX.Element {
  return (
    <tr className="group transition-colors hover:bg-secondary/20">
      <td className="p-4">
        <p className="text-sm font-medium text-foreground">{invite.email}</p>
      </td>
      <td className="p-4 text-sm text-muted-foreground">{invite.role}</td>
      <td className="p-4">
        <Badge variant="outline" className={`px-2 py-1 text-xs font-medium ${getStatusBadgeClass(invite.statusColor)}`}>
          {invite.status}
        </Badge>
      </td>
      <td className="p-4 text-sm text-muted-foreground">{invite.sentDate}</td>
      <td className="p-4 text-right">
        <Button variant="ghost" size="icon" aria-label="Row actions">
          <MoreHorizontal className="size-4" />
        </Button>
      </td>
    </tr>
  )
}
