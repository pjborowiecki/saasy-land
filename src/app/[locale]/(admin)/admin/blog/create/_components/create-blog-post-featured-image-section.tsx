import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Card } from "~/src/components/shadcn/card"

import { AdminMediaUploadZone } from "~/src/app/[locale]/(admin)/admin/_components/admin-media-upload-zone"

export async function CreateBlogPostFeaturedImageSection(): Promise<JSX.Element> {
  const t = await getTranslations("admin.blog.create")

  return (
    <Card className="border-border/40 p-5 sm:p-6">
      <h3 className="mb-4 text-sm font-medium text-foreground">{t("settings.featuredImage")}</h3>
      <AdminMediaUploadZone uploadText={t("settings.upload")} helpText={t("settings.uploadHelp")} />
    </Card>
  )
}
