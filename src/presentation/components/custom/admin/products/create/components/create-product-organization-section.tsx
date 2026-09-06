import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

import { Card } from "~/src/presentation/components/shadcn/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/src/presentation/components/shadcn/select"

export const CreateProductOrganizationSection = (): JSX.Element => {
  const tCommon = useTranslations("pages.admin")

  const t = useTranslations("pages.admin.products.create")

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
              <SelectItem id="saas">{tCommon("labels.saasPlans")}</SelectItem>
              <SelectItem id="addons">{tCommon("labels.addOns")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-1.5">
          <Select fieldLabel={t("sections.organization.collection.label")} placeholder={t("sections.organization.collection.placeholder")}>
            <SelectTrigger className="w-full text-muted-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem id="core">{tCommon("labels.coreSubscription")}</SelectItem>
              <SelectItem id="legacy">{tCommon("labels.legacy")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  )
}
