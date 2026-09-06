import type { JSX } from "react"

import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { Input } from "~/src/presentation/components/shadcn/input"
import { Label } from "~/src/presentation/components/shadcn/label"

const ICON_STROKE_WIDTH = 1.5

const DEFAULT_SECTION_PADDING = "120"

interface PaddingFieldProps {
  readonly icon: LucideIcon
  readonly id: string
  readonly label: string
  readonly unit: string
}

const PaddingField = ({ icon: Icon, id, label, unit }: PaddingFieldProps): JSX.Element => (
  <div className="space-y-2">
    <Label htmlFor={id} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <Icon aria-hidden className="size-3.5 shrink-0" strokeWidth={ICON_STROKE_WIDTH} />
      {label}
    </Label>
    <div className="relative">
      <Input id={id} type="number" defaultValue={DEFAULT_SECTION_PADDING} className="pr-9 text-sm tabular-nums" />
      <span aria-hidden className="absolute top-1/2 right-3 -translate-y-1/2 font-mono text-spec text-muted-foreground">
        {unit}
      </span>
    </div>
  </div>
)

export const LandingPagePropertiesSpacingSection = (): JSX.Element => {
  const t = useTranslations("pages.admin.landing-page")

  return (
    <div className="px-4 py-5">
      <h3 className="font-mono text-label text-muted-foreground uppercase">{t("properties.spacing")}</h3>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <PaddingField icon={ArrowUp} id="section-padding-top" label={t("properties.paddingTop")} unit={t("properties.unit")} />
        <PaddingField icon={ArrowDown} id="section-padding-bottom" label={t("properties.paddingBot")} unit={t("properties.unit")} />
      </div>
    </div>
  )
}
