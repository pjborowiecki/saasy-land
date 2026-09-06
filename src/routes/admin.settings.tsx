import { type JSX, Suspense } from "react"

import { createFileRoute } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { getActiveSessionsQuery } from "~/src/modules/session/use-cases/get-active-sessions"

import { Tabs, TabsList, TabsTrigger } from "~/src/presentation/components/shadcn/tabs"

import { SettingsGeneralTab } from "~/src/presentation/components/custom/admin/settings/components/settings-general-tab"
import { SettingsSecurityTab } from "~/src/presentation/components/custom/admin/settings/components/settings-security-tab"

const SETTINGS_SECURITY_TAB_FALLBACK = (
  <div className="mt-8 space-y-6">
    <div className="h-40 animate-pulse rounded-lg border border-border bg-muted/40" />
    <div className="h-40 animate-pulse rounded-lg border border-border bg-muted/40" />
    <div className="h-48 animate-pulse rounded-lg border border-border bg-muted/40" />
  </div>
)

const SettingsPage = (): JSX.Element => {
  const t = useTranslations("pages.admin.settings")

  return (
    <div className="flex w-full animate-in flex-col space-y-8 duration-500 fade-in-50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-statement font-semibold text-foreground">{t("title")}</h1>
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

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
  head: routeHead,
  loader: async ({ context }) => {
    const [metadata] = await Promise.all([
      loadRouteMessages({
        metadataNamespace: "pages.admin.settings",
        namespaces: [
          "auth.errors",
          "auth.validations",
          "locales",
          "pages.admin",
          "pages.admin.settings",
          "pages.admin.sidebar",
          "timezones",
          "user.validations",
        ],
        pathname: "/admin/settings",
        queryClient: context.queryClient,
      }),
      context.queryClient.query({ ...getActiveSessionsQuery, staleTime: "static" }),
    ])
    return metadata
  },
  staticData: {
    namespaces: [
      "auth.errors",
      "auth.validations",
      "locales",
      "pages.admin",
      "pages.admin.settings",
      "pages.admin.sidebar",
      "timezones",
      "user.validations",
    ],
  },
})
