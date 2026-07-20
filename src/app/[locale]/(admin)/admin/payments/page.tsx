import type { Metadata } from "next"
import type { JSX } from "react"

import { Download, Settings } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/components/shadcn/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/src/components/shadcn/tabs"

import { PaymentsRefundsTab } from "~/src/app/[locale]/(admin)/admin/payments/_components/payments-refunds-tab"
import { ADMIN_PAYMENT_ROWS } from "~/src/data/admin/mock-data"

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "pages.admin.payments" })

  return {
    description: t("metadata.description"),
    title: t("metadata.title"),
  }
}

export default async function PaymentsPage({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<JSX.Element> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "pages.admin.payments" })

  return (
    <div className="flex w-full animate-in flex-col space-y-8 duration-500 fade-in-50">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-foreground">{t("title")}</h1>
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
          <PaymentsRefundsTab paymentRows={ADMIN_PAYMENT_ROWS} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
