import type { Metadata } from "next"
import type { JSX } from "react"

import {
  Bold,
  CloudUpload,
  Code,
  Eye,
  Heading,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  Maximize2,
  Quote,
  Save,
  Send,
  Underline,
} from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/components/shadcn/button"
import { Card } from "~/src/components/shadcn/card"
import { Input } from "~/src/components/shadcn/input"
import { Label } from "~/src/components/shadcn/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/src/components/shadcn/select"
import { Textarea } from "~/src/components/shadcn/textarea"

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>
}>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.blog.create" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function CreateBlogPostPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>
}>): Promise<JSX.Element> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.blog.create" })

  return (
    <div className="fade-in-50 flex w-full animate-in flex-col space-y-8 duration-500">
      {/* Page Title & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-medium text-2xl text-foreground tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-muted-foreground text-sm">{t("description")}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9 gap-2 px-4 shadow-sm">
            <Eye className="size-4" />
            {t("actions.preview")}
          </Button>
          <Button variant="outline" className="h-9 gap-2 px-4 shadow-sm">
            <Save className="size-4" />
            {t("actions.saveDraft")}
          </Button>
          <Button className="h-9 gap-2 px-4 shadow-sm">
            <Send className="size-4" />
            {t("actions.publish")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Left Column (Main Editor) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Title Input */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-foreground">
              {t("editor.title")}
            </Label>
            <Input
              id="title"
              placeholder={t("editor.titlePlaceholder")}
              className="h-12 border-border/40 bg-card px-4 font-medium text-lg shadow-sm"
            />
          </div>

          {/* Slug Input */}
          <div className="space-y-1.5">
            <Label htmlFor="slug" className="text-foreground">
              {t("editor.slug")}
            </Label>
            <div className="flex shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-border/40 border-r-0 bg-secondary/30 px-4 text-muted-foreground sm:text-sm">
                {"saasyland.com/blog/"}
              </span>
              <Input id="slug" placeholder={t("editor.slugPlaceholder")} className="rounded-l-none border-border/40 bg-card" />
            </div>
          </div>

          {/* Editor Area */}
          <Card className="flex h-[500px] flex-col overflow-hidden border-border/40 bg-card">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-border/40 border-b bg-secondary/20 p-2">
              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
                <Bold className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
                <Italic className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
                <Underline className="size-4" />
              </Button>

              <div className="mx-1 h-5 w-px bg-border/40" />

              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
                <Heading className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
                <Quote className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
                <Code className="size-4" />
              </Button>

              <div className="mx-1 h-5 w-px bg-border/40" />

              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
                <LinkIcon className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
                <ImageIcon className="size-4" />
              </Button>

              <div className="flex-1" />

              <Button variant="ghost" className="h-8 gap-2 text-muted-foreground hover:text-foreground">
                <Maximize2 className="size-4" />
                <span className="text-sm">{t("editor.fullscreen")}</span>
              </Button>
            </div>

            {/* Textarea */}
            <Textarea
              placeholder={t("editor.contentPlaceholder")}
              className="custom-scrollbar flex-1 resize-none rounded-none border-0 bg-transparent p-6 shadow-none focus-visible:ring-0"
            />
          </Card>
        </div>

        {/* Right Column (Settings) */}
        <div className="space-y-6 lg:col-span-1">
          {/* Featured Image */}
          <Card className="border-border/40 p-5 sm:p-6">
            <h3 className="mb-4 font-medium text-foreground text-sm">{t("settings.featuredImage")}</h3>
            <div className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-border/40 border-dashed bg-secondary/10 p-6 text-center transition-colors hover:border-border/80">
              <div className="mb-3 flex size-12 items-center justify-center rounded-full border border-border/40 bg-secondary/30 transition-transform group-hover:scale-105">
                <CloudUpload className="size-6 text-muted-foreground transition-colors group-hover:text-foreground" />
              </div>
              <p className="mb-1 font-medium text-foreground text-sm">{t("settings.upload")}</p>
              <p className="text-muted-foreground text-xs">{t("settings.uploadHelp")}</p>
            </div>
          </Card>

          {/* Publishing Details */}
          <Card className="border-border/40 p-5 sm:p-6">
            <h3 className="mb-4 font-medium text-foreground text-sm">{t("settings.publishing")}</h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">{t("settings.status")}</Label>
                <Select defaultValue="draft">
                  <SelectTrigger className="w-full bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">{t("settings.statusDraft")}</SelectItem>
                    <SelectItem value="published">{t("settings.statusPublished")}</SelectItem>
                    <SelectItem value="scheduled">{t("settings.statusScheduled")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">{t("settings.category")}</Label>
                <Select>
                  <SelectTrigger className="w-full bg-card">
                    <SelectValue placeholder={t("settings.categorySelect")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="updates">{t("settings.categoryUpdates")}</SelectItem>
                    <SelectItem value="tutorials">{t("settings.categoryTutorials")}</SelectItem>
                    <SelectItem value="company">{t("settings.categoryCompany")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tags" className="text-muted-foreground text-xs uppercase tracking-wider">
                  {t("settings.tags")}
                </Label>
                <Input id="tags" placeholder={t("settings.tagsPlaceholder")} className="bg-card" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="excerpt" className="text-muted-foreground text-xs uppercase tracking-wider">
                  {t("settings.excerpt")}
                </Label>
                <Textarea
                  id="excerpt"
                  placeholder={t("settings.excerptPlaceholder")}
                  className="custom-scrollbar min-h-[96px] resize-none bg-card"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
