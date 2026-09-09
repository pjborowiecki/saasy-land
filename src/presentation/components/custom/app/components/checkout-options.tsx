import type { JSX } from "react"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useTranslations } from "use-intl/react"

import { LICENSE_QUERY_KEYS, LICENSE_TIER } from "~/src/modules/license/license.constants"
import type { LicenseTier } from "~/src/modules/license/license.schema"
import { startCheckoutMutation } from "~/src/modules/license/use-cases/start-checkout"

import { useActionError } from "~/src/hooks/use-action-error"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/src/presentation/components/shadcn/card"
import { Spinner } from "~/src/presentation/components/shadcn/spinner"

import { LEGAL_TAGS } from "~/src/presentation/components/custom/app/constants/legal-tags"

const TIERS = [LICENSE_TIER.CORE, LICENSE_TIER.COMPLETE, LICENSE_TIER.AGENCY] satisfies LicenseTier[]

export const CheckoutOptions = (): JSX.Element => {
  const t = useTranslations("pages.license.buy")
  const queryClient = useQueryClient()
  const actionError = useActionError()
  const { isPending, mutate } = useMutation({
    ...startCheckoutMutation,
    onError: (error) => toast.error(actionError(error)),
    onSuccess: async ({ url }) => {
      await queryClient.invalidateQueries({ queryKey: LICENSE_QUERY_KEYS.ALL })
      globalThis.location.href = url
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{t("title")}</h2>
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          {TIERS.map((tier) => (
            <Button
              isDisabled={isPending}
              key={tier}
              onPress={() => {
                mutate({ tier })
              }}
              variant="outline"
            >
              {isPending && <Spinner />}
              {isPending ? t("pending") : t(tier)}
            </Button>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{t.rich("agreement", LEGAL_TAGS)}</p>
      </CardContent>
    </Card>
  )
}
