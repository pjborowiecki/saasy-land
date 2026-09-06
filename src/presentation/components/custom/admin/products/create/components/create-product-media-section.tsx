import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

import { Card } from "~/src/presentation/components/shadcn/card"

import { AdminMediaUploadZone } from "~/src/presentation/components/custom/admin/components/admin-media-upload-zone"

export const CreateProductMediaSection = (): JSX.Element => {
  const t = useTranslations("pages.admin.products.create")

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="mb-5 text-base font-medium text-foreground">{t("sections.media.title")}</h2>
      <AdminMediaUploadZone uploadText={t("sections.media.upload")} helpText={t("sections.media.help")} />
    </Card>
  )
}
