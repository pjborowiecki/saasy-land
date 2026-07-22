import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Card } from "~/src/presentation/components/shadcn/card"
import { Input } from "~/src/presentation/components/shadcn/input"
import { Label } from "~/src/presentation/components/shadcn/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/src/presentation/components/shadcn/select"
import { Tabs, TabsList, TabsTrigger } from "~/src/presentation/components/shadcn/tabs"

export async function CreateProductPricingSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.products.create")

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="mb-5 text-base font-medium text-foreground">{t("sections.pricing.title")}</h2>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="space-y-1.5">
          <Label>{t("sections.pricing.model.label")}</Label>
          <Tabs defaultSelectedKey="subscription" className="w-fit">
            <TabsList className="w-fit">
              <TabsTrigger id="subscription">{t("sections.pricing.model.subscription")}</TabsTrigger>
              <TabsTrigger id="onetime">{t("sections.pricing.model.oneTime")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="price">{t("sections.pricing.price.label")}</Label>
          <div className="relative">
            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">$</span>
            <Input id="price" type="number" placeholder={t("sections.pricing.price.placeholder")} className="pl-7" />
          </div>
        </div>
        <div className="flex-1 space-y-1.5">
          <Label>{t("sections.pricing.period.label")}</Label>
          <Select defaultValue="monthly">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem id="monthly">{t("sections.pricing.period.monthly")}</SelectItem>
              <SelectItem id="yearly">{t("sections.pricing.period.yearly")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  )
}
