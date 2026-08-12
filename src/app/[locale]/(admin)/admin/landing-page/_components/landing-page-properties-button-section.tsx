import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Input } from "~/src/presentation/components/shadcn/input"
import { Label } from "~/src/presentation/components/shadcn/label"

/**
 * A compact switch: a filled track and knob when the action is on, hairline when it is off.
 * The hit area is widened past the 20x36 mark with a pseudo-element so it clears 44x44.
 */
const SWITCH_CLASSNAME =
  "relative flex h-5 w-9 shrink-0 items-center justify-end border border-foreground bg-foreground p-0.5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 after:absolute after:-inset-x-1 after:-inset-y-3"

interface ButtonActionConfigProps {
  readonly defaultLabel: string
  readonly fieldId: string
  readonly title: string
}

async function ButtonActionConfig({ defaultLabel, fieldId, title }: ButtonActionConfigProps): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.landing-page")

  return (
    <div className="space-y-3 border border-border bg-background p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-foreground">{title}</span>
        <button aria-label={t("properties.buttonEnabled")} aria-pressed className={SWITCH_CLASSNAME} type="button">
          <span aria-hidden className="size-3 bg-primary-foreground" />
        </button>
      </div>
      <div className="space-y-2">
        <Label htmlFor={fieldId} className="text-xs font-medium text-muted-foreground">
          {t("properties.label")}
        </Label>
        <Input id={fieldId} defaultValue={defaultLabel} className="h-8 text-xs" />
      </div>
    </div>
  )
}

export async function LandingPagePropertiesButtonSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.landing-page")

  return (
    <div className="px-4 py-5">
      <h3 className="font-mono text-label text-muted-foreground uppercase">{t("properties.buttonActions")}</h3>
      <div className="mt-3 space-y-3">
        <ButtonActionConfig defaultLabel={t("canvas.getStarted")} fieldId="primary-button-label" title={t("properties.primaryButton")} />
        <ButtonActionConfig defaultLabel={t("canvas.bookDemo")} fieldId="secondary-button-label" title={t("properties.secondaryButton")} />
      </div>
    </div>
  )
}
