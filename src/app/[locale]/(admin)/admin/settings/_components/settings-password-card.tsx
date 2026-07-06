import type { JSX } from "react"

import { Check, X } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/components/shadcn/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/src/components/shadcn/card"
import { Input } from "~/src/components/shadcn/input"
import { Label } from "~/src/components/shadcn/label"

export async function SettingsPasswordCard(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.settings")
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border/40 p-5">
        <CardTitle className="mb-1 text-base font-medium text-foreground">{t("security.password.title")}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">{t("security.password.description")}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 items-start gap-8 p-5 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
          <SettingsPasswordFields />
          <SettingsPasswordRequirements />
        </div>
      </CardContent>
      <div className="flex justify-end border-t border-border/40 bg-secondary/20 p-4">
        <Button size="sm" className="h-8 px-4 text-xs opacity-50 shadow-sm" disabled>
          {t("security.password.update")}
        </Button>
      </div>
    </Card>
  )
}

async function SettingsPasswordFields(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.settings")
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs">{t("security.password.current")}</Label>
        <Input type="password" placeholder="••••••••" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">{t("security.password.new")}</Label>
        <Input type="password" placeholder="••••••••" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">{t("security.password.confirm")}</Label>
        <Input type="password" placeholder="••••••••" />
      </div>
    </div>
  )
}

async function SettingsPasswordRequirements(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.settings")
  return (
    <div className="rounded-lg border border-border/40 bg-secondary/30 p-5">
      <h3 className="mb-4 text-xs font-medium text-foreground">{t("security.password.requirements.title")}</h3>
      <ul className="space-y-3 text-xs text-muted-foreground">
        <SettingsPasswordRequirement met icon={Check} text={t("security.password.requirements.length")} />
        <SettingsPasswordRequirement icon={X} text={t("security.password.requirements.case")} />
        <SettingsPasswordRequirement icon={X} text={t("security.password.requirements.special")} />
      </ul>
    </div>
  )
}

function SettingsPasswordRequirement({
  icon: Icon,
  met,
  text,
}: {
  readonly icon: typeof Check
  readonly met?: boolean
  readonly text: string
}): JSX.Element {
  return (
    <li className="flex items-start gap-2.5">
      <Icon className={`mt-0.5 size-4 shrink-0 ${met === true ? "text-emerald-500" : "text-muted-foreground"}`} />
      <span>{text}</span>
    </li>
  )
}
