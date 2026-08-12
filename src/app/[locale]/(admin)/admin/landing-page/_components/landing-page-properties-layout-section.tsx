import type { JSX } from "react"

import { AlignCenter, AlignLeft, AlignRight, type LucideIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { cn } from "~/src/utils"

const ICON_STROKE_WIDTH = 1.5

const ALIGN_BUTTON_BASE =
  "flex h-9 flex-1 items-center justify-center rounded-none transition-[color,background-color] duration-200 ease-exp outline-none focus-visible:relative focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none"

interface AlignButtonProps {
  readonly icon: LucideIcon
  readonly isActive: boolean
  readonly label: string
}

function AlignButton({ icon: Icon, isActive, label }: AlignButtonProps): JSX.Element {
  return (
    <button
      aria-label={label}
      aria-pressed={isActive}
      className={cn(ALIGN_BUTTON_BASE, isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}
      type="button"
    >
      <Icon aria-hidden className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
    </button>
  )
}

export async function LandingPagePropertiesLayoutSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.landing-page")

  return (
    <div className="px-4 py-5">
      <h3 className="font-mono text-label text-muted-foreground uppercase">{t("properties.layout")}</h3>
      <div className="mt-3 flex divide-x divide-border rounded-lg border border-border">
        <AlignButton icon={AlignLeft} isActive={false} label={t("properties.alignLeft")} />
        <AlignButton icon={AlignCenter} isActive label={t("properties.alignCenter")} />
        <AlignButton icon={AlignRight} isActive={false} label={t("properties.alignRight")} />
      </div>
    </div>
  )
}
