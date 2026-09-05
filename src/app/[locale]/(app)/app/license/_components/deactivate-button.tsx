"use client"

import { type JSX, useCallback, useTransition } from "react"

import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { deactivateLicense } from "~/src/modules/license/use-cases/deactivate-license.use-case"

import { useActionError } from "~/src/hooks/use-action-error"

import { Spinner } from "~/src/presentation/components/shadcn/spinner"

interface DeactivateButtonProps {
  readonly activationId: string
}

export function DeactivateButton({ activationId }: Readonly<DeactivateButtonProps>): JSX.Element {
  const [isPending, startTransition] = useTransition()

  const t = useTranslations("pages.license.activations")
  const actionError = useActionError()

  const free = useCallback((): void => {
    startTransition(async () => {
      const result = await deactivateLicense({ activationId })

      if (!result?.data) {
        toast.error(actionError(result) ?? t("error"))
        return
      }

      toast.success(t("success"))
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
