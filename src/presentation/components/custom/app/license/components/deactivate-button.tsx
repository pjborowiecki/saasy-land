import { type JSX, useCallback, useTransition } from "react"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useTranslations } from "use-intl/react"

import { deactivateLicenseMutation } from "~/src/modules/license/use-cases/deactivate-license"

import { useActionError } from "~/src/hooks/use-action-error"

import { Spinner } from "~/src/presentation/components/shadcn/spinner"

interface DeactivateButtonProps {
  readonly activationId: string
}

export const DeactivateButton = ({ activationId }: Readonly<DeactivateButtonProps>): JSX.Element => {
  const queryClient = useQueryClient()
  const deactivateLicenseRequest = useMutation({
    ...deactivateLicenseMutation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["license"] }),
  })
  const [isPending, startTransition] = useTransition()

  const t = useTranslations("pages.license.activations")
  const actionError = useActionError()

  const free = useCallback((): void => {
    startTransition(async () => {
      try {
        await deactivateLicenseRequest.mutateAsync({ activationId })
        toast.success(t("success"))
      } catch (error) {
        toast.error(actionError(error))
      }
    })
  }, [actionError, activationId, t])

  return (
    <button
      className="inline-flex h-8 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50"
      disabled={isPending}
      onClick={free}
      type="button"
    >
      {isPending && <Spinner />}
      {isPending ? t("deactivating") : t("deactivate")}
    </button>
  )
}
