import type { JSX } from "react"

import { Archive, Calendar, ChevronDown, Filter, PlusCircle, ShoppingBag } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/presentation/components/shadcn/button"

import { PricingModelCard } from "~/src/app/[locale]/(admin)/admin/pricing-models/_components/pricing-model-card"
import { PricingModelsStats } from "~/src/app/[locale]/(admin)/admin/pricing-models/_components/pricing-models-stats"

const MONTHLY_FEATURES = ["allCourses", "discord", "qa"] as const
const ANNUAL_FEATURES = ["everythingInMonthly", "sourceFiles", "portfolioReview"] as const
const LIFETIME_FEATURES = ["standaloneCourse", "lifetimeUpdates", "guarantee"] as const

export async function generateMetadata() {
  const t = await getTranslations("pages.admin.pricing-models")
  return {
    title: `${t("title")} | SaaSy Land`,
  }
}

export default async function PricingModelsPage(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.pricing-models")

  return (
    <div className="flex w-full animate-in flex-col space-y-8 pb-8 duration-500 fade-in-50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-medium tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <Filter className="size-4" />
              {t("actions.allTypes")}
              <ChevronDown className="ml-1 size-3" />
            </Button>
          </div>
          <Button size="lg" className="flex items-center gap-2 shadow-sm">
            <PlusCircle className="size-4" />
            {t("actions.createModel")}
          </Button>
        </div>
      </div>

      <PricingModelsStats />

      <div className="grid grid-cols-1 items-start gap-6 pt-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        <PricingModelCard
          modelKey="monthly"
          tagIcon={Calendar}
          tagKey="tags.subscription"
          featureKeys={MONTHLY_FEATURES}
          activeUserCount={624}
          footerLabelKey="labels.activeUsers"
        />
        <PricingModelCard
          modelKey="annual"
          tagIcon={Calendar}
          tagKey="tags.subscription"
          featureKeys={ANNUAL_FEATURES}
          activeUserCount={218}
          footerLabelKey="labels.activeUsers"
          popularBadge
          cardClassName="border-primary/20 shadow-lg"
          descriptionClassName="text-green-500 dark:text-green-400"
        />
        <PricingModelCard
          modelKey="lifetime"
          tagIcon={ShoppingBag}
          tagKey="tags.oneTime"
          featureKeys={LIFETIME_FEATURES}
          footerIcon={Archive}
          footerLabelKey="labels.inactive"
          defaultChecked={false}
          showDeleteAction
          cardClassName="opacity-60 transition-opacity hover:opacity-100"
        />
      </div>
    </div>
  )
}
