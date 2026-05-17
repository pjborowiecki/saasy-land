import type { JSX } from "react"

import {
  Archive,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Filter,
  MoreHorizontal,
  Pencil,
  PlusCircle,
  ShoppingBag,
  Tag,
  Trash2,
  Users,
  Wallet,
} from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Badge } from "~/src/components/shadcn/badge"
import { Button } from "~/src/components/shadcn/button"
import { Card, CardContent } from "~/src/components/shadcn/card"
import { Switch } from "~/src/components/shadcn/switch"

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.pricingModels" })
  return {
    title: `${t("title")} | SaaSy Land`,
  }
}

export default async function PricingModelsPage(): Promise<JSX.Element> {
  const t = await getTranslations("admin.pricingModels")

  return (
    <div className="fade-in-50 flex w-full animate-in flex-col space-y-8 pb-8 duration-500">
      {/* Page Title & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-1 font-medium text-2xl text-foreground tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("description")}</p>
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg border border-border/50 bg-secondary/50 text-foreground">
              <Wallet className="size-5" />
            </div>
            <div>
              <p className="font-medium text-muted-foreground text-xs">{t("stats.monthlyRecurring")}</p>
              <p className="font-medium text-foreground text-lg tracking-tight">{"$12,450"}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg border border-border/50 bg-secondary/50 text-foreground">
              <Users className="size-5" />
            </div>
            <div>
              <p className="font-medium text-muted-foreground text-xs">{t("stats.activeSubscribers")}</p>
              <p className="font-medium text-foreground text-lg tracking-tight">{"842"}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg border border-border/50 bg-secondary/50 text-foreground">
              <Tag className="size-5" />
            </div>
            <div>
              <p className="font-medium text-muted-foreground text-xs">{t("stats.activeModels")}</p>
              <p className="font-medium text-foreground text-lg tracking-tight">{"3"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 items-start gap-6 pt-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {/* Card 1: Standard Monthly */}
        <Card className="group flex h-full flex-col">
          <CardContent className="flex h-full flex-col p-5 sm:p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <Badge variant="secondary" className="mb-3 gap-1.5 font-medium text-xs">
                  <Calendar className="size-3" />
                  {t("tags.subscription")}
                </Badge>
                <h2 className="font-medium text-foreground text-lg tracking-tight">{t("models.monthly.title")}</h2>
              </div>
              <div title={t("labels.toggleStatus")} className="mt-1">
                <Switch defaultChecked />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-end gap-1">
                <span className="font-medium text-3xl text-foreground tracking-tight">{t("models.monthly.price")}</span>
                <span className="mb-1 text-muted-foreground text-sm">{t("models.monthly.interval")}</span>
              </div>
              <p className="mt-2 text-muted-foreground text-sm">{t("models.monthly.description")}</p>
            </div>

            <div className="mb-6 h-px w-full bg-border/40" />

            <div className="flex-1">
              <p className="mb-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("labels.includedAccess")}</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground text-sm">{t("features.allCourses")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground text-sm">{t("features.discord")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground text-sm">{t("features.qa")}</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 flex items-center justify-between border-border/40 border-t pt-5">
              <div className="flex items-center gap-2 font-medium text-muted-foreground text-xs">
                <Users className="size-4" />
                {t("labels.activeUsers", { count: 624 })}
              </div>
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground" title={t("labels.editModel")}>
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground" title={t("labels.moreOptions")}>
                  <MoreHorizontal className="size-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Annual (Highlighted) */}
        <Card className="group relative flex h-full flex-col border-primary/20 shadow-lg">
          <Badge className="absolute -top-3 left-6 px-3 py-1 font-medium text-xs">{t("tags.mostPopular")}</Badge>
          <CardContent className="flex h-full flex-col p-5 sm:p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <Badge variant="secondary" className="mt-1 mb-3 gap-1.5 font-medium text-xs">
                  <Calendar className="size-3" />
                  {t("tags.subscription")}
                </Badge>
                <h2 className="font-medium text-foreground text-lg tracking-tight">{t("models.annual.title")}</h2>
              </div>
              <div title={t("labels.toggleStatus")} className="mt-1">
                <Switch defaultChecked />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-end gap-1">
                <span className="font-medium text-3xl text-foreground tracking-tight">{t("models.annual.price")}</span>
                <span className="mb-1 text-muted-foreground text-sm">{t("models.annual.interval")}</span>
              </div>
              <p className="mt-2 text-green-500 text-sm dark:text-green-400">{t("models.annual.description")}</p>
            </div>

            <div className="mb-6 h-px w-full bg-border/40" />

            <div className="flex-1">
              <p className="mb-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("labels.includedAccess")}</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground text-sm">{t("features.everythingInMonthly")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground text-sm">{t("features.sourceFiles")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground text-sm">{t("features.portfolioReview")}</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 flex items-center justify-between border-border/40 border-t pt-5">
              <div className="flex items-center gap-2 font-medium text-muted-foreground text-xs">
                <Users className="size-4" />
                {t("labels.activeUsers", { count: 218 })}
              </div>
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground" title={t("labels.editModel")}>
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground" title={t("labels.moreOptions")}>
                  <MoreHorizontal className="size-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: One-Time Purchase */}
        <Card className="group flex h-full flex-col opacity-60 transition-opacity hover:opacity-100">
          <CardContent className="flex h-full flex-col p-5 sm:p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <Badge variant="secondary" className="mb-3 gap-1.5 font-medium text-xs">
                  <ShoppingBag className="size-3" />
                  {t("tags.oneTime")}
                </Badge>
                <h2 className="font-medium text-foreground text-lg tracking-tight">{t("models.lifetime.title")}</h2>
              </div>
              <div title={t("labels.toggleStatus")} className="mt-1">
                <Switch checked={false} />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-end gap-1">
                <span className="font-medium text-3xl text-foreground tracking-tight">{t("models.lifetime.price")}</span>
                <span className="mb-1 text-muted-foreground text-sm">{t("models.lifetime.interval")}</span>
              </div>
              <p className="mt-2 text-muted-foreground text-sm">{t("models.lifetime.description")}</p>
            </div>

            <div className="mb-6 h-px w-full bg-border/40" />

            <div className="flex-1">
              <p className="mb-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">{t("labels.includedAccess")}</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground text-sm">{t("features.standaloneCourse")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground text-sm">{t("features.lifetimeUpdates")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground text-sm">{t("features.guarantee")}</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 flex items-center justify-between border-border/40 border-t pt-5">
              <div className="flex items-center gap-2 font-medium text-muted-foreground text-xs">
                <Archive className="size-4" />
                {t("labels.inactive")}
              </div>
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground" title={t("labels.editModel")}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-destructive"
                  title={t("labels.deleteModel")}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
