import type { JSX } from "react"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useFormatter, useTranslations } from "use-intl/react"

import { licenseActivationsQuery } from "~/src/modules/license/use-cases/get-current-license"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/src/presentation/components/shadcn/card"

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
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{t("title")}</h2>
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-xs text-muted-foreground">{usage}</p>
        {activations.length === 0 && <p className="text-sm text-muted-foreground">{t("none")}</p>}
        <ul className="flex flex-col divide-y divide-border empty:hidden">
          {activations.map((activation) => (
            <li className="flex flex-wrap items-center justify-between gap-4 py-3 first:pt-0 last:pb-0" key={activation.id}>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-sm font-medium wrap-anywhere text-foreground">{activation.label}</span>
                <span className="text-xs text-muted-foreground">
                  {t("activated", { date: format.dateTime(activation.createdAt, { dateStyle: "short", timeStyle: "short" }) })}
                </span>
              </span>
              <DeactivateButton activationId={activation.id} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
