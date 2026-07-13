"use client"
"use no memo"

import { useCallback, type JSX, type ReactNode } from "react"

import type { Header, RowData } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, Check, EllipsisVertical } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "~/src/lib/utils"

import { buttonVariants } from "~/src/components/shadcn/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/src/components/shadcn/dropdown-menu"

interface DataTableColumnHeaderProps<TData extends RowData, TValue> {
  readonly children: ReactNode
  readonly header: Header<TData, TValue>
}

export function DataTableColumnHeader<TData extends RowData, TValue>({
  children,
  header,
}: DataTableColumnHeaderProps<TData, TValue>): JSX.Element {
  const t = useTranslations("components.custom.data-table.columnHeader")
  const { column } = header
  const sorted = column.getIsSorted()

  const sortAscending = useCallback(() => {
    column.toggleSorting(false)
  }, [column])

  const sortDescending = useCallback(() => {
    column.toggleSorting(true)
  }, [column])

  const clearSorting = useCallback(() => {
    column.clearSorting()
  }, [column])

  if (!column.getCanSort()) {
    return <span className="truncate">{children}</span>
  }

  return (
    <div className="flex w-full min-w-0 items-center gap-1">
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {sorted === "asc" ? <ArrowUp aria-hidden className="size-3.5 shrink-0 text-primary" /> : undefined}
      {sorted === "desc" ? <ArrowDown aria-hidden className="size-3.5 shrink-0 text-primary" /> : undefined}
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={t("menu")}
          className={cn(
            buttonVariants({ size: "icon-xs", variant: "ghost" }),
            "size-6 shrink-0 text-muted-foreground opacity-70 transition-opacity group-hover/head:opacity-100 hover:bg-secondary/60 hover:text-foreground data-popup-open:bg-secondary/60 data-popup-open:opacity-100",
          )}
          type="button"
        >
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44" size="sm">
          <DropdownMenuItem onClick={sortAscending}>
            <ArrowUp />
            {t("sortAsc")}
            {sorted === "asc" ? <Check className="ml-auto size-3.5" /> : undefined}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={sortDescending}>
            <ArrowDown />
            {t("sortDesc")}
            {sorted === "desc" ? <Check className="ml-auto size-3.5" /> : undefined}
          </DropdownMenuItem>
          {sorted === false ? undefined : (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={clearSorting}>{t("clearSort")}</DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
