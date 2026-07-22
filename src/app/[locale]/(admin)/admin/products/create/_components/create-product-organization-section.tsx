import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Card } from "~/src/presentation/components/shadcn/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/src/presentation/components/shadcn/select"

export async function CreateProductOrganizationSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.products.create")

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="mb-4 text-base font-medium text-foreground">{t("sections.organization.title")}</h2>
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="flex-1 space-y-1.5">
          <Select fieldLabel={t("sections.organization.category.label")} placeholder={t("sections.organization.category.placeholder")}>
            <SelectTrigger className="w-full text-muted-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem id="saas">SaaS Plans</SelectItem>
              <SelectItem id="addons">Add-ons</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-1.5">
          <Select fieldLabel={t("sections.organization.collection.label")} placeholder={t("sections.organization.collection.placeholder")}>
            <SelectTrigger className="w-full text-muted-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem id="core">Core Subscription</SelectItem>
              <SelectItem id="legacy">Legacy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  )
}
