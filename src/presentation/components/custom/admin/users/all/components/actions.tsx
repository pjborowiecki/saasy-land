import { type JSX, useCallback, useState, useTransition } from "react"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import type { CellContext } from "@tanstack/react-table"
import { EllipsisVertical, Loader2, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "use-intl/react"

import { banUserMutation } from "~/src/modules/user/use-cases/ban-user"
import { deleteUserMutation } from "~/src/modules/user/use-cases/delete-user"
import { unbanUserMutation } from "~/src/modules/user/use-cases/unban-user"
import { USER_QUERY_KEYS } from "~/src/modules/user/user.constants"
import type { User } from "~/src/modules/user/user.types"

import { useActionError } from "~/src/hooks/use-action-error"

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

import { UserResetPasswordDialog } from "~/src/presentation/components/custom/admin/users/all/components/user-reset-password-dialog"
import type { DataTableFeatures } from "~/src/presentation/components/custom/data-table/features"

export const AddUserButton = (): JSX.Element => {
  const t = useTranslations("pages.admin.users")

  return (
    <Button size="sm" className="h-10 gap-2 whitespace-nowrap">
      <UserPlus className="size-4" />
      {t("actions.addUser")}
    </Button>
  )
}

export const UserRowActions = ({ row }: Readonly<CellContext<DataTableFeatures, User["select"]>>): JSX.Element => {
  const queryClient = useQueryClient()
  const unbanUserRequest = useMutation({
    ...unbanUserMutation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.ALL }),
  })
  const banUserRequest = useMutation({
    ...banUserMutation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.ALL }),
  })
  const deleteUserRequest = useMutation({
    ...deleteUserMutation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.ALL }),
  })
  const [isPending, startTransition] = useTransition()

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)

  const router = useRouter()
  const t = useTranslations("pages.admin.users")
  const actionError = useActionError()

  const user = row.original

  const openResetPassword = useCallback(() => {
    setResetPasswordOpen(true)
  }, [])

  const openDelete = useCallback(() => {
    setDeleteOpen(true)
  }, [])

  const handleBanToggle = useCallback(() => {
    startTransition(async () => {
      try {
        const mutation = user.banned ? unbanUserRequest : banUserRequest
        await mutation.mutateAsync({ userId: user.id })
        toast.success(user.banned ? t("actions.feedback.unbanSuccess") : t("actions.feedback.banSuccess"))
        void router.invalidate()
      } catch (error) {
        toast.error(actionError(error))
      }
    })
  }, [actionError, router, t, user.banned, user.id])

  const handleDelete = useCallback(() => {
    startTransition(async () => {
      try {
        await deleteUserRequest.mutateAsync({ userId: user.id })
        toast.success(t("actions.feedback.deleteSuccess"))
        setDeleteOpen(false)
        void router.invalidate()
      } catch (error) {
        toast.error(actionError(error))
      }
    })
  }, [actionError, router, t, user.id])

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
