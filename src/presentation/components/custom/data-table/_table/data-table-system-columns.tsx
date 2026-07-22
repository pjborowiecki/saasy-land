"use client"
"use no memo"

import type { JSX, ReactNode } from "react"

import type { CellContext, ColumnDef, HeaderContext, RowData } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "~/src/presentation/utils"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Checkbox } from "~/src/presentation/components/shadcn/checkbox"
import { DropdownMenu, DropdownMenuTrigger } from "~/src/presentation/components/shadcn/dropdown-menu"

import { DATA_TABLE } from "~/src/presentation/components/custom/data-table/_constants/data-table.constants"
import {
  DATA_TABLE_SELECT_COLUMN_DEF,
  getDataTableSelectCellCheckboxPropsFromContext,
  getDataTableSelectHeaderCheckboxPropsFromContext,
} from "~/src/presentation/components/custom/data-table/_table/data-table-select-column"

export const DATA_TABLE_ACTIONS_COLUMN_ID = "actions"

function DataTableSystemColumnInner({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
  return (
    <div className={DATA_TABLE.CLASSES.SYSTEM_COLUMN_INNER}>
      <div className="inline-flex shrink-0 items-center justify-center">{children}</div>
    </div>
  )
}

function DataTableSelectHeader<TData extends RowData>(context: Readonly<HeaderContext<TData, unknown>>): JSX.Element {
  return (
    <DataTableSystemColumnInner>
      <Checkbox {...getDataTableSelectHeaderCheckboxPropsFromContext(context)} />
    </DataTableSystemColumnInner>
  )
}

function DataTableSelectCell<TData extends RowData>(context: Readonly<CellContext<TData, unknown>>): JSX.Element {
  return (
    <DataTableSystemColumnInner>
      <Checkbox {...getDataTableSelectCellCheckboxPropsFromContext(context)} />
    </DataTableSystemColumnInner>
  )
}

function DataTableActionsColumnHeader(): JSX.Element {
  const t = useTranslations()

  return (
    <DataTableSystemColumnInner>
      <span className="sr-only">{t("components.custom.data-table.actions.header")}</span>
    </DataTableSystemColumnInner>
  )
}

export interface DataTableRowActionsButtonProps {
  children: ReactNode
}

/** Kebab trigger + menu. Pass `DropdownMenuItem`s (or separators) as children. */
export function DataTableRowActionsButton({ children }: Readonly<DataTableRowActionsButtonProps>): JSX.Element {
  const t = useTranslations()

  return (
    <DropdownMenuTrigger>
      <Button
        aria-label={t("components.custom.data-table.actions.rowButton")}
        className={cn("size-8 shrink-0 text-muted-foreground hover:bg-secondary hover:text-foreground")}
        data-slot="data-table-row-actions"
        size="icon"
        variant="ghost"
      >
        <MoreHorizontal />
      </Button>
      <DropdownMenu className="w-auto min-w-44" offset={4} placement="bottom end">
        {children}
      </DropdownMenu>
    </DropdownMenuTrigger>
  )
}

export function createDataTableSelectColumn<TData extends RowData>(): ColumnDef<TData> {
  return {
    ...DATA_TABLE_SELECT_COLUMN_DEF,
    cell: DataTableSelectCell,
    header: DataTableSelectHeader,
  }
}

export function createDataTableActionsColumn<TData extends RowData>(
  renderActions: (context: CellContext<TData, unknown>) => ReactNode,
): ColumnDef<TData> {
  return {
    cell: (context) => {
      const RenderActions = renderActions

      return (
        <DataTableSystemColumnInner>
          <RenderActions {...context} />
        </DataTableSystemColumnInner>
      )
    },
    enableHiding: false,
    enableResizing: false,
    enableSorting: false,
    header: DataTableActionsColumnHeader,
    id: DATA_TABLE_ACTIONS_COLUMN_ID,
    maxSize: DATA_TABLE.COLUMN.ACTIONS_SIZE,
    meta: { align: "center" },
    minSize: DATA_TABLE.COLUMN.ACTIONS_SIZE,
    size: DATA_TABLE.COLUMN.ACTIONS_SIZE,
  }
}
