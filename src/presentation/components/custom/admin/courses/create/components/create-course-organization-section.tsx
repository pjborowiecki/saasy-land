import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

import { Card } from "~/src/presentation/components/shadcn/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/src/presentation/components/shadcn/select"

export const CreateCourseOrganizationSection = (): JSX.Element => {
  const tCommon = useTranslations("pages.admin")

  const t = useTranslations("pages.admin.courses.create")

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
              <SelectItem id="dev">{tCommon("labels.development")}</SelectItem>
              <SelectItem id="design">{tCommon("labels.design")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-1.5">
          <Select fieldLabel={t("sections.organization.difficulty.label")} placeholder={t("sections.organization.difficulty.placeholder")}>
            <SelectTrigger className="w-full text-muted-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem id="beginner">{tCommon("labels.beginner")}</SelectItem>
              <SelectItem id="intermediate">{tCommon("labels.intermediate")}</SelectItem>
              <SelectItem id="advanced">{tCommon("labels.advanced")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  )
}
