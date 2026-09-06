import type { JSX } from "react"

import { Tag, Users, Wallet } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { Card, CardContent } from "~/src/presentation/components/shadcn/card"

export const PricingModelsStats = (): JSX.Element => {
  const t = useTranslations("pages.admin.pricing-models")
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted/60 text-foreground">
            <Wallet className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">{t("stats.monthlyRecurring")}</p>
            <p className="text-lg font-medium tracking-tight text-foreground">$12,450</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted/60 text-foreground">
            <Users className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">{t("stats.activeSubscribers")}</p>
            <p className="text-lg font-medium tracking-tight text-foreground">842</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted/60 text-foreground">
            <Tag className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">{t("stats.activeModels")}</p>
            <p className="text-lg font-medium tracking-tight text-foreground">3</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
