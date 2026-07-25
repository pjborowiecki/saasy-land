"use client"

import type { JSX } from "react"

import { useTranslations } from "next-intl"

import { Card, CardHeader, CardTitle } from "~/src/presentation/components/shadcn/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/src/presentation/components/shadcn/table"

const SKELETON_ROW_COUNT = 5

export function DashboardUsersTableSkeleton(): JSX.Element {
  const t = useTranslations("pages.admin.dashboard")

  return (
    <Card className="group relative flex flex-col overflow-hidden border-border/80 transition-colors hover:border-border/40">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 p-5">
        <div>
          <CardTitle className="mb-1 text-base font-medium text-foreground">{t("users.title")}</CardTitle>
          <p className="text-xs text-muted-foreground">{t("users.description")}</p>
        </div>
      </CardHeader>

      <div
        aria-hidden
        className="flex flex-col justify-between gap-4 border-b border-border/40 bg-secondary/20 p-4 sm:flex-row sm:items-center"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-48 animate-pulse rounded-md bg-muted/40" />
          <div className="h-8 w-20 animate-pulse rounded-md bg-muted/40" />
          <div className="h-8 w-20 animate-pulse rounded-md bg-muted/40" />
        </div>
        <div className="h-8 w-24 animate-pulse rounded-md bg-muted/40" />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12" />
            <TableHead>{t("users.table.columns.user")}</TableHead>
            <TableHead>{t("users.table.columns.role")}</TableHead>
            <TableHead>{t("users.table.columns.status")}</TableHead>
            <TableHead>{t("users.table.columns.lastActive")}</TableHead>
            <TableHead className="text-right">{t("users.table.columns.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
            <TableRow key={index}>
              <TableCell colSpan={6} className="h-12 animate-pulse bg-muted/40" />
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between border-t border-border/40 p-4">
        <div className="h-4 w-40 animate-pulse rounded-md bg-muted/40" />
        <div className="flex gap-2">
          <div className="h-7 w-16 animate-pulse rounded-md bg-muted/40" />
          <div className="h-7 w-24 animate-pulse rounded-md bg-muted/40" />
        </div>
      </div>
    </Card>
  )
}
