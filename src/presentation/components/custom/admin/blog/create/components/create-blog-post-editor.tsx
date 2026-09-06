import type { JSX } from "react"

import { Bold, Code, Heading, Image as ImageIcon, Italic, Link as LinkIcon, Maximize2, Quote, Underline } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Card } from "~/src/presentation/components/shadcn/card"
import { Input } from "~/src/presentation/components/shadcn/input"
import { Label } from "~/src/presentation/components/shadcn/label"
import { Textarea } from "~/src/presentation/components/shadcn/textarea"

export const CreateBlogPostEditor = (): JSX.Element => {
  const t = useTranslations("pages.admin.blog.create")
  return (
    <div className="space-y-6 lg:col-span-2">
      <div className="space-y-1.5">
        <Label htmlFor="title" className="text-foreground">
          {t("editor.title")}
        </Label>
        <Input
          id="title"
          placeholder={t("editor.titlePlaceholder")}
          className="h-12 border-border bg-card px-4 text-lg font-medium shadow-sm"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="slug" className="text-foreground">
          {t("editor.slug")}
        </Label>
        <div className="flex shadow-sm">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-border bg-muted/40 px-4 text-muted-foreground sm:text-sm">
            saasyland.com/blog/
          </span>
          <Input id="slug" placeholder={t("editor.slugPlaceholder")} className="rounded-l-none border-border bg-card" />
        </div>
      </div>

      <Card className="flex h-[500px] flex-col overflow-hidden border-border bg-card">
        <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 p-2">
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
        <Textarea
          placeholder={t("editor.contentPlaceholder")}
          className="custom-scrollbar flex-1 resize-none rounded-none border-0 bg-transparent p-6 shadow-none focus-visible:ring-0"
        />
      </Card>
    </div>
  )
}
