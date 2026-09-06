import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

import { Card } from "~/src/presentation/components/shadcn/card"

import { AdminMediaUploadZone } from "~/src/presentation/components/custom/admin/components/admin-media-upload-zone"

export const CreateBlogPostFeaturedImageSection = (): JSX.Element => {
  const t = useTranslations("pages.admin.blog.create")

  return (
    <Card className="border-border p-5 sm:p-6">
      <h3 className="mb-4 text-sm font-medium text-foreground">{t("settings.featuredImage")}</h3>
      <AdminMediaUploadZone uploadText={t("settings.upload")} helpText={t("settings.uploadHelp")} />
    </Card>
  )
}
