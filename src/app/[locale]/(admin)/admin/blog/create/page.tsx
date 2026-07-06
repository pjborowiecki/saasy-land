import type { Metadata } from "next"
import type { JSX } from "react"

import { Eye, Save, Send } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/components/shadcn/button"

import { CreateBlogPostEditor } from "~/src/app/[locale]/(admin)/admin/blog/create/_components/create-blog-post-editor"
import { CreateBlogPostSettings } from "~/src/app/[locale]/(admin)/admin/blog/create/_components/create-blog-post-settings"

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>
}>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "pages.admin.blog.create" })

  return {
    description: t("description"),
    title: t("title"),
  }
}

export default async function CreateBlogPostPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>
}>): Promise<JSX.Element> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "pages.admin.blog.create" })

  return (
    <div className="flex w-full animate-in flex-col space-y-8 duration-500 fade-in-50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-foreground">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>
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
        <CreateBlogPostEditor />
        <CreateBlogPostSettings />
      </div>
    </div>
  )
}
