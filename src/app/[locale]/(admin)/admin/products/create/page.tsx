import type { Metadata } from "next"
import type { JSX } from "react"

import { CheckCircle } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/presentation/components/shadcn/button"

import { CreateProductForm } from "~/src/app/[locale]/(admin)/admin/products/create/_components/create-product-form"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.admin.products.create")

  return {
    description: t("sections.general.title"),
    title: t("title"),
  }
}

export default async function CreateProductPage(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.products.create")

  return (
    <div className="flex w-full animate-in flex-col space-y-8 duration-500 fade-in-50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-foreground">{t("title")}</h1>
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

      <CreateProductForm />
    </div>
  )
}
