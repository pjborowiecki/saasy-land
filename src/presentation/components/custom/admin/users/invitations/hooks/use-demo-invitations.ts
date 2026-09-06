import { useTranslations } from "use-intl/react"

import { ADMIN_INVITATION_ROWS } from "~/src/data/admin"

import type { AdminInvitationRow } from "~/src/presentation/components/custom/admin/types"
export const useDemoInvitations = (): AdminInvitationRow[] => {
  const t = useTranslations("pages.admin.users")
  return ADMIN_INVITATION_ROWS.map((invite) => ({
    email: invite.email,
    id: invite.id,
    invitedBy: invite.invitedBy,
    role: t(`demo.invitations.${invite.id}.role`),
    sentDate: t(`demo.invitations.${invite.id}.sentDate`),
    status: t(`demo.invitations.${invite.id}.status`),
    statusColor: invite.statusColor,
  }))
}
