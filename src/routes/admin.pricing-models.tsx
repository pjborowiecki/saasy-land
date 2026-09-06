import type { JSX } from "react"

import { createFileRoute } from "@tanstack/react-router"
import { Archive, Calendar, ChevronDown, Filter, PlusCircle, ShoppingBag } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { Button } from "~/src/presentation/components/shadcn/button"

import { PricingModelCard } from "~/src/presentation/components/custom/admin/pricing-models/components/pricing-model-card"
import { PricingModelsStats } from "~/src/presentation/components/custom/admin/pricing-models/components/pricing-models-stats"

const MONTHLY_FEATURES = ["allCourses", "discord", "qa"] as const
const ANNUAL_FEATURES = ["everythingInMonthly", "sourceFiles", "portfolioReview"] as const
const LIFETIME_FEATURES = ["standaloneCourse", "lifetimeUpdates", "guarantee"] as const

const PricingModelsPage = (): JSX.Element => {
  const t = useTranslations("pages.admin.pricing-models")

  return (
    <div className="flex w-full animate-in flex-col space-y-8 pb-8 duration-500 fade-in-50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-statement font-semibold text-foreground">{t("title")}</h1>
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
          cardClassName="ring-ring/45"
          descriptionClassName="text-ring"
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

export const Route = createFileRoute("/admin/pricing-models")({
  component: PricingModelsPage,
  head: routeHead,
  loader: ({ context }) =>
    loadRouteMessages({
      metadataNamespace: "pages.admin.pricing-models",
      namespaces: [
        "auth.errors",
        "auth.validations",
        "pages.admin",
        "pages.admin.pricing-models",
        "pages.admin.sidebar",
        "user.validations",
      ],
      pathname: "/admin/pricing-models",
      queryClient: context.queryClient,
    }),
  staticData: {
    namespaces: ["auth.errors", "auth.validations", "pages.admin", "pages.admin.pricing-models", "pages.admin.sidebar", "user.validations"],
  },
})
