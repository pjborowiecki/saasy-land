"use client"

import { type JSX, type MouseEvent, useCallback, useTransition } from "react"

import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { LICENSE_TIER } from "~/src/modules/license/license.constants"
import type { LicenseTier } from "~/src/modules/license/license.schema"
import { startCheckout } from "~/src/modules/license/use-cases/start-checkout.use-case"

import { useActionError } from "~/src/hooks/use-action-error"

import { Spinner } from "~/src/presentation/components/shadcn/spinner"

const TIERS = [LICENSE_TIER.CORE, LICENSE_TIER.COMPLETE] satisfies LicenseTier[]

export function CheckoutOptions(): JSX.Element {
  const [isPending, startTransition] = useTransition()

  const t = useTranslations("pages.license.buy")
  const actionError = useActionError()

  const buy = useCallback(
    (event: MouseEvent<HTMLButtonElement>): void => {
      const tier = TIERS.find((candidate) => candidate === event.currentTarget.value)

      if (tier === undefined) {
        return
      }

      startTransition(async () => {
        const result = await startCheckout({ tier })

        if (!result?.data) {
          toast.error(actionError(result) ?? t("error"))
          return
        }

        globalThis.location.href = result.data.url
      })
    },
    [actionError, t],
  )

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold tracking-tight">{t("title")}</h2>
      <p className="text-muted-foreground">{t("description")}</p>
      <div className="flex flex-wrap gap-3">
        {TIERS.map((tier) => (
          <button
            className="inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-semibold text-background transition-opacity duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50"
            disabled={isPending}
            key={tier}
            onClick={buy}
            type="button"
            value={tier}
          >
            {isPending && <Spinner />}
            {isPending ? t("pending") : t(tier)}
          </button>
        ))}
      </div>
    </section>
  )
}
