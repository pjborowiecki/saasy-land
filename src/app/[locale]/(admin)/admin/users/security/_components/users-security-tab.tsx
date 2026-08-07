import type { JSX } from "react"

import { useTranslations } from "next-intl"

export function UsersSecurityTab(): JSX.Element {
  const t = useTranslations("common")

  return (
    <div className="mt-6 outline-none">
      <p className="text-sm text-muted-foreground">{t("noDataToDisplay")}</p>
    </div>
  )
}
