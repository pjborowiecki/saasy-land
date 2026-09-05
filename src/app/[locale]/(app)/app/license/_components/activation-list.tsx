import type { JSX } from "react"

import { getFormatter, getTranslations } from "next-intl/server"

import { fetchLicenseActivations } from "~/src/integrations/polar/polar.utils"

import { DeactivateButton } from "~/src/app/[locale]/(app)/app/license/_components/deactivate-button"

interface ActivationListProps {
  readonly licenseKeyId: string
}

export async function ActivationList({ licenseKeyId }: Readonly<ActivationListProps>): Promise<JSX.Element> {
  const t = await getTranslations("pages.license.activations")
  const format = await getFormatter()

  const { activations, limitActivations } = await fetchLicenseActivations(licenseKeyId)

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
                {t("activated", { date: format.dateTime(activation.createdAt, "short") })}
              </span>
            </span>
            <DeactivateButton activationId={activation.id} />
          </li>
        ))}
      </ul>
    </section>
  )
}
