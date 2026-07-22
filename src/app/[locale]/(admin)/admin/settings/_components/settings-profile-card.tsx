import type { JSX } from "react"

import { ImageIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/src/presentation/components/shadcn/card"
import { Input } from "~/src/presentation/components/shadcn/input"
import { Label } from "~/src/presentation/components/shadcn/label"

export async function SettingsProfileCard(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.settings")
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border/40 p-5">
        <CardTitle className="mb-1 text-base font-medium text-foreground">{t("profile.title")}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">{t("profile.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-6 p-5">
        <SettingsProfileImageSection />
        <SettingsProfileFields />
      </CardContent>
      <div className="flex justify-end border-t border-border/40 bg-secondary/20 p-4">
        <Button size="sm" className="h-8 px-4 text-xs shadow-sm">
          {t("profile.saveChanges")}
        </Button>
      </div>
    </Card>
  )
}

async function SettingsProfileImageSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.settings")
  return (
    <div className="flex items-center gap-6">
      <div className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-secondary shadow-inner">
        <ImageIcon className="size-6 text-muted-foreground" />
      </div>
      <div>
        <div className="mb-2 flex gap-3">
          <Button size="sm" className="h-8 px-3 text-xs">
            {t("profile.uploadImage")}
          </Button>
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
            {t("profile.removeImage")}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">{t("profile.imageHint")}</p>
      </div>
    </div>
  )
}

async function SettingsProfileFields(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.settings")
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs">{t("profile.workspaceName")}</Label>
          <Input defaultValue="SaaSy Land" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">{t("profile.supportEmail")}</Label>
          <Input type="email" defaultValue="support@saasyland.com" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">{t("profile.workspaceUrl")}</Label>
        <div className="flex">
          <span className="inline-flex items-center rounded-l-lg border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
            {t("profile.urlPrefix")}
          </span>
          <Input defaultValue="hq" className="rounded-l-none" />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{t("profile.urlHint")}</p>
      </div>
    </div>
  )
}
