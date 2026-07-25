import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

export async function UsersSecurityTab(): Promise<JSX.Element> {
  const t = await getTranslations("common")

  return (
    <div className="mt-6 outline-none">
      <p className="text-sm text-muted-foreground">{t("noDataToDisplay")}</p>
    </div>
  )
}
