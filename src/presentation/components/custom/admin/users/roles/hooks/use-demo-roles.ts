import { useTranslations } from "use-intl/react"

import { ADMIN_ROLE_ROWS } from "~/src/data/admin"

import type { AdminRoleRow } from "~/src/presentation/components/custom/admin/types"
export const useDemoRoles = (): AdminRoleRow[] => {
  const t = useTranslations("pages.admin.users")
  return ADMIN_ROLE_ROWS.map((role) => ({
    description: t(`demo.roles.${role.id}.description`),
    icon: role.icon,
    iconColor: role.iconColor,
    id: role.id,
    name: t(`demo.roles.${role.id}.name`),
    type: t(`demo.roles.${role.id}.type`),
    typeColor: role.typeColor,
    usersCount: t("roles.table.usersCount", { count: role.usersCount }),
  }))
}
