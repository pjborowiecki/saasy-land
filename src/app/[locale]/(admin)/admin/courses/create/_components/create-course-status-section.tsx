import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Card } from "~/src/components/shadcn/card"
import { Switch } from "~/src/components/shadcn/switch"

function StatusToggleRow({
  description,
  label,
  defaultChecked,
}: {
  readonly description: string
  readonly label: string
  readonly defaultChecked?: boolean
}): JSX.Element {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  )
}

export async function CreateCourseStatusSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.courses.create")

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="mb-4 text-base font-medium text-foreground">{t("sections.status.title")}</h2>
      <div className="space-y-4">
        <StatusToggleRow label={t("sections.status.publish.label")} description={t("sections.status.publish.description")} defaultChecked />
        <div className="h-px w-full bg-border/40" />
        <StatusToggleRow label={t("sections.status.certificate.label")} description={t("sections.status.certificate.description")} />
      </div>
    </Card>
  )
}
