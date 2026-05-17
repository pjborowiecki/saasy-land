import type { Metadata } from "next"
import type { JSX } from "react"

import { CheckCircle, CloudUpload } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/components/shadcn/button"
import { Card } from "~/src/components/shadcn/card"
import { Input } from "~/src/components/shadcn/input"
import { Label } from "~/src/components/shadcn/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/src/components/shadcn/select"
import { Switch } from "~/src/components/shadcn/switch"
import { Tabs, TabsList, TabsTrigger } from "~/src/components/shadcn/tabs"
import { Textarea } from "~/src/components/shadcn/textarea"

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.products.create" })

  return {
    title: t("title"),
    description: t("sections.general.title"),
  }
}

export default async function CreateProductPage({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<JSX.Element> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.products.create" })

  return (
    <div className="fade-in-50 flex w-full animate-in flex-col space-y-8 duration-500">
      {/* Page Title & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-medium text-2xl text-foreground tracking-tight">{t("title")}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="h-9 px-3">
            {t("actions.cancel")}
          </Button>
          <Button className="h-9 gap-2 px-4">
            <CheckCircle className="size-4" />
            {t("actions.save")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Left Column (Main Details) */}
        <div className="space-y-6 lg:col-span-2">
          {/* General Info Card */}
          <Card className="p-5 sm:p-6">
            <h2 className="mb-5 font-medium text-base text-foreground">{t("sections.general.title")}</h2>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="name">{t("sections.general.name.label")}</Label>
                <Input id="name" placeholder={t("sections.general.name.placeholder")} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">{t("sections.general.description.label")}</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder={t("sections.general.description.placeholder")}
                  className="custom-scrollbar min-h-[120px] resize-none"
                />
                <p className="text-muted-foreground text-xs">{t("sections.general.description.help")}</p>
              </div>
            </div>
          </Card>

          {/* Pricing Card */}
          <Card className="p-5 sm:p-6">
            <h2 className="mb-5 font-medium text-base text-foreground">{t("sections.pricing.title")}</h2>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="space-y-1.5">
                <Label>{t("sections.pricing.model.label")}</Label>
                <Tabs defaultValue="subscription" className="w-fit">
                  <TabsList className="w-fit">
                    <TabsTrigger value="subscription">{t("sections.pricing.model.subscription")}</TabsTrigger>
                    <TabsTrigger value="onetime">{t("sections.pricing.model.oneTime")}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex-1 space-y-1.5">
                <Label htmlFor="price">{t("sections.pricing.price.label")}</Label>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground text-sm">{"$"}</span>
                  <Input id="price" type="number" placeholder={t("sections.pricing.price.placeholder")} className="pl-7" />
                </div>
              </div>

              <div className="flex-1 space-y-1.5">
                <Label>{t("sections.pricing.period.label")}</Label>
                <Select defaultValue="monthly">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">{t("sections.pricing.period.monthly")}</SelectItem>
                    <SelectItem value="yearly">{"Yearly"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Media Card */}
          <Card className="p-5 sm:p-6">
            <h2 className="mb-5 font-medium text-base text-foreground">{t("sections.media.title")}</h2>

            <div className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-border/40 border-dashed bg-secondary/10 p-8 text-center transition-colors hover:border-border/80">
              <div className="mb-3 flex size-12 items-center justify-center rounded-full border border-border/40 bg-secondary/30 transition-transform group-hover:scale-105">
                <CloudUpload className="size-6 text-muted-foreground transition-colors group-hover:text-foreground" />
              </div>
              <p className="mb-1 font-medium text-foreground text-sm">{t("sections.media.upload")}</p>
              <p className="text-muted-foreground text-xs">{t("sections.media.help")}</p>
            </div>
          </Card>
        </div>

        {/* Right Column (Settings & Org) */}
        <div className="space-y-6 lg:col-span-1">
          {/* Status Card */}
          <Card className="p-5 sm:p-6">
            <h2 className="mb-4 font-medium text-base text-foreground">{t("sections.status.title")}</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium text-foreground text-sm">{t("sections.status.publish.label")}</span>
                  <span className="text-muted-foreground text-xs">{t("sections.status.publish.description")}</span>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="h-px w-full bg-border/40" />

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium text-foreground text-sm">{t("sections.status.requireLogin.label")}</span>
                  <span className="text-muted-foreground text-xs">{t("sections.status.requireLogin.description")}</span>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          {/* Organization Card */}
          <Card className="p-5 sm:p-6">
            <h2 className="mb-4 font-medium text-base text-foreground">{t("sections.organization.title")}</h2>

            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="flex-1 space-y-1.5">
                <Label>{t("sections.organization.category.label")}</Label>
                <Select>
                  <SelectTrigger className="w-full text-muted-foreground">
                    <SelectValue placeholder={t("sections.organization.category.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="saas">{"SaaS Plans"}</SelectItem>
                    <SelectItem value="addons">{"Add-ons"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 space-y-1.5">
                <Label>{t("sections.organization.collection.label")}</Label>
                <Select>
                  <SelectTrigger className="w-full text-muted-foreground">
                    <SelectValue placeholder={t("sections.organization.collection.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="core">{"Core Subscription"}</SelectItem>
                    <SelectItem value="legacy">{"Legacy"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
