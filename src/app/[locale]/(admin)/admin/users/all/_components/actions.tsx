"use client"

import { useCallback, useState, useTransition, type JSX } from "react"

import type { CellContext } from "@tanstack/react-table"
import { EllipsisVertical, Loader2, UserPlus } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { banUser } from "~/src/modules/user/use-cases/ban-user.use-case"
import { deleteUser } from "~/src/modules/user/use-cases/delete-user.use-case"
import { unbanUser } from "~/src/modules/user/use-cases/unban-user.use-case"
import type { User } from "~/src/modules/user/user.types"

import { useRouter } from "~/src/integrations/next-intl/i18n.navigation"

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
import { Button } from "~/src/presentation/components/shadcn/button"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/src/presentation/components/shadcn/dropdown-menu"

import type { DataTableFeatures } from "~/src/presentation/components/custom/data-table/features"

import { UserResetPasswordDialog } from "~/src/app/[locale]/(admin)/admin/users/all/_components/user-reset-password-dialog"

export function AddUserButton(): JSX.Element {
  const t = useTranslations("pages.admin.users")

  return (
    <Button size="sm" className="h-10 gap-2 whitespace-nowrap">
      <UserPlus className="size-4" />
      {t("actions.addUser")}
    </Button>
  )
}

export function UserRowActions({ row }: Readonly<CellContext<DataTableFeatures, User["select"]>>): JSX.Element {
  const [isPending, startTransition] = useTransition()

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)

  const router = useRouter()
  const t = useTranslations("pages.admin.users")

  const user = row.original

  const openResetPassword = useCallback(() => {
    setResetPasswordOpen(true)
  }, [])

  const openDelete = useCallback(() => {
    setDeleteOpen(true)
  }, [])

  const handleBanToggle = useCallback(() => {
    startTransition(async () => {
      const result = user.banned ? await unbanUser({ userId: user.id }) : await banUser({ userId: user.id })
      if (result.serverError !== undefined) {
        toast.error(result.serverError.message ?? t("actions.feedback.error"))
        return
      }
      toast.success(user.banned ? t("actions.feedback.unbanSuccess") : t("actions.feedback.banSuccess"))
      router.refresh()
    })
  }, [router, t, user.banned, user.id])

  const handleDelete = useCallback(() => {
    startTransition(async () => {
      const result = await deleteUser({ userId: user.id })
      if (result.serverError !== undefined) {
        toast.error(result.serverError.message ?? t("actions.feedback.error"))
        return
      }
      toast.success(t("actions.feedback.deleteSuccess"))
      setDeleteOpen(false)
      router.refresh()
    })
  }, [router, t, user.id])

  return (
    <>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon" className="size-8" aria-label={t("actions.row.menu")}>
          <EllipsisVertical className="size-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuItem>{t("actions.row.edit")}</DropdownMenuItem>
          <DropdownMenuItem>{t("actions.row.viewProfile")}</DropdownMenuItem>
          <DropdownMenuItem isDisabled={isPending} onAction={openResetPassword}>
            {t("actions.row.resetPassword")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem isDisabled={isPending} onAction={handleBanToggle}>
            {user.banned ? t("actions.row.unban") : t("actions.row.ban")}
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" isDisabled={isPending} onAction={openDelete}>
            {t("actions.row.delete")}
          </DropdownMenuItem>
        </DropdownMenu>
      </DropdownMenuTrigger>

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
