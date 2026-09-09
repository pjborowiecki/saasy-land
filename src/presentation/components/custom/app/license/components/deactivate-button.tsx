import type { JSX } from "react"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useTranslations } from "use-intl/react"

import { LICENSE_QUERY_KEYS } from "~/src/modules/license/license.constants"
import { deactivateLicenseMutation } from "~/src/modules/license/use-cases/deactivate-license"

import { useActionError } from "~/src/hooks/use-action-error"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Spinner } from "~/src/presentation/components/shadcn/spinner"

interface DeactivateButtonProps {
  readonly activationId: string
}

export const DeactivateButton = ({ activationId }: Readonly<DeactivateButtonProps>): JSX.Element => {
  const t = useTranslations("pages.license.activations")
  const queryClient = useQueryClient()
  const actionError = useActionError()
  const { isPending, mutate } = useMutation({
    ...deactivateLicenseMutation,
    onError: (error) => toast.error(actionError(error)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: LICENSE_QUERY_KEYS.ALL })
      toast.success(t("success"))
    },
  })

  return (
    <Button
      isDisabled={isPending}
      onPress={() => {
        mutate({ activationId })
      }}
      size="sm"
      variant="outline"
    >
      {isPending && <Spinner />}
      {isPending ? t("deactivating") : t("deactivate")}
    </Button>
  )
}
