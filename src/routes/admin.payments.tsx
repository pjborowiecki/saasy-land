import type { JSX } from "react"

import { createFileRoute } from "@tanstack/react-router"
import { Download, Settings } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/src/presentation/components/shadcn/tabs"

import { PaymentsRefundsTab } from "~/src/presentation/components/custom/admin/payments/components/payments-refunds-tab"
import { useDemoPayments } from "~/src/presentation/components/custom/admin/payments/hooks/use-demo-payments"

const PaymentsPage = (): JSX.Element => {
  const t = useTranslations("pages.admin.payments")
  const payments = useDemoPayments()

  return (
    <div className="flex w-full animate-in flex-col space-y-8 duration-500 fade-in-50">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-statement font-semibold text-foreground">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>
        </div>
      </div>

      <Tabs defaultSelectedKey="refunds" className="w-full">
        <div className="flex flex-col gap-4 border-b border-border sm:flex-row sm:items-center sm:justify-between">
          <TabsList variant="line" className="no-scrollbar flex-1 justify-start gap-6 overflow-x-auto">
            <TabsTrigger id="transactions" className="flex-none px-0 text-sm">
              {t("tabs.transactions")}
            </TabsTrigger>
            <TabsTrigger id="subscriptions" className="flex-none px-0 text-sm">
              {t("tabs.subscriptions")}
            </TabsTrigger>
            <TabsTrigger id="payouts" className="flex-none px-0 text-sm">
              {t("tabs.payouts")}
            </TabsTrigger>
            <TabsTrigger id="refunds" className="flex-none px-0 text-sm">
              {t("tabs.refunds")}
            </TabsTrigger>
          </TabsList>
          <div className="flex flex-wrap items-center gap-3 pb-3 sm:pb-0">
            <Button variant="outline" size="sm" className="h-9 gap-2">
              <Download className="size-4" />
              {t("actions.export")}
            </Button>
            <Button size="sm" className="h-9 gap-2">
              <Settings className="size-4" />
              {t("actions.settings")}
            </Button>
          </div>
        </div>

        <TabsContent id="refunds">
          <PaymentsRefundsTab paymentRows={payments} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const Route = createFileRoute("/admin/payments")({
  component: PaymentsPage,
  head: routeHead,
  loader: ({ context }) =>
    loadRouteMessages({
      metadataNamespace: "pages.admin.payments",
      namespaces: ["auth.errors", "auth.validations", "pages.admin", "pages.admin.payments", "pages.admin.sidebar", "user.validations"],
      pathname: "/admin/payments",
      queryClient: context.queryClient,
    }),
  staticData: {
    namespaces: ["auth.errors", "auth.validations", "pages.admin", "pages.admin.payments", "pages.admin.sidebar", "user.validations"],
  },
})
