import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Card } from "~/src/components/shadcn/card"
import { Label } from "~/src/components/shadcn/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/src/components/shadcn/select"

export async function CreateCourseOrganizationSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.courses.create")

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="mb-4 text-base font-medium text-foreground">{t("sections.organization.title")}</h2>
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="flex-1 space-y-1.5">
          <Label>{t("sections.organization.category.label")}</Label>
          <Select placeholder={t("sections.organization.category.placeholder")}>
            <SelectTrigger className="w-full text-muted-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem id="dev">Development</SelectItem>
              <SelectItem id="design">Design</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-1.5">
          <Label>{t("sections.organization.difficulty.label")}</Label>
          <Select placeholder={t("sections.organization.difficulty.placeholder")}>
            <SelectTrigger className="w-full text-muted-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem id="beginner">Beginner</SelectItem>
              <SelectItem id="intermediate">Intermediate</SelectItem>
              <SelectItem id="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  )
}
