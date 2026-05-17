import type { Metadata } from "next"
import type { JSX } from "react"

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  Copy,
  Eye,
  Grid3X3,
  HelpCircle,
  ImageIcon,
  Mail,
  Monitor,
  MonitorPlay,
  Pen,
  PlusCircle,
  Save,
  ShieldAlert,
  Smartphone,
  Star,
  Tablet,
  Tags,
  Trash2,
  UploadCloud,
  UsersRound,
  Video,
  Wand2,
} from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/components/shadcn/button"
import { Input } from "~/src/components/shadcn/input"
import { Label } from "~/src/components/shadcn/label"
import { Textarea } from "~/src/components/shadcn/textarea"

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.landingPage" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function LandingPageEditor({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<JSX.Element> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.landingPage" })

  return (
    <div className="fade-in-50 flex h-[calc(100vh-(--spacing(16)))] w-full animate-in flex-col pb-8 duration-500">
      {/* Page Title & Actions */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-1 font-medium text-2xl text-foreground tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("description")}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Eye className="size-4" />
            {t("actions.preview")}
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Save className="size-4" />
            {t("actions.saveChanges")}
          </Button>
          <Button className="flex items-center gap-2 shadow-sm">
            <UploadCloud className="size-4" />
            {t("actions.publish")}
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row">
        {/* Left Sidebar: Elements */}
        <div className="flex h-full w-full shrink-0 flex-col lg:w-64">
          <div className="custom-scrollbar flex-1 overflow-y-auto rounded-xl border border-border/40 bg-card p-4">
            <h3 className="mb-4 font-medium text-foreground text-sm">{t("sidebar.addSection")}</h3>
            <div className="space-y-2">
              <div className="group flex cursor-grab items-center gap-3 rounded-lg border border-border/40 bg-secondary/20 p-3 transition-colors hover:bg-secondary/40">
                <MonitorPlay className="size-4.5 text-muted-foreground transition-colors group-hover:text-foreground" />
                <span className="text-muted-foreground text-sm transition-colors group-hover:text-foreground">
                  {t("sidebar.sections.hero")}
                </span>
              </div>
              <div className="group flex cursor-grab items-center gap-3 rounded-lg border border-border/40 bg-secondary/20 p-3 transition-colors hover:bg-secondary/40">
                <Grid3X3 className="size-4.5 text-muted-foreground transition-colors group-hover:text-foreground" />
                <span className="text-muted-foreground text-sm transition-colors group-hover:text-foreground">
                  {t("sidebar.sections.features")}
                </span>
              </div>
              <div className="group flex cursor-grab items-center gap-3 rounded-lg border border-border/40 bg-secondary/20 p-3 transition-colors hover:bg-secondary/40">
                <Video className="size-4.5 text-muted-foreground transition-colors group-hover:text-foreground" />
                <span className="text-muted-foreground text-sm transition-colors group-hover:text-foreground">
                  {t("sidebar.sections.video")}
                </span>
              </div>
              <div className="group flex cursor-grab items-center gap-3 rounded-lg border border-border/40 bg-secondary/20 p-3 transition-colors hover:bg-secondary/40">
                <UsersRound className="size-4.5 text-muted-foreground transition-colors group-hover:text-foreground" />
                <span className="text-muted-foreground text-sm transition-colors group-hover:text-foreground">
                  {t("sidebar.sections.testimonials")}
                </span>
              </div>
              <div className="group flex cursor-grab items-center gap-3 rounded-lg border border-border/40 bg-secondary/20 p-3 transition-colors hover:bg-secondary/40">
                <Tags className="size-4.5 text-muted-foreground transition-colors group-hover:text-foreground" />
                <span className="text-muted-foreground text-sm transition-colors group-hover:text-foreground">
                  {t("sidebar.sections.pricing")}
                </span>
              </div>
              <div className="group flex cursor-grab items-center gap-3 rounded-lg border border-border/40 bg-secondary/20 p-3 transition-colors hover:bg-secondary/40">
                <ImageIcon className="size-4.5 text-muted-foreground transition-colors group-hover:text-foreground" />
                <span className="text-muted-foreground text-sm transition-colors group-hover:text-foreground">
                  {t("sidebar.sections.gallery")}
                </span>
              </div>
              <div className="group flex cursor-grab items-center gap-3 rounded-lg border border-border/40 bg-secondary/20 p-3 transition-colors hover:bg-secondary/40">
                <HelpCircle className="size-4.5 text-muted-foreground transition-colors group-hover:text-foreground" />
                <span className="text-muted-foreground text-sm transition-colors group-hover:text-foreground">
                  {t("sidebar.sections.faq")}
                </span>
              </div>
              <div className="group flex cursor-grab items-center gap-3 rounded-lg border border-border/40 bg-secondary/20 p-3 transition-colors hover:bg-secondary/40">
                <Mail className="size-4.5 text-muted-foreground transition-colors group-hover:text-foreground" />
                <span className="text-muted-foreground text-sm transition-colors group-hover:text-foreground">
                  {t("sidebar.sections.contact")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Canvas */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border/40 bg-card shadow-lg">
          {/* Canvas Header */}
          <div className="flex h-12 shrink-0 items-center justify-between border-border/40 border-b bg-secondary/10 px-4">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full border border-red-500/50 bg-red-500/20" />
              <div className="size-3 rounded-full border border-amber-500/50 bg-amber-500/20" />
              <div className="size-3 rounded-full border border-emerald-500/50 bg-emerald-500/20" />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-border/40 bg-secondary/30 p-1">
              <button type="button" className="rounded bg-secondary p-1.5 text-foreground shadow-sm">
                <Monitor className="size-4" />
              </button>
              <button
                type="button"
                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
              >
                <Tablet className="size-4" />
              </button>
              <button
                type="button"
                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
              >
                <Smartphone className="size-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 font-medium text-muted-foreground text-xs">
              {"1200px"}
              <ArrowDown className="size-3" />
            </div>
          </div>

          {/* Canvas Content */}
          <div className="custom-scrollbar flex-1 overflow-y-auto bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px] p-4 lg:p-8">
            <div className="mx-auto max-w-4xl space-y-4">
              {/* Selected Section: Hero */}
              <div className="group relative overflow-hidden rounded-xl border border-border/10 bg-card p-12 text-center shadow-sm ring-2 ring-fuchsia-500">
                <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-fuchsia-500/5 to-transparent" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500 px-3 py-1 font-bold text-[10px] text-white uppercase tracking-wider shadow-lg">
                  {t("sidebar.sections.hero")}
                </div>

                <div className="absolute top-3 right-3 z-10 flex gap-1">
                  <Button size="icon" variant="secondary" className="size-8 hover:bg-secondary/80">
                    <Pen className="size-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="size-8 hover:bg-secondary/80">
                    <Copy className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="size-8 bg-destructive/20 text-destructive hover:bg-destructive/30 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                <div className="relative z-10 mx-auto max-w-2xl">
                  <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1 font-medium text-fuchsia-500 text-xs">
                    <Star className="size-3.5" />
                    {t("canvas.newRelease")}
                  </span>
                  <h1 className="mb-6 font-semibold text-4xl text-foreground leading-tight tracking-tight md:text-5xl">
                    {t("canvas.supercharge")}
                    <span className="bg-linear-to-r from-fuchsia-500 to-purple-500 bg-clip-text text-transparent">
                      {t("canvas.growth")}
                    </span>
                  </h1>
                  <p className="mb-8 text-lg text-muted-foreground leading-relaxed">{t("canvas.description")}</p>
                  <div className="flex items-center justify-center gap-4">
                    <Button size="lg" className="h-12 px-8">
                      {t("canvas.getStarted")}
                    </Button>
                    <Button size="lg" variant="outline" className="h-12 px-8">
                      {t("canvas.bookDemo")}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Add Section Divider */}
              <div className="flex items-center justify-center py-2 opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100">
                <Button className="h-8 gap-2 rounded-full bg-fuchsia-500 px-4 text-xs shadow-lg hover:bg-fuchsia-600">
                  <PlusCircle className="size-3.5" />
                  {t("canvas.addSectionHere")}
                </Button>
              </div>

              {/* Unselected Section: Features */}
              <div className="group relative rounded-xl border border-border/30 border-dashed bg-secondary/5 p-12 transition-colors hover:border-border/60">
                <div className="absolute top-3 left-3 rounded-full bg-secondary px-3 py-1 font-bold text-[10px] text-muted-foreground uppercase tracking-wider opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                  {t("sidebar.sections.features")}
                </div>

                <div className="absolute top-3 right-3 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button size="icon" variant="secondary" className="size-8 hover:bg-secondary/80">
                    <Pen className="size-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="size-8 hover:bg-secondary/80">
                    <Copy className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="size-8 bg-destructive/20 text-destructive hover:bg-destructive/30 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                <div className="mb-10 text-center opacity-70 transition-opacity group-hover:opacity-100">
                  <h2 className="mb-3 font-semibold text-2xl text-foreground">{t("canvas.featuresHeading")}</h2>
                  <p className="text-muted-foreground text-sm">{t("canvas.featuresSubheading")}</p>
                </div>

                <div className="grid grid-cols-1 gap-6 opacity-70 transition-opacity group-hover:opacity-100 md:grid-cols-3">
                  <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-border/40 bg-secondary/10 p-5 text-center transition-colors hover:bg-secondary/20">
                    <Grid3X3 className="mb-3 size-8 text-fuchsia-500" />
                    <h3 className="mb-2 font-medium text-foreground text-sm">{t("canvas.feature1")}</h3>
                    <div className="mx-auto mb-1 h-1.5 w-20 rounded-full bg-border/50" />
                    <div className="mx-auto h-1.5 w-16 rounded-full bg-border/50" />
                  </div>
                  <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-border/40 bg-secondary/10 p-5 text-center transition-colors hover:bg-secondary/20">
                    <ShieldAlert className="mb-3 size-8 text-fuchsia-500" />
                    <h3 className="mb-2 font-medium text-foreground text-sm">{t("canvas.feature2")}</h3>
                    <div className="mx-auto mb-1 h-1.5 w-24 rounded-full bg-border/50" />
                    <div className="mx-auto h-1.5 w-12 rounded-full bg-border/50" />
                  </div>
                  <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-border/40 bg-secondary/10 p-5 text-center transition-colors hover:bg-secondary/20">
                    <UsersRound className="mb-3 size-8 text-fuchsia-500" />
                    <h3 className="mb-2 font-medium text-foreground text-sm">{t("canvas.feature3")}</h3>
                    <div className="mx-auto mb-1 h-1.5 w-16 rounded-full bg-border/50" />
                    <div className="mx-auto h-1.5 w-20 rounded-full bg-border/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Properties */}
        <div className="flex h-full w-full shrink-0 flex-col lg:w-80">
          <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto rounded-xl border border-border/40 bg-card p-5">
            <div className="flex items-center justify-between border-border/40 border-b pb-4">
              <div>
                <h3 className="font-medium text-foreground text-sm">{t("properties.title")}</h3>
                <p className="mt-1 text-muted-foreground text-xs">{t("properties.description")}</p>
              </div>
              <span className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-2 py-1 font-bold text-[10px] text-fuchsia-500 uppercase tracking-wider">
                {t("sidebar.sections.hero")}
              </span>
            </div>

            {/* Layout Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("properties.layout")}</h4>
              </div>
              <div className="grid grid-cols-3 gap-2 rounded-lg border border-border/40 bg-secondary/20 p-1">
                <button
                  type="button"
                  className="flex justify-center rounded border border-transparent p-2 text-muted-foreground transition-colors hover:bg-secondary/40"
                >
                  <AlignLeft className="size-4.5" />
                </button>
                <button type="button" className="flex justify-center rounded bg-secondary p-2 text-foreground shadow-sm">
                  <AlignCenter className="size-4.5" />
                </button>
                <button
                  type="button"
                  className="flex justify-center rounded border border-transparent p-2 text-muted-foreground transition-colors hover:bg-secondary/40"
                >
                  <AlignRight className="size-4.5" />
                </button>
              </div>
            </div>

            {/* Padding Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("properties.spacing")}</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <ArrowUp className="size-3" />
                    {t("properties.paddingTop")}
                  </Label>
                  <div className="relative">
                    <Input type="number" defaultValue="120" className="pr-8 text-sm" />
                    <span className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground text-xs">{"px"}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <ArrowDown className="size-3" />
                    {t("properties.paddingBot")}
                  </Label>
                  <div className="relative">
                    <Input type="number" defaultValue="120" className="pr-8 text-sm" />
                    <span className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground text-xs">{"px"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Settings */}
            <div className="space-y-3">
              <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("properties.background")}</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex size-10 cursor-pointer items-center justify-center rounded-lg border-2 border-fuchsia-500 bg-background ring-4 ring-fuchsia-500/10">
                  <div className="size-1.5 rounded-full bg-fuchsia-500" />
                </div>
                <div className="size-10 cursor-pointer rounded-lg border border-border/40 bg-secondary transition-colors hover:border-border" />
                <div className="size-10 cursor-pointer rounded-lg border border-border/40 bg-linear-to-br from-secondary to-background transition-colors hover:border-border" />
                <div className="flex size-10 cursor-pointer items-center justify-center rounded-lg border border-border/40 border-dashed bg-secondary/20 text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground">
                  <ImageIcon className="size-4.5" />
                </div>
              </div>
            </div>

            {/* Content Edit */}
            <div className="space-y-4 border-border/40 border-t pt-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("properties.content")}</h4>
                <button type="button" className="flex items-center gap-1 font-medium text-[10px] text-fuchsia-500 hover:text-fuchsia-600">
                  <Wand2 className="size-3" />
                  {t("properties.generateAI")}
                </button>
              </div>

              <div className="space-y-2">
                <Label className="flex justify-between text-muted-foreground text-xs">
                  {t("properties.badgeText")}
                  <Eye className="size-3 cursor-pointer text-muted-foreground" />
                </Label>
                <Input defaultValue="New v2.0 Release" />
              </div>

              <div className="space-y-2">
                <Label className="flex justify-between text-muted-foreground text-xs">
                  {t("properties.heading")}
                  <Eye className="size-3 cursor-pointer text-muted-foreground" />
                </Label>
                <Textarea defaultValue="Supercharge Your SaaS Growth" className="custom-scrollbar min-h-20 resize-none" />
              </div>

              <div className="space-y-2">
                <Label className="flex justify-between text-muted-foreground text-xs">
                  {t("properties.subheading")}
                  <Eye className="size-3 cursor-pointer text-muted-foreground" />
                </Label>
                <Textarea
                  defaultValue="The all-in-one platform to manage your customers, billing, and content. Build faster, convert better."
                  className="custom-scrollbar min-h-24 resize-none"
                />
              </div>
            </div>

            {/* Buttons Edit */}
            <div className="space-y-4 border-border/40 border-t pt-4">
              <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("properties.buttonActions")}</h4>

              {/* Primary Button */}
              <div className="space-y-3 rounded-lg border border-border/40 bg-secondary/10 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground text-xs">{t("properties.primaryButton")}</span>
                  <div className="relative h-4 w-8 cursor-pointer rounded-full bg-fuchsia-500">
                    <div className="absolute top-0.5 right-1 size-3 rounded-full bg-white" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground">{t("properties.label")}</Label>
                  <Input defaultValue="Get Started Free" className="h-8 text-xs" />
                </div>
              </div>

              {/* Secondary Button */}
              <div className="space-y-3 rounded-lg border border-border/40 bg-secondary/10 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground text-xs">{t("properties.secondaryButton")}</span>
                  <div className="relative h-4 w-8 cursor-pointer rounded-full bg-fuchsia-500">
                    <div className="absolute top-0.5 right-1 size-3 rounded-full bg-white" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground">{t("properties.label")}</Label>
                  <Input defaultValue="Book a Demo" className="h-8 text-xs" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
