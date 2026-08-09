import type { Metadata } from "next"
import { Suspense, type JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Tabs, TabsList, TabsTrigger } from "~/src/presentation/components/shadcn/tabs"

import { SettingsGeneralTab } from "~/src/app/[locale]/(admin)/admin/settings/_components/settings-general-tab"
import { SettingsSecurityTab } from "~/src/app/[locale]/(admin)/admin/settings/_components/settings-security-tab"

const SETTINGS_SECURITY_TAB_FALLBACK = (
  <div className="mt-8 space-y-6">
    <div className="h-40 animate-pulse rounded-lg border border-border/40 bg-secondary/30" />
    <div className="h-40 animate-pulse rounded-lg border border-border/40 bg-secondary/30" />
    <div className="h-48 animate-pulse rounded-lg border border-border/40 bg-secondary/30" />
  </div>
)

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.admin.settings")

  return {
    description: t("metadata.description"),
    title: t("metadata.title"),
  }
}

export default async function SettingsPage(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.settings")

  return (
    <div className="flex w-full animate-in flex-col space-y-8 duration-500 fade-in-50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-medium tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
      </div>

      <Tabs defaultSelectedKey="general" className="w-full">
        <div className="border-b border-border">
          <TabsList variant="line" className="no-scrollbar w-full justify-start gap-6 overflow-x-auto">
            <TabsTrigger id="general" className="flex-none px-0 text-sm">
              {t("tabs.general")}
            </TabsTrigger>
            <TabsTrigger id="security" className="flex-none px-0 text-sm">
              {t("tabs.security")}
            </TabsTrigger>
            <TabsTrigger id="team" className="flex-none px-0 text-sm">
              {t("tabs.team")}
            </TabsTrigger>
            <TabsTrigger id="billing" className="flex-none px-0 text-sm">
              {t("tabs.billing")}
            </TabsTrigger>
            <TabsTrigger id="integrations" className="flex-none px-0 text-sm">
              {t("tabs.integrations")}
            </TabsTrigger>
            <TabsTrigger id="api" className="flex-none px-0 text-sm">
              {t("tabs.api")}
            </TabsTrigger>
          </TabsList>
        </div>

        <SettingsGeneralTab />
        <Suspense fallback={SETTINGS_SECURITY_TAB_FALLBACK}>
          <SettingsSecurityTab />
        </Suspense>
      </Tabs>
    </div>
  )
}
