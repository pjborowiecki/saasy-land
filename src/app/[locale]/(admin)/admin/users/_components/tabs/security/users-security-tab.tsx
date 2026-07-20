import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { TabsContent } from "~/src/components/shadcn/tabs"

export async function UsersSecurityTab(): Promise<JSX.Element> {
  const t = await getTranslations("common")

  return (
    <TabsContent id="security" className="mt-6 outline-none">
      <p className="text-sm text-muted-foreground">{t("noDataToDisplay")}</p>
    </TabsContent>
  )
}
