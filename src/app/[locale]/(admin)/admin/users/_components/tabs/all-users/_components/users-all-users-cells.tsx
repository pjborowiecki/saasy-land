"use client"

import Image from "next/image"
import type { JSX } from "react"

import { type CellContext } from "@tanstack/react-table"
import { useTranslations } from "next-intl"

import { cn } from "~/src/utils"

import { Badge } from "~/src/presentation/components/shadcn/badge"

import { EMPTY_STRING_LENGTH } from "~/src/app/[locale]/(admin)/admin/_lib/constants"
import { getStatusBadgeClass } from "~/src/app/[locale]/(admin)/admin/_lib/status-colors"
import type { AdminUserRow } from "~/src/app/[locale]/(admin)/admin/_types"
import { isUserRole, isUserStatus } from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/all-users/_lib/users-labels"

export function UsersUserCell({ row }: Readonly<CellContext<AdminUserRow, unknown>>): JSX.Element {
  const user = row.original
  const isBanned = user.isBanned === true

  return (
    <div className="flex items-center gap-3">
      {user.avatar !== undefined && user.avatar.length > EMPTY_STRING_LENGTH ? (
        <Image
          alt={user.name}
          className={cn("size-9 shrink-0 rounded-full border border-border/50", {
            "opacity-60 grayscale": isBanned,
          })}
          height={36}
          src={user.avatar}
          width={36}
        />
      ) : (
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-tr text-sm font-medium text-white",
            user.colors,
          )}
        >
          {user.initials}
        </div>
      )}
      <div>
        <p
          className={cn("text-sm font-medium", {
            "text-foreground": !isBanned,
            "text-muted-foreground": isBanned,
          })}
        >
          {user.name}
        </p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>
    </div>
  )
}

export function UsersRoleCell({ row }: Readonly<CellContext<AdminUserRow, unknown>>): JSX.Element {
  const t = useTranslations("pages.admin.users")
  const { role } = row.original
  const label = isUserRole(role) ? t(`filters.role.options.${role}`) : role

  return <span className="text-sm text-muted-foreground">{label}</span>
}

export function UsersStatusCell({ row }: Readonly<CellContext<AdminUserRow, unknown>>): JSX.Element {
  const t = useTranslations("pages.admin.users")
  const { status, statusColor } = row.original
  const label = isUserStatus(status) ? t(`filters.status.options.${status}`) : status

  return (
    <Badge variant="outline" className={cn("px-2 py-1 text-xs font-medium", getStatusBadgeClass(statusColor))}>
      {label}
    </Badge>
  )
}

export function UsersLastActiveCell({ row }: Readonly<CellContext<AdminUserRow, unknown>>): JSX.Element {
  return <span className="text-sm text-muted-foreground">{row.original.lastActive}</span>
}
