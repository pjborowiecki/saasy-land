import type { JSX, ReactNode } from "react"

import { Wand2 } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Input } from "~/src/presentation/components/shadcn/input"
import { Label } from "~/src/presentation/components/shadcn/label"
import { Textarea } from "~/src/presentation/components/shadcn/textarea"

const ICON_STROKE_WIDTH = 1.5

interface ContentFieldProps {
  readonly children: ReactNode
  readonly htmlFor: string
  readonly label: string
}

function ContentField({ children, htmlFor, label }: ContentFieldProps): JSX.Element {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  )
}

export async function LandingPagePropertiesContentSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.landing-page")
  const heading = `${t("canvas.headingLead")} ${t("canvas.headingAccent")}`

  return (
    <div className="px-4 py-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-mono text-label text-muted-foreground uppercase">{t("properties.content")}</h3>
        <button
          className="-my-2 flex items-center gap-1.5 py-2 text-xs font-medium text-foreground transition-colors duration-200 ease-exp outline-none hover:text-foreground/80 focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none"
          type="button"
        >
          <Wand2 aria-hidden className="size-3.5 shrink-0" strokeWidth={ICON_STROKE_WIDTH} />
          {t("properties.generateAI")}
        </button>
      </div>

      <div className="mt-3 space-y-4">
        <ContentField htmlFor="section-badge" label={t("properties.badgeText")}>
          <Input id="section-badge" defaultValue={t("canvas.badge")} />
        </ContentField>
        <ContentField htmlFor="section-heading" label={t("properties.heading")}>
          <Textarea id="section-heading" defaultValue={heading} className="custom-scrollbar min-h-20 resize-none" />
        </ContentField>
        <ContentField htmlFor="section-subheading" label={t("properties.subheading")}>
          <Textarea id="section-subheading" defaultValue={t("canvas.description")} className="custom-scrollbar min-h-28 resize-none" />
        </ContentField>
      </div>
    </div>
  )
}
