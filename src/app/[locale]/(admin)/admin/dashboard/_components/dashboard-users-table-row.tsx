import type { JSX } from "react"

import { PenLine, Trash2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "~/src/presentation/components/shadcn/avatar"
import { Badge } from "~/src/presentation/components/shadcn/badge"
import { Button } from "~/src/presentation/components/shadcn/button"
import { Checkbox } from "~/src/presentation/components/shadcn/checkbox"
import { TableCell, TableRow } from "~/src/presentation/components/shadcn/table"

import { AVATAR_INITIALS_LENGTH, AVATAR_INITIALS_START } from "~/src/app/[locale]/(admin)/admin/_lib/constants"
import { getDashboardStatusDotClass } from "~/src/app/[locale]/(admin)/admin/_lib/status-colors"
import type { DashboardUserRow } from "~/src/app/[locale]/(admin)/admin/_types"

interface DashboardUsersTableRowProps {
  readonly row: DashboardUserRow
}

export function DashboardUsersTableRow({ row }: DashboardUsersTableRowProps): JSX.Element {
  return (
    <TableRow className="group">
      <TableCell className="text-center">
        <Checkbox />
      </TableCell>
      <TableCell>
        <DashboardUsersTableUserCell row={row} />
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="font-medium text-muted-foreground">
          {row.role}
        </Badge>
      </TableCell>
      <TableCell>
        <DashboardUsersTableStatusCell status={row.status} />
      </TableCell>
      <TableCell>
        <span className="text-xs text-muted-foreground">{row.lastActive}</span>
      </TableCell>
      <TableCell className="text-right">
        <DashboardUsersTableActions />
      </TableCell>
    </TableRow>
  )
}

function DashboardUsersTableUserCell({ row }: DashboardUsersTableRowProps): JSX.Element {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-8 border border-border/50">
        <AvatarImage src={row.avatar} alt={row.name} />
        <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
          {row.initials ?? row.name.slice(AVATAR_INITIALS_START, AVATAR_INITIALS_LENGTH).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium text-foreground">{row.name}</p>
        <p className="text-xs text-muted-foreground">{row.email}</p>
      </div>
    </div>
  )
}

function DashboardUsersTableStatusCell({ status }: { readonly status: string }): JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <div className={`size-2 rounded-full ${getDashboardStatusDotClass(status)}`} />
      <span className="text-xs text-muted-foreground">{status}</span>
    </div>
  )
}

function DashboardUsersTableActions(): JSX.Element {
  return (
    <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
      <Button variant="ghost" size="icon" className="size-7">
        <PenLine className="size-4 text-muted-foreground" />
      </Button>
      <Button variant="ghost" size="icon" className="size-7 hover:bg-destructive/10 hover:text-destructive">
        <Trash2 className="size-4 text-muted-foreground" />
      </Button>
    </div>
  )
}
