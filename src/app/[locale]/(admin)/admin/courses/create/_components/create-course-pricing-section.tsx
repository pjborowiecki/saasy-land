import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Card } from "~/src/components/shadcn/card"
import { Input } from "~/src/components/shadcn/input"
import { Label } from "~/src/components/shadcn/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/src/components/shadcn/select"
import { Tabs, TabsList, TabsTrigger } from "~/src/components/shadcn/tabs"

export async function CreateCoursePricingSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.courses.create")

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="mb-5 text-base font-medium text-foreground">{t("sections.pricing.title")}</h2>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="space-y-1.5">
          <Label>{t("sections.pricing.model.label")}</Label>
          <Tabs defaultValue="subscription" className="w-fit">
            <TabsList className="w-fit">
              <TabsTrigger value="onetime">{t("sections.pricing.model.oneTime")}</TabsTrigger>
              <TabsTrigger value="subscription">{t("sections.pricing.model.subscription")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="price">{t("sections.pricing.price.label")}</Label>
          <div className="relative">
            <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-muted-foreground">$</span>
            <Input id="price" type="number" placeholder={t("sections.pricing.price.placeholder")} className="pl-8" />
          </div>
        </div>
        <div className="flex-1 space-y-1.5">
          <Label>{t("sections.pricing.duration.label")}</Label>
          <Select defaultValue="lifetime">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lifetime">{t("sections.pricing.duration.lifetime")}</SelectItem>
              <SelectItem value="1year">1 Year Access</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  )
}
