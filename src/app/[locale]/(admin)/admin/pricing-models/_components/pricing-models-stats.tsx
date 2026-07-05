import type { JSX } from "react"

import { Tag, Users, Wallet } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Card, CardContent } from "~/src/components/shadcn/card"

export async function PricingModelsStats(): Promise<JSX.Element> {
  const t = await getTranslations("admin.pricingModels")
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex size-10 items-center justify-center rounded-lg border border-border/50 bg-secondary/50 text-foreground">
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
          <div className="flex size-10 items-center justify-center rounded-lg border border-border/50 bg-secondary/50 text-foreground">
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
          <div className="flex size-10 items-center justify-center rounded-lg border border-border/50 bg-secondary/50 text-foreground">
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
