import type { JSX } from "react"

import { Eye, Wand2 } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Input } from "~/src/components/shadcn/input"
import { Label } from "~/src/components/shadcn/label"
import { Textarea } from "~/src/components/shadcn/textarea"

interface ContentFieldProps {
  readonly children: JSX.Element
  readonly label: string
}

function ContentField({ children, label }: ContentFieldProps): JSX.Element {
  return (
    <div className="space-y-2">
      <Label className="flex justify-between text-xs text-muted-foreground">
        {label}
        <Eye className="size-3 cursor-pointer text-muted-foreground" />
      </Label>
      {children}
    </div>
  )
}

export async function LandingPagePropertiesContentSection(): Promise<JSX.Element> {
  const t = await getTranslations("admin.landingPage")

  return (
    <div className="space-y-4 border-t border-border/40 pt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{t("properties.content")}</h4>
        <button type="button" className="flex items-center gap-1 text-[10px] font-medium text-fuchsia-500 hover:text-fuchsia-600">
          <Wand2 className="size-3" />
          {t("properties.generateAI")}
        </button>
      </div>
      <ContentField label={t("properties.badgeText")}>
        <Input defaultValue="New v2.0 Release" />
      </ContentField>
      <ContentField label={t("properties.heading")}>
        <Textarea defaultValue="Supercharge Your SaaS Growth" className="custom-scrollbar min-h-20 resize-none" />
      </ContentField>
      <ContentField label={t("properties.subheading")}>
        <Textarea
          defaultValue="The all-in-one platform to manage your customers, billing, and content. Build faster, convert better."
          className="custom-scrollbar min-h-24 resize-none"
        />
      </ContentField>
    </div>
  )
}
