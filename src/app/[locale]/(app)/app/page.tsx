import type { Metadata } from "next"
import { type JSX, Suspense } from "react"

import { getTranslations } from "next-intl/server"

import { CONSTANTS } from "~/src/constants"

import { UserWidget } from "~/src/app/[locale]/(app)/app/_components/user-widget"

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/app">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "app.page" })

  return {
    description: t("metadata.description"),
  }
}

export default async function AppPage({ params }: Readonly<PageProps<"/[locale]/app">>): Promise<JSX.Element> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "app.page" })

  return (
    <div className="flex w-full flex-col gap-8 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-medium text-3xl tracking-tight">{t("welcome", { name: CONSTANTS.APP_NAME })}</h1>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-8 shadow-sm backdrop-blur-md">
        <Suspense fallback={<div className="h-20 animate-pulse rounded-lg bg-white/5" />}>
          <UserWidget />
        </Suspense>
      </div>
    </div>
  )
}
