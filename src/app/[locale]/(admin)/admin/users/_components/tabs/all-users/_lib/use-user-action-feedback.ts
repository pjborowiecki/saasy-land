"use client"

import { useCallback, useTransition } from "react"

import { toast } from "sonner"

import type { banUser } from "~/src/modules/user/use-cases/ban-user.use-case"
import type { deleteUser } from "~/src/modules/user/use-cases/delete-user.use-case"
import type { setUserPassword } from "~/src/modules/user/use-cases/set-user-password.use-case"
import type { unbanUser } from "~/src/modules/user/use-cases/unban-user.use-case"

import { useRouter } from "~/src/integrations/next-intl/i18n.navigation"

type UserAdminActionResult =
  | Awaited<ReturnType<typeof banUser>>
  | Awaited<ReturnType<typeof deleteUser>>
  | Awaited<ReturnType<typeof setUserPassword>>
  | Awaited<ReturnType<typeof unbanUser>>

interface RunUserActionOptions {
  readonly errorMessage: string
  readonly onSuccess?: () => void
  readonly successMessage: string
}

export function useUserActionFeedback() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const runUserAction = useCallback(
    (action: () => Promise<UserAdminActionResult>, options: RunUserActionOptions) => {
      startTransition(async () => {
        const result = await action()

        if (result.serverError !== undefined) {
          toast.error(result.serverError.message ?? options.errorMessage)
          return
        }

        toast.success(options.successMessage)
        options.onSuccess?.()
        router.refresh()
      })
    },
    [router],
  )

  return { isPending, runUserAction }
}
