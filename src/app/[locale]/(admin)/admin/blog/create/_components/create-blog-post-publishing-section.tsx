import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Card } from "~/src/presentation/components/shadcn/card"
import { Input } from "~/src/presentation/components/shadcn/input"
import { Label } from "~/src/presentation/components/shadcn/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/src/presentation/components/shadcn/select"
import { Textarea } from "~/src/presentation/components/shadcn/textarea"

export async function CreateBlogPostPublishingSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.blog.create")

  return (
    <Card className="border-border p-5 sm:p-6">
      <h3 className="mb-4 text-sm font-medium text-foreground">{t("settings.publishing")}</h3>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Select
            fieldLabel={t("settings.status")}
            fieldLabelClassName="font-mono text-label text-muted-foreground uppercase"
            defaultValue="draft"
          >
            <SelectTrigger className="w-full bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem id="draft">{t("settings.statusDraft")}</SelectItem>
              <SelectItem id="published">{t("settings.statusPublished")}</SelectItem>
              <SelectItem id="scheduled">{t("settings.statusScheduled")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Select
            fieldLabel={t("settings.category")}
            fieldLabelClassName="font-mono text-label text-muted-foreground uppercase"
            placeholder={t("settings.categorySelect")}
          >
            <SelectTrigger className="w-full bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem id="updates">{t("settings.categoryUpdates")}</SelectItem>
              <SelectItem id="tutorials">{t("settings.categoryTutorials")}</SelectItem>
              <SelectItem id="company">{t("settings.categoryCompany")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tags" className="font-mono text-label text-muted-foreground uppercase">
            {t("settings.tags")}
          </Label>
          <Input id="tags" placeholder={t("settings.tagsPlaceholder")} className="bg-card" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="excerpt" className="font-mono text-label text-muted-foreground uppercase">
            {t("settings.excerpt")}
          </Label>
          <Textarea
            id="excerpt"
            placeholder={t("settings.excerptPlaceholder")}
            className="custom-scrollbar min-h-[96px] resize-none bg-card"
          />
        </div>
      </div>
    </Card>
  )
}
