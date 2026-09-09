import type { JSX } from "react"

import { MoreHorizontal } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { Badge } from "~/src/presentation/components/shadcn/badge"
import { Button } from "~/src/presentation/components/shadcn/button"

import { getStatusBadgeClass } from "~/src/presentation/components/custom/admin/constants/status-colors"
import type { AdminInvitationRow } from "~/src/presentation/components/custom/admin/types"

interface AdminUsersInvitationRowProps {
  readonly invite: AdminInvitationRow
}

export const AdminUsersInvitationRow = ({ invite }: AdminUsersInvitationRowProps): JSX.Element => {
  const tCommon = useTranslations("pages.admin")

  return (
    <tr className="group transition-colors hover:bg-muted/40">
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
        <Button variant="ghost" size="icon" aria-label={tCommon("labels.rowActions")}>
          <MoreHorizontal className="size-4" />
        </Button>
      </td>
    </tr>
  )
}
