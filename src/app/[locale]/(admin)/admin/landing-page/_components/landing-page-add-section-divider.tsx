import type { JSX } from "react"

import { Plus } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/presentation/components/shadcn/button"

const ICON_STROKE_WIDTH = 1.5

/**
 * The insertion point between two sections. It used to be revealed on hover only, which put the
 * one control that adds a section out of reach of touch and keyboard entirely; it is a hairline
 * rule with the control sitting on it now, always present.
 */
export async function LandingPageAddSectionDivider(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.landing-page")

  return (
    <div className="relative flex items-center justify-center py-6">
      <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-border" />
      <Button className="relative gap-2">
        <Plus aria-hidden className="size-4" strokeWidth={ICON_STROKE_WIDTH} />
        {t("canvas.addSectionHere")}
      </Button>
    </div>
  )
}
