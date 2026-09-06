import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

export const UsersSecurityTab = (): JSX.Element => {
  const t = useTranslations("common")

  return (
    <div className="mt-6 outline-none">
      <p className="text-sm text-muted-foreground">{t("noDataToDisplay")}</p>
    </div>
  )
}
