import type { JSX } from "react"

import { CheckCircle2, MoreHorizontal, Pencil, Trash2, Users, type LucideIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Badge } from "~/src/components/shadcn/badge"
import { Button } from "~/src/components/shadcn/button"
import { Card, CardContent } from "~/src/components/shadcn/card"
import { Switch } from "~/src/components/shadcn/switch"

interface PricingModelCardProps {
  readonly activeUserCount?: number
  readonly cardClassName?: string
  readonly defaultChecked?: boolean
  readonly descriptionClassName?: string
  readonly featureKeys: readonly string[]
  readonly footerIcon?: LucideIcon
  readonly footerLabelKey: "labels.activeUsers" | "labels.inactive"
  readonly modelKey: "annual" | "lifetime" | "monthly"
  readonly popularBadge?: boolean
  readonly showDeleteAction?: boolean
  readonly tagIcon: LucideIcon
  readonly tagKey: "tags.oneTime" | "tags.subscription"
}

export async function PricingModelCard({
  activeUserCount,
  cardClassName,
  defaultChecked = true,
  descriptionClassName,
  featureKeys,
  footerIcon: FooterIcon = Users,
  footerLabelKey,
  modelKey,
  popularBadge = false,
  showDeleteAction = false,
  tagIcon: TagIcon,
  tagKey,
}: PricingModelCardProps): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.pricing-models")
  return (
    <Card className={`group relative flex h-full flex-col ${cardClassName ?? ""}`}>
      {popularBadge && <Badge className="absolute -top-3 left-6 px-3 py-1 text-xs font-medium">{t("tags.mostPopular")}</Badge>}
      <CardContent className="flex h-full flex-col p-5 sm:p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <Badge variant="secondary" className={`mb-3 gap-1.5 text-xs font-medium ${popularBadge ? "mt-1" : ""}`}>
              <TagIcon className="size-3" />
              {t(tagKey)}
            </Badge>
            <h2 className="text-lg font-medium tracking-tight text-foreground">{t(`models.${modelKey}.title`)}</h2>
          </div>
          <div title={t("labels.toggleStatus")} className="mt-1">
            {defaultChecked ? <Switch defaultChecked /> : <Switch checked={false} />}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-end gap-1">
            <span className="text-3xl font-medium tracking-tight text-foreground">{t(`models.${modelKey}.price`)}</span>
            <span className="mb-1 text-sm text-muted-foreground">{t(`models.${modelKey}.interval`)}</span>
          </div>
          <p className={`mt-2 text-sm ${descriptionClassName ?? "text-muted-foreground"}`}>{t(`models.${modelKey}.description`)}</p>
        </div>

        <div className="mb-6 h-px w-full bg-border/40" />

        <div className="flex-1">
          <p className="mb-4 text-xs font-medium tracking-wider text-muted-foreground uppercase">{t("labels.includedAccess")}</p>
          <ul className="space-y-3">
            {featureKeys.map((featureKey) => (
              <li key={featureKey} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-sm text-muted-foreground">{t(`features.${featureKey}`)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-5">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <FooterIcon className="size-4" />
            {footerLabelKey === "labels.activeUsers" && activeUserCount !== undefined
              ? t("labels.activeUsers", { count: activeUserCount })
              : t("labels.inactive")}
          </div>
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground" title={t("labels.editModel")}>
              <Pencil className="size-4" />
            </Button>
            {showDeleteAction ? (
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-destructive"
                title={t("labels.deleteModel")}
              >
                <Trash2 className="size-4" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground" title={t("labels.moreOptions")}>
                <MoreHorizontal className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
