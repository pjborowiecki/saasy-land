import type { Metadata } from "next"
import type { JSX } from "react"

import {
  CheckCircle,
  ChevronDown,
  ChevronRight,
  CloudUpload,
  FileBadge2,
  FileText,
  GripVertical,
  Pencil,
  PlayCircle,
  Plus,
  PlusCircle,
  Settings,
  Trash2,
} from "lucide-react"
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
  const t = await getTranslations({ locale, namespace: "admin.courses.create" })

  return {
    title: t("title"),
    description: t("sections.general.title"),
  }
}

export default async function CreateCoursePage({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<JSX.Element> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.courses.create" })

  return (
    <div className="fade-in-50 flex w-full animate-in flex-col space-y-8 duration-500">
      {/* Page Title & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-medium text-2xl text-foreground tracking-tight">{t("title")}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="px-3">
            {t("actions.cancel")}
          </Button>
          <Button className="gap-2 px-4">
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
                  className="custom-scrollbar resize-none"
                />
                <p className="text-muted-foreground text-xs">{t("sections.general.description.help")}</p>
              </div>
            </div>
          </Card>

          {/* Curriculum Builder Card */}
          <Card className="p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-medium text-base text-foreground">{t("sections.curriculum.title")}</h2>
                <p className="mt-1 text-muted-foreground text-xs">{t("sections.curriculum.description")}</p>
              </div>
              <Button variant="ghost" className="h-8 px-3 text-sm">
                {t("sections.curriculum.expandAll")}
              </Button>
            </div>

            {/* Section 1 */}
            <div className="mb-6">
              {/* Section Header */}
              <div className="group mb-3 flex items-center">
                <div className="cursor-move p-1 text-muted-foreground transition-colors hover:text-foreground">
                  <GripVertical className="size-4" />
                </div>
                <div className="ml-1 flex flex-1 items-center gap-2">
                  <Button variant="ghost" size="icon-sm" className="text-muted-foreground transition-colors hover:text-foreground">
                    <ChevronDown className="size-4" />
                  </Button>
                  <h3 className="font-medium text-foreground text-sm">{"Section 1: Getting Started"}</h3>
                </div>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:bg-white/5 hover:text-foreground">
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:bg-white/5 hover:text-destructive">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Lessons List */}
              <div className="space-y-2 pl-8">
                {/* Lesson Item 1 */}
                <div className="group flex cursor-pointer items-center gap-3 rounded-xl border border-border/40 bg-secondary/5 p-3 transition-colors hover:border-border/80">
                  <div className="cursor-move text-muted-foreground opacity-0 transition-all group-hover:text-foreground group-hover:opacity-100">
                    <GripVertical className="size-4" />
                  </div>
                  <div className="-ml-2 flex-1 transition-all group-hover:ml-0">
                    <p className="font-medium text-foreground text-sm">{"Welcome to the Course"}</p>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <PlayCircle className="size-4 transition-colors hover:text-foreground" />
                    <FileText className="size-4 transition-colors hover:text-foreground" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="ml-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Settings className="size-4" />
                  </Button>
                </div>

                {/* Lesson Item 2 */}
                <div className="group flex cursor-pointer items-center gap-3 rounded-xl border border-border/40 bg-secondary/5 p-3 transition-colors hover:border-border/80">
                  <div className="cursor-move text-muted-foreground opacity-0 transition-all group-hover:text-foreground group-hover:opacity-100">
                    <GripVertical className="size-4" />
                  </div>
                  <div className="-ml-2 flex-1 transition-all group-hover:ml-0">
                    <p className="font-medium text-foreground text-sm">{"Setting Up Your Environment"}</p>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <PlayCircle className="size-4 transition-colors hover:text-foreground" />
                    <FileBadge2 className="size-4 transition-colors hover:text-foreground" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="ml-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Settings className="size-4" />
                  </Button>
                </div>

                {/* Add Lesson Button */}
                <Button
                  variant="outline"
                  className="mt-2 w-full justify-center gap-2 border-transparent border-dashed bg-secondary/5 hover:border-border/40 hover:bg-secondary/10"
                >
                  <PlusCircle className="size-4" />
                  {t("sections.curriculum.addLesson")}
                </Button>
              </div>
            </div>

            {/* Section 2 */}
            <div className="mb-6">
              <div className="group mb-3 flex items-center">
                <div className="cursor-move p-1 text-muted-foreground transition-colors hover:text-foreground">
                  <GripVertical className="size-4" />
                </div>
                <div className="ml-1 flex flex-1 items-center gap-2">
                  <Button variant="ghost" size="icon-sm" className="text-muted-foreground transition-colors hover:text-foreground">
                    <ChevronRight className="size-4" />
                  </Button>
                  <h3 className="font-medium text-foreground text-sm">{"Section 2: Core Concepts"}</h3>
                </div>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:bg-white/5 hover:text-foreground">
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:bg-white/5 hover:text-destructive">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Add Section Button */}
            <Button variant="outline" className="mt-4 w-full justify-center gap-2 border-dashed bg-secondary/5">
              <Plus className="size-4" />
              {t("sections.curriculum.addSection")}
            </Button>
          </Card>

          {/* Pricing Card */}
          <Card className="p-5 sm:p-6">
            <h2 className="mb-5 font-medium text-base text-foreground">{t("sections.pricing.title")}</h2>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="space-y-1.5">
                <Label>{t("sections.pricing.model.label")}</Label>
                <Tabs defaultValue="subscription" className="w-fit">
                  <TabsList className="w-fit">
                    <TabsTrigger value="onetime">{t("sections.pricing.model.oneTime")}</TabsTrigger>
                    <TabsTrigger value="subscription">{t("sections.pricing.model.subscription")}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex-1 space-y-1.5">
                <Label htmlFor="price">{t("sections.pricing.price.label")}</Label>
                <div className="relative">
                  <span className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground text-sm">{"$"}</span>
                  <Input id="price" type="number" placeholder={t("sections.pricing.price.placeholder")} className="pl-8" />
                </div>
              </div>

              <div className="flex-1 space-y-1.5">
                <Label>{t("sections.pricing.duration.label")}</Label>
                <Select defaultValue="lifetime">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lifetime">{t("sections.pricing.duration.lifetime")}</SelectItem>
                    <SelectItem value="1year">{"1 Year Access"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                  <span className="font-medium text-foreground text-sm">{t("sections.status.certificate.label")}</span>
                  <span className="text-muted-foreground text-xs">{t("sections.status.certificate.description")}</span>
                </div>
                <Switch />
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
                    <SelectItem value="dev">{"Development"}</SelectItem>
                    <SelectItem value="design">{"Design"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 space-y-1.5">
                <Label>{t("sections.organization.difficulty.label")}</Label>
                <Select>
                  <SelectTrigger className="w-full text-muted-foreground">
                    <SelectValue placeholder={t("sections.organization.difficulty.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">{"Beginner"}</SelectItem>
                    <SelectItem value="intermediate">{"Intermediate"}</SelectItem>
                    <SelectItem value="advanced">{"Advanced"}</SelectItem>
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
