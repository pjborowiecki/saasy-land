"use client"

import Image from "next/image"
import type { JSX } from "react"

import type { CellContext } from "@tanstack/react-table"
import { useTranslations } from "next-intl"

import type { User } from "~/src/modules/user/user.types"
import type { UserStatus } from "~/src/modules/user/user.utils"

import { cn } from "~/src/utils"

import { useDateFormatter } from "~/src/hooks/use-date-formatter"

import { Badge } from "~/src/presentation/components/shadcn/badge"

import type { DataTableFeatures } from "~/src/presentation/components/custom/data-table/features"

import { EMPTY_STRING_LENGTH } from "~/src/app/[locale]/(admin)/admin/_lib/constants"
import { getStatusBadgeClass } from "~/src/app/[locale]/(admin)/admin/_lib/status-colors"
import { isUserRole, userListStatusColor } from "~/src/app/[locale]/(admin)/admin/users/all/_components/user-display"
import { avatarGradientClassForId, initialsFromName } from "~/src/app/[locale]/(admin)/admin/users/all/_utils"

export function UserCell({ row }: Readonly<CellContext<DataTableFeatures, User["select"], User["select"]["name"]>>): JSX.Element {
  const { banned, email, id, image, name } = row.original

  return (
    <div className="flex items-center gap-3">
      {typeof image === "string" && image.length > EMPTY_STRING_LENGTH ? (
        <Image
          alt={name}
          className={cn("size-9 shrink-0 rounded-full border border-border/50", {
            "opacity-60 grayscale": banned,
          })}
          height={36}
          src={image}
          width={36}
        />
      ) : (
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-tr text-sm font-medium text-white",
            avatarGradientClassForId(id),
          )}
        >
          {initialsFromName(name)}
        </div>
      )}
      <div>
        <p className={cn("text-sm font-medium", banned ? "text-muted-foreground" : "text-foreground")}>{name}</p>
        <p className="text-xs text-muted-foreground">{email}</p>
      </div>
    </div>
  )
}

export function RoleCell({ getValue }: Readonly<CellContext<DataTableFeatures, User["select"], User["select"]["role"]>>): JSX.Element {
  const t = useTranslations("pages.admin.users")
  const role = getValue()

  return <span className="text-sm text-muted-foreground">{isUserRole(role) ? t(`filters.role.options.${role}`) : role}</span>
}

export function StatusCell({ getValue, row }: Readonly<CellContext<DataTableFeatures, User["select"], UserStatus>>): JSX.Element {
  const t = useTranslations("pages.admin.users")
  const status = getValue()

  return (
    <Badge variant="outline" className={cn("px-2 py-1 text-xs font-medium", getStatusBadgeClass(userListStatusColor(row.original)))}>
      {t(`filters.status.options.${status}`)}
    </Badge>
  )
}

export function BooleanCell({ getValue }: Readonly<CellContext<DataTableFeatures, User["select"], boolean>>): JSX.Element {
  const t = useTranslations("pages.admin.users")
  const value = getValue()

  return <span className="text-sm text-muted-foreground">{value ? t("table.booleans.yes") : t("table.booleans.no")}</span>
}

export function TimezoneCell({
  getValue,
}: Readonly<CellContext<DataTableFeatures, User["select"], User["select"]["timezone"]>>): JSX.Element {
  return <span className="text-sm text-muted-foreground">{getValue()}</span>
}

export function DateCell({ getValue, row }: Readonly<CellContext<DataTableFeatures, User["select"], Date>>): JSX.Element {
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
