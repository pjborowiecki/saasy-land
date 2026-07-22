"use client"

import { type JSX, useCallback, useState } from "react"

import { type CellContext } from "@tanstack/react-table"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { banUser } from "~/src/modules/user/use-cases/ban-user.use-case"
import { deleteUser } from "~/src/modules/user/use-cases/delete-user.use-case"
import { unbanUser } from "~/src/modules/user/use-cases/unban-user.use-case"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/src/presentation/components/shadcn/alert-dialog"
import { DropdownMenuItem, DropdownMenuSeparator } from "~/src/presentation/components/shadcn/dropdown-menu"

import { DataTableRowActionsButton } from "~/src/presentation/components/custom/data-table/data-table"

import type { AdminUserRow } from "~/src/app/[locale]/(admin)/admin/_types"
import { UserResetPasswordDialog } from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/all-users/_components/user-reset-password-dialog"
import { useUserActionFeedback } from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/all-users/_lib/use-user-action-feedback"

export function UserRowActions(context: Readonly<CellContext<AdminUserRow, unknown>>): JSX.Element {
  const user = context.row.original
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)
  const { isPending, runUserAction } = useUserActionFeedback()
  const t = useTranslations("pages.admin.users")

  const handleBanToggle = useCallback(() => {
    if (user.isBanned === true) {
      runUserAction(() => unbanUser({ userId: user.id }), {
        errorMessage: t("actions.feedback.error"),
        successMessage: t("actions.feedback.unbanSuccess"),
      })
      return
    }

    runUserAction(() => banUser({ userId: user.id }), {
      errorMessage: t("actions.feedback.error"),
      successMessage: t("actions.feedback.banSuccess"),
    })
  }, [runUserAction, t, user.id, user.isBanned])

  const handleDelete = useCallback(() => {
    runUserAction(() => deleteUser({ userId: user.id }), {
      errorMessage: t("actions.feedback.error"),
      onSuccess: () => {
        setDeleteOpen(false)
      },
      successMessage: t("actions.feedback.deleteSuccess"),
    })
  }, [runUserAction, t, user.id])

  const openResetPassword = useCallback(() => {
    setResetPasswordOpen(true)
  }, [])

  const openDeleteDialog = useCallback(() => {
    setDeleteOpen(true)
  }, [])

  return (
    <>
      <DataTableRowActionsButton>
        <DropdownMenuItem>{t("actions.row.edit")}</DropdownMenuItem>
        <DropdownMenuItem>{t("actions.row.viewProfile")}</DropdownMenuItem>
        <DropdownMenuItem isDisabled={isPending} onPress={openResetPassword}>
          {t("actions.row.resetPassword")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem isDisabled={isPending} onPress={handleBanToggle}>
          {user.isBanned === true ? t("actions.row.unban") : t("actions.row.ban")}
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" isDisabled={isPending} onPress={openDeleteDialog}>
          {t("actions.row.delete")}
        </DropdownMenuItem>
      </DataTableRowActionsButton>

      <AlertDialog isOpen={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("actions.deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("actions.deleteDialog.description", { name: user.name })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("actions.deleteDialog.cancel")}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" isDisabled={isPending} onPress={handleDelete}>
              {isPending ? <Loader2 className="size-4 animate-spin" /> : t("actions.deleteDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UserResetPasswordDialog isOpen={resetPasswordOpen} onOpenChange={setResetPasswordOpen} userId={user.id} userName={user.name} />
    </>
  )
}
