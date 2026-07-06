import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Card } from "~/src/components/shadcn/card"

import { AdminMediaUploadZone } from "~/src/app/[locale]/(admin)/admin/_components/admin-media-upload-zone"

export async function CreateCourseMediaSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.courses.create")

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="mb-5 text-base font-medium text-foreground">{t("sections.media.title")}</h2>
      <AdminMediaUploadZone uploadText={t("sections.media.upload")} helpText={t("sections.media.help")} />
    </Card>
  )
}
