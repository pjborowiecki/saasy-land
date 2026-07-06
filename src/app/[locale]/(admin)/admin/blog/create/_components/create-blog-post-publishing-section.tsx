import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Card } from "~/src/components/shadcn/card"
import { Input } from "~/src/components/shadcn/input"
import { Label } from "~/src/components/shadcn/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/src/components/shadcn/select"
import { Textarea } from "~/src/components/shadcn/textarea"

export async function CreateBlogPostPublishingSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.blog.create")

  return (
    <Card className="border-border/40 p-5 sm:p-6">
      <h3 className="mb-4 text-sm font-medium text-foreground">{t("settings.publishing")}</h3>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs tracking-wider text-muted-foreground uppercase">{t("settings.status")}</Label>
          <Select defaultValue="draft">
            <SelectTrigger className="w-full bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">{t("settings.statusDraft")}</SelectItem>
              <SelectItem value="published">{t("settings.statusPublished")}</SelectItem>
              <SelectItem value="scheduled">{t("settings.statusScheduled")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs tracking-wider text-muted-foreground uppercase">{t("settings.category")}</Label>
          <Select>
            <SelectTrigger className="w-full bg-card">
              <SelectValue placeholder={t("settings.categorySelect")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updates">{t("settings.categoryUpdates")}</SelectItem>
              <SelectItem value="tutorials">{t("settings.categoryTutorials")}</SelectItem>
              <SelectItem value="company">{t("settings.categoryCompany")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tags" className="text-xs tracking-wider text-muted-foreground uppercase">
            {t("settings.tags")}
          </Label>
          <Input id="tags" placeholder={t("settings.tagsPlaceholder")} className="bg-card" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="excerpt" className="text-xs tracking-wider text-muted-foreground uppercase">
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
