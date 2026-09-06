import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

import { Card } from "~/src/presentation/components/shadcn/card"
import { Switch } from "~/src/presentation/components/shadcn/switch"

const StatusToggleRow = ({
  description,
  label,
  defaultChecked,
}: {
  readonly description: string
  readonly label: string
  readonly defaultChecked?: boolean
}): JSX.Element => (
  <div className="flex items-center justify-between">
    <div className="flex flex-col">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className="text-xs text-muted-foreground">{description}</span>
    </div>
    <Switch {...(defaultChecked === undefined ? {} : { defaultSelected: defaultChecked })} />
  </div>
)

export const CreateProductStatusSection = (): JSX.Element => {
  const t = useTranslations("pages.admin.products.create")

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="mb-4 text-base font-medium text-foreground">{t("sections.status.title")}</h2>
      <div className="space-y-4">
        <StatusToggleRow label={t("sections.status.publish.label")} description={t("sections.status.publish.description")} defaultChecked />
        <div className="h-px w-full bg-border/40" />
        <StatusToggleRow label={t("sections.status.requireLogin.label")} description={t("sections.status.requireLogin.description")} />
      </div>
    </Card>
  )
}
