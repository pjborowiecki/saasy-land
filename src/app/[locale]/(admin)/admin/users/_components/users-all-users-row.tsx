import Image from "next/image"
import type { JSX } from "react"

import { MoreHorizontal } from "lucide-react"

import { EMPTY_STRING_LENGTH } from "~/src/lib/admin/constants"
import type { AdminUserRow } from "~/src/lib/admin/demo-data.types"
import { getStatusBadgeClass } from "~/src/lib/admin/status-colors"

import { Badge } from "~/src/components/shadcn/badge"
import { Button } from "~/src/components/shadcn/button"

import { UsersTableCheckbox } from "~/src/app/[locale]/(admin)/admin/users/_components/users-table-checkbox"

interface UsersAllUsersRowProps {
  readonly user: AdminUserRow
}

export function UsersAllUsersRow({ user }: UsersAllUsersRowProps): JSX.Element {
  return (
    <tr className="group transition-colors hover:bg-secondary/20">
      <td className="p-4 text-center">
        <UsersTableCheckbox />
      </td>
      <td className="p-4">
        <UsersAllUsersUserCell user={user} />
      </td>
      <td className="p-4 text-sm text-muted-foreground">{user.role}</td>
      <td className="p-4">
        <Badge variant="outline" className={`px-2 py-1 text-xs font-medium ${getStatusBadgeClass(user.statusColor)}`}>
          {user.status}
        </Badge>
      </td>
      <td className="p-4 text-sm text-muted-foreground">{user.lastActive}</td>
      <td className="p-4 text-right">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-secondary hover:text-foreground focus:opacity-100"
          aria-label="Row actions"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </td>
    </tr>
  )
}

function UsersAllUsersUserCell({ user }: UsersAllUsersRowProps): JSX.Element {
  return (
    <div className="flex items-center gap-3">
      {user.avatar !== undefined && user.avatar.length > EMPTY_STRING_LENGTH ? (
        <Image
          src={user.avatar}
          alt={user.name}
          width={36}
          height={36}
          className={`size-9 shrink-0 rounded-full border border-border/50 ${user.isBanned === true ? "opacity-60 grayscale" : ""}`}
        />
      ) : (
        <div
          className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr text-sm font-medium text-white ${user.colors ?? ""}`}
        >
          {user.initials}
        </div>
      )}
      <div>
        <p className={`text-sm font-medium ${user.isBanned === true ? "text-muted-foreground" : "text-foreground"}`}>{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>
    </div>
  )
}
