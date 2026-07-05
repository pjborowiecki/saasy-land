import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Input } from "~/src/components/shadcn/input"
import { Label } from "~/src/components/shadcn/label"

interface ButtonActionConfigProps {
  readonly defaultLabel: string
  readonly title: string
}

async function ButtonActionConfig({ defaultLabel, title }: ButtonActionConfigProps): Promise<JSX.Element> {
  const t = await getTranslations("admin.landingPage")

  return (
    <div className="space-y-3 rounded-lg border border-border/40 bg-secondary/10 p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">{title}</span>
        <div className="relative h-4 w-8 cursor-pointer rounded-full bg-fuchsia-500">
          <div className="absolute top-0.5 right-1 size-3 rounded-full bg-white" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-[10px] text-muted-foreground">{t("properties.label")}</Label>
        <Input defaultValue={defaultLabel} className="h-8 text-xs" />
      </div>
    </div>
  )
}

export async function LandingPagePropertiesButtonSection(): Promise<JSX.Element> {
  const t = await getTranslations("admin.landingPage")

  return (
    <div className="space-y-4 border-t border-border/40 pt-4">
      <h4 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{t("properties.buttonActions")}</h4>
      <ButtonActionConfig defaultLabel="Get Started Free" title={t("properties.primaryButton")} />
      <ButtonActionConfig defaultLabel="Book a Demo" title={t("properties.secondaryButton")} />
    </div>
  )
}
