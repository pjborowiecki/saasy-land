import type { JSX } from "react"

import { PlusCircle } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/components/shadcn/button"

export async function LandingPageAddSectionDivider(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.landing-page")

  return (
    <div className="flex items-center justify-center py-2 opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-100">
      <Button className="h-8 gap-2 rounded-full bg-fuchsia-500 px-4 text-xs shadow-lg hover:bg-fuchsia-600">
        <PlusCircle className="size-3.5" />
        {t("canvas.addSectionHere")}
      </Button>
    </div>
  )
}
