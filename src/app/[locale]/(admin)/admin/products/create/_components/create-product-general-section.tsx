import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Card } from "~/src/components/shadcn/card"
import { Input } from "~/src/components/shadcn/input"
import { Label } from "~/src/components/shadcn/label"
import { Textarea } from "~/src/components/shadcn/textarea"

export async function CreateProductGeneralSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.products.create")

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="mb-5 text-base font-medium text-foreground">{t("sections.general.title")}</h2>
      <div className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="name">{t("sections.general.name.label")}</Label>
          <Input id="name" placeholder={t("sections.general.name.placeholder")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="description">{t("sections.general.description.label")}</Label>
          <Textarea
            id="description"
            rows={4}
            placeholder={t("sections.general.description.placeholder")}
            className="custom-scrollbar min-h-[120px] resize-none"
          />
          <p className="text-xs text-muted-foreground">{t("sections.general.description.help")}</p>
        </div>
      </div>
    </Card>
  )
}
