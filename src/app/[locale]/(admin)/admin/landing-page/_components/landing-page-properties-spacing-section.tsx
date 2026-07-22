import type { JSX } from "react"

import { ArrowDown, ArrowUp } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Input } from "~/src/presentation/components/shadcn/input"
import { Label } from "~/src/presentation/components/shadcn/label"

function PaddingTopField({ label }: { readonly label: string }): JSX.Element {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1 text-[10px] text-muted-foreground">
        <ArrowUp className="size-3" />
        {label}
      </Label>
      <div className="relative">
        <Input type="number" defaultValue="120" className="pr-8 text-sm" />
        <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">px</span>
      </div>
    </div>
  )
}

function PaddingBottomField({ label }: { readonly label: string }): JSX.Element {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1 text-[10px] text-muted-foreground">
        <ArrowDown className="size-3" />
        {label}
      </Label>
      <div className="relative">
        <Input type="number" defaultValue="120" className="pr-8 text-sm" />
        <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">px</span>
      </div>
    </div>
  )
}

export async function LandingPagePropertiesSpacingSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.landing-page")

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{t("properties.spacing")}</h4>
      <div className="grid grid-cols-2 gap-3">
        <PaddingTopField label={t("properties.paddingTop")} />
        <PaddingBottomField label={t("properties.paddingBot")} />
      </div>
    </div>
  )
}
