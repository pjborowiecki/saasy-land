import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

import { LICENSE_STATUS } from "~/src/modules/license/license.constants"
import type { License } from "~/src/modules/license/license.types"

import { LEGAL_TAGS } from "~/src/presentation/components/custom/app/constants"

import { ROUTES } from "~/src/routes"

const INSTALL_COMMAND = "npx saasyland@latest init"

interface LicensePanelProps {
  readonly license: License["select"]
}

export const LicensePanel = ({ license }: Readonly<LicensePanelProps>): JSX.Element => {
  const t = useTranslations("pages.license")

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold tracking-tight">{t(`tier.${license.tier}`)}</h2>
      {license.status === LICENSE_STATUS.REVOKED && <p className="text-destructive">{t("revoked")}</p>}
      <p className="text-sm text-muted-foreground">{t("issued")}</p>
      <code className="block rounded-md border border-border bg-muted px-4 py-3 font-mono text-sm break-all select-all">
        {license.key ?? t("pending")}
      </code>
      <p className="text-sm text-muted-foreground">{t("usage")}</p>
      <p className="text-sm text-muted-foreground">{t.rich("agreement", LEGAL_TAGS)}</p>
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
