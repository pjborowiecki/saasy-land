import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { LICENSE_STATUS } from "~/src/modules/license/license.constants"
import type { License } from "~/src/modules/license/license.types"

import { ROUTES } from "~/src/routes"

const INSTALL_COMMAND = "npx saasyland@latest init"

interface LicensePanelProps {
  readonly license: License["select"]
}

export async function LicensePanel({ license }: Readonly<LicensePanelProps>): Promise<JSX.Element> {
  const t = await getTranslations("pages.license")

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold tracking-tight">{t(`tier.${license.tier}`)}</h2>
      {license.status === LICENSE_STATUS.REVOKED && <p className="text-destructive">{t("revoked")}</p>}
      <p className="text-sm text-muted-foreground">{t("issued")}</p>
      <code className="block rounded-md border border-border bg-muted px-4 py-3 font-mono text-sm break-all select-all">
        {license.key ?? t("pending")}
      </code>
      <p className="text-sm text-muted-foreground">{t("usage")}</p>
      <code className="block rounded-md border border-border bg-muted px-4 py-3 font-mono text-sm select-all">{INSTALL_COMMAND}</code>
      <a
        className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors duration-200 hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        href={ROUTES.API_AUTH_CUSTOMER_PORTAL}
      >
        {t("manage")}
      </a>
    </section>
  )
}
