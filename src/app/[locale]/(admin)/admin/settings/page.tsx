import type { Metadata } from "next"
import type { JSX } from "react"

import { Check, ImageIcon, Laptop, Smartphone, X } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Badge } from "~/src/components/shadcn/badge"
import { Button } from "~/src/components/shadcn/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/src/components/shadcn/card"
import { Input } from "~/src/components/shadcn/input"
import { Label } from "~/src/components/shadcn/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/src/components/shadcn/select"
import { Switch } from "~/src/components/shadcn/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/src/components/shadcn/tabs"

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.settings" })

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  }
}

export default async function SettingsPage({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<JSX.Element> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.settings" })

  return (
    <div className="fade-in-50 flex w-full animate-in flex-col space-y-8 duration-500">
      {/* Page Title & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-1 font-medium text-2xl text-foreground tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("description")}</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        {/* Tabs */}
        <div className="border-border border-b">
          <TabsList variant="line" className="no-scrollbar w-full justify-start gap-6 overflow-x-auto">
            <TabsTrigger value="general" className="flex-none px-0 text-sm">
              {t("tabs.general")}
            </TabsTrigger>
            <TabsTrigger value="security" className="flex-none px-0 text-sm">
              {t("tabs.security")}
            </TabsTrigger>
            <TabsTrigger value="team" className="flex-none px-0 text-sm">
              {t("tabs.team")}
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex-none px-0 text-sm">
              {t("tabs.billing")}
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex-none px-0 text-sm">
              {t("tabs.integrations")}
            </TabsTrigger>
            <TabsTrigger value="api" className="flex-none px-0 text-sm">
              {t("tabs.api")}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <TabsContent value="general" className="mt-8 space-y-6 outline-none">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Workspace Profile Card */}
            <Card className="overflow-hidden">
              <CardHeader className="border-border/40 border-b p-5">
                <CardTitle className="mb-1 font-medium text-base text-foreground">{t("profile.title")}</CardTitle>
                <CardDescription className="text-muted-foreground text-xs">{t("profile.description")}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-6 p-5">
                {/* Logo Upload */}
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
                    <p className="text-muted-foreground text-xs">{t("profile.imageHint")}</p>
                  </div>
                </div>

                {/* Form Fields */}
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
                      <span className="inline-flex items-center rounded-l-lg border border-input border-r-0 bg-muted px-3 text-muted-foreground text-sm">
                        {t("profile.urlPrefix")}
                      </span>
                      <Input defaultValue="hq" className="rounded-l-none" />
                    </div>
                    <p className="mt-1 text-muted-foreground text-xs">{t("profile.urlHint")}</p>
                  </div>
                </div>
              </CardContent>
              <div className="flex justify-end border-border/40 border-t bg-secondary/20 p-4">
                <Button size="sm" className="h-8 px-4 text-xs shadow-sm">
                  {t("profile.saveChanges")}
                </Button>
              </div>
            </Card>

            {/* Preferences Card */}
            <Card className="overflow-hidden">
              <CardHeader className="border-border/40 border-b p-5">
                <CardTitle className="mb-1 font-medium text-base text-foreground">{t("preferences.title")}</CardTitle>
                <CardDescription className="text-muted-foreground text-xs">{t("preferences.description")}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-6 p-5">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">{t("preferences.language")}</Label>
                    <Select defaultValue="en">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">{t("preferences.languages.en")}</SelectItem>
                        <SelectItem value="es">{t("preferences.languages.es")}</SelectItem>
                        <SelectItem value="fr">{t("preferences.languages.fr")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">{t("preferences.timezone")}</Label>
                    <Select defaultValue="est">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">{t("preferences.timezones.utc")}</SelectItem>
                        <SelectItem value="est">{t("preferences.timezones.est")}</SelectItem>
                        <SelectItem value="pst">{t("preferences.timezones.pst")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-foreground text-sm">{t("preferences.announcements.title")}</p>
                    <p className="text-muted-foreground text-xs">{t("preferences.announcements.description")}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Danger Zone Card */}
          <Card className="overflow-hidden border-destructive/20 bg-destructive/5">
            <CardHeader className="border-destructive/10 border-b p-5">
              <CardTitle className="mb-1 font-medium text-base text-destructive">{t("dangerZone.title")}</CardTitle>
              <CardDescription className="text-destructive/80 text-xs">{t("dangerZone.description")}</CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="mb-1 font-medium text-foreground text-sm">{t("dangerZone.delete.title")}</p>
                  <p className="text-muted-foreground text-xs">{t("dangerZone.delete.description")}</p>
                </div>
                <Button variant="destructive" className="shrink-0">
                  {t("dangerZone.delete.button")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-8 space-y-6 outline-none">
          {/* Password Card */}
          <Card className="overflow-hidden">
            <CardHeader className="border-border/40 border-b p-5">
              <CardTitle className="mb-1 font-medium text-base text-foreground">{t("security.password.title")}</CardTitle>
              <CardDescription className="text-muted-foreground text-xs">{t("security.password.description")}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 items-start gap-8 p-5 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
                {/* Inputs Form */}
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

                {/* Password Requirements Panel */}
                <div className="rounded-lg border border-border/40 bg-secondary/30 p-5">
                  <h3 className="mb-4 font-medium text-foreground text-xs">{t("security.password.requirements.title")}</h3>
                  <ul className="space-y-3 text-muted-foreground text-xs">
                    <li className="flex items-start gap-2.5">
                      <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                      <span>{t("security.password.requirements.length")}</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <X className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <span>{t("security.password.requirements.case")}</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <X className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <span>{t("security.password.requirements.special")}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <div className="flex justify-end border-border/40 border-t bg-secondary/20 p-4">
              <Button size="sm" className="h-8 px-4 text-xs opacity-50 shadow-sm" disabled>
                {t("security.password.update")}
              </Button>
            </div>
          </Card>

          {/* 2FA Card */}
          <Card className="overflow-hidden">
            <CardHeader className="border-border/40 border-b p-5">
              <CardTitle className="mb-1 font-medium text-base text-foreground">{t("security.twoFactor.title")}</CardTitle>
              <CardDescription className="text-muted-foreground text-xs">{t("security.twoFactor.description")}</CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-foreground text-sm">{t("security.twoFactor.app")}</p>
                  <p className="mt-1 text-muted-foreground text-xs">{t("security.twoFactor.appDescription")}</p>
                </div>
                <Button variant="outline" size="sm" className="h-8 shrink-0 px-4 text-xs">
                  {t("security.twoFactor.enable")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions Card */}
          <Card className="overflow-hidden">
            <div className="flex flex-col justify-between gap-4 border-border/40 border-b p-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="mb-1 font-medium text-base text-foreground">{t("security.sessions.title")}</h2>
                <p className="text-muted-foreground text-xs">{t("security.sessions.description")}</p>
              </div>
              <Button variant="outline" size="sm" className="h-8 shrink-0 px-3 text-xs">
                {t("security.sessions.logoutAll")}
              </Button>
            </div>

            <div className="divide-y divide-border/40">
              {(
                t.raw("security.sessions.list") as {
                  device: string
                  location: string
                  ip?: string
                  isCurrent: boolean
                  icon: "laptop" | "smartphone"
                  time?: string
                }[]
              ).map((session) => (
                <div
                  key={session.device}
                  className="group flex items-center justify-between gap-4 p-5 transition-colors hover:bg-secondary/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-secondary text-muted-foreground shadow-inner">
                      {session.icon === "laptop" ? <Laptop className="size-5" /> : <Smartphone className="size-5" />}
                    </div>
                    <div>
                      <div className="mb-0.5 flex items-center gap-2">
                        <p className="font-medium text-foreground text-sm">{session.device}</p>
                        {session.isCurrent && (
                          <Badge
                            variant="outline"
                            className="border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 font-medium text-[10px] text-emerald-500"
                          >
                            {t("security.sessions.currentBadge")}
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {session.location} {t("security.sessions.separator")}{" "}
                        {session.isCurrent ? session.ip : t("security.sessions.activeAgo", { time: session.time ?? "" })}
                      </p>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 font-medium text-destructive text-xs transition-opacity hover:bg-destructive/10 hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      {t("security.sessions.revoke")}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
