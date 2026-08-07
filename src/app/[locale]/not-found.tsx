import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { cn } from "~/src/utils"

import { buttonVariants } from "~/src/presentation/components/shadcn/_lib/button-variants"

export default async function NotFound(): Promise<JSX.Element> {
  const t = await getTranslations("errors.notFound")

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="text-3xl font-medium tracking-tight text-foreground">{t("title")}</h1>
        <p className="max-w-prose text-sm text-muted-foreground">{t("description")}</p>
      </div>
      <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
        {t("backHome")}
      </Link>
    </main>
  )
}
