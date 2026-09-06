import type { JSX } from "react"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useFormatter, useTranslations } from "use-intl/react"

import { licenseActivationsQuery } from "~/src/modules/license/use-cases/get-current-license"

import { DeactivateButton } from "~/src/presentation/components/custom/app/license/components/deactivate-button"

export const ActivationList = (): JSX.Element => {
  const t = useTranslations("pages.license.activations")
  const format = useFormatter()

  const { activations, limitActivations } = useSuspenseQuery(licenseActivationsQuery).data

  const usage =
    limitActivations === null
      ? t("unlimited", { used: activations.length })
      : t("count", { limit: limitActivations, used: activations.length })

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold tracking-tight">{t("title")}</h2>
      <p className="text-sm text-muted-foreground">{t("description")}</p>
      <p className="font-mono text-xs text-muted-foreground">{usage}</p>
      {activations.length === 0 && <p className="text-sm text-muted-foreground">{t("none")}</p>}
      <ul className="flex flex-col divide-y divide-border empty:hidden">
        {activations.map((activation) => (
          <li className="flex items-center justify-between gap-4 py-3" key={activation.id}>
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">{activation.label}</span>
              <span className="font-mono text-xs text-muted-foreground">
                {t("activated", { date: format.dateTime(activation.createdAt, { dateStyle: "short", timeStyle: "short" }) })}
              </span>
            </span>
            <DeactivateButton activationId={activation.id} />
          </li>
        ))}
      </ul>
    </section>
  )
}
