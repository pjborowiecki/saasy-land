import type { JSX } from "react"

import type { CellContext } from "@tanstack/react-table"
import { useTranslations } from "use-intl/react"

import type { User } from "~/src/modules/user/user.types"
import type { UserStatus } from "~/src/modules/user/user.utils"

import { useDateFormatter } from "~/src/hooks/use-date-formatter"

import { cn } from "~/src/lib/cn"

import { Badge } from "~/src/presentation/components/shadcn/badge"

import { EMPTY_STRING_LENGTH } from "~/src/presentation/components/custom/admin/constants/constants"
import { getStatusBadgeClass } from "~/src/presentation/components/custom/admin/constants/status-colors"
import { isUserRole, userListStatusColor } from "~/src/presentation/components/custom/admin/users/all/lib/user-display"
import { initialsFromName } from "~/src/presentation/components/custom/admin/users/all/utils"
import type { DataTableFeatures } from "~/src/presentation/components/custom/data-table/features"

/**
 * The initials tile used to be a rounded circle filled with a per-user gradient picked by
 * hashing the id: five saturated two-stop gradients, so a table of seven users showed teal,
 * blue, pink, amber and cyan at once on a console whose palette has a single hue. The colour
 * carried no information either, since the hash is of an opaque id.
 *
 * It is now the same squircle-with-initials the sidebar uses for the signed-in account, in the
 * neutral. Identity comes from the two letters, which is what identity is.
 */
export const UserCell = ({ row }: Readonly<CellContext<DataTableFeatures, User["select"], User["select"]["name"]>>): JSX.Element => {
  const { banned, email, image, name } = row.original

  return (
    <div className="flex items-center gap-3">
      {typeof image === "string" && image.length > EMPTY_STRING_LENGTH ? (
        <img
          alt={name}
          className={cn("size-8 shrink-0 rounded-md border border-border object-cover", { "opacity-50 grayscale": banned })}
          height={32}
          src={image}
          width={32}
        />
      ) : (
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-[0.6875rem] font-semibold",
            banned ? "text-muted-foreground" : "text-foreground",
          )}
        >
          {initialsFromName(name)}
        </div>
      )}
      <div className="min-w-0">
        <p className={cn("font-medium", banned ? "text-muted-foreground line-through" : "text-foreground")}>{name}</p>
        <p className="text-xs text-muted-foreground">{email}</p>
      </div>
    </div>
  )
}

export const RoleCell = ({ getValue }: Readonly<CellContext<DataTableFeatures, User["select"], User["select"]["role"]>>): JSX.Element => {
  const t = useTranslations("pages.admin.users")
  const role = getValue()

  return <span className="text-muted-foreground">{isUserRole(role) ? t(`filters.role.options.${role}`) : role}</span>
}

export const StatusCell = ({ getValue, row }: Readonly<CellContext<DataTableFeatures, User["select"], UserStatus>>): JSX.Element => {
  const t = useTranslations("pages.admin.users")
  const status = getValue()

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 rounded-md px-2 py-0.5 text-[0.6875rem] font-medium", getStatusBadgeClass(userListStatusColor(row.original)))}
    >
      {t(`filters.status.options.${status}`)}
    </Badge>
  )
}

export const BooleanCell = ({ getValue }: Readonly<CellContext<DataTableFeatures, User["select"], boolean>>): JSX.Element => {
  const t = useTranslations("pages.admin.users")
  const value = getValue()

  return <span className="text-muted-foreground">{value ? t("table.booleans.yes") : t("table.booleans.no")}</span>
}

export const TimezoneCell = ({
  getValue,
}: Readonly<CellContext<DataTableFeatures, User["select"], User["select"]["timezone"]>>): JSX.Element => (
  <span className="text-muted-foreground">{getValue()}</span>
)

export const DateCell = ({ getValue, row }: Readonly<CellContext<DataTableFeatures, User["select"], Date>>): JSX.Element => {
  const { formatDate } = useDateFormatter({
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  })

  return (
    <span className="text-sm text-muted-foreground" suppressHydrationWarning>
      {formatDate({ timeZone: row.original.timezone, value: getValue() })}
    </span>
  )
}
