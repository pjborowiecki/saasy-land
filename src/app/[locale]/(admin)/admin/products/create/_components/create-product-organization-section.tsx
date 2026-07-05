import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Card } from "~/src/components/shadcn/card"
import { Label } from "~/src/components/shadcn/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/src/components/shadcn/select"

export async function CreateProductOrganizationSection(): Promise<JSX.Element> {
  const t = await getTranslations("admin.products.create")

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="mb-4 text-base font-medium text-foreground">{t("sections.organization.title")}</h2>
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="flex-1 space-y-1.5">
          <Label>{t("sections.organization.category.label")}</Label>
          <Select>
            <SelectTrigger className="w-full text-muted-foreground">
              <SelectValue placeholder={t("sections.organization.category.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="saas">SaaS Plans</SelectItem>
              <SelectItem value="addons">Add-ons</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-1.5">
          <Label>{t("sections.organization.collection.label")}</Label>
          <Select>
            <SelectTrigger className="w-full text-muted-foreground">
              <SelectValue placeholder={t("sections.organization.collection.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="core">Core Subscription</SelectItem>
              <SelectItem value="legacy">Legacy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  )
}
