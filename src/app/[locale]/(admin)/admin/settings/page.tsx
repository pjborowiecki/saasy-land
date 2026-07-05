import type { Metadata } from "next"
import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { ADMIN_SECURITY_SESSION_ROWS } from "~/src/lib/admin/demo-data"

import { Tabs, TabsList, TabsTrigger } from "~/src/components/shadcn/tabs"

import { SettingsGeneralTab } from "~/src/app/[locale]/(admin)/admin/settings/_components/settings-general-tab"
import { SettingsSecurityTab } from "~/src/app/[locale]/(admin)/admin/settings/_components/settings-security-tab"

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.settings" })

  return {
    description: t("metadata.description"),
    title: t("metadata.title"),
  }
}

export default async function SettingsPage({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<JSX.Element> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.settings" })
  const securitySessions = ADMIN_SECURITY_SESSION_ROWS

  return (
    <div className="flex w-full animate-in flex-col space-y-8 duration-500 fade-in-50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-medium tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <div className="border-b border-border">
          <TabsList variant="line" className="no-scrollbar w-full justify-start gap-6 overflow-x-auto">
            <TabsTrigger value="general" className="flex-none px-0 text-sm">
              {t("tabs.general")}
            </TabsTrigger>
            <TabsTrigger value="security" className="flex-none px-0 text-sm">
              {t("tabs.security")}
            </TabsTrigger>
            <TabsTrigger value="team" className="flex-none px-0 text-sm">
              {t("tabs.team")}
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex-none px-0 text-sm">
              {t("tabs.billing")}
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex-none px-0 text-sm">
              {t("tabs.integrations")}
            </TabsTrigger>
            <TabsTrigger value="api" className="flex-none px-0 text-sm">
              {t("tabs.api")}
            </TabsTrigger>
          </TabsList>
        </div>

        <SettingsGeneralTab />
        <SettingsSecurityTab securitySessions={securitySessions} />
      </Tabs>
    </div>
  )
}
