import type { JSX } from "react"

import { CheckCircle2, MoreHorizontal, Pencil, Trash2, Users, type LucideIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Badge } from "~/src/presentation/components/shadcn/badge"
import { Button } from "~/src/presentation/components/shadcn/button"
import { Card, CardContent } from "~/src/presentation/components/shadcn/card"
import { Switch } from "~/src/presentation/components/shadcn/switch"

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
    // The Card clips its children (`overflow-hidden`, so images meet its radius), which sliced
    // the top half off a badge hung on `-top-3`. The marker now sits inside the card as a band
    // across the head of the column, which also means the three cards stay the same height.
    <Card className={`group relative flex h-full flex-col gap-0 py-0 ${cardClassName ?? ""}`}>
      {popularBadge ? (
        <p className="flex items-center gap-2 border-b border-border bg-muted/50 px-5 py-2 font-mono text-label text-foreground uppercase sm:px-6">
          <span aria-hidden className="size-1.25 rounded-xs bg-ring" />
          {t("tags.mostPopular")}
        </p>
      ) : undefined}
      <CardContent className="flex h-full flex-col p-5 sm:p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <Badge variant="secondary" className="mb-3 gap-1.5 text-xs font-medium">
              <TagIcon className="size-3" />
              {t(tagKey)}
            </Badge>
            <h2 className="text-lg font-medium tracking-tight text-foreground">{t(`models.${modelKey}.title`)}</h2>
          </div>
          <div title={t("labels.toggleStatus")} className="mt-1">
            {defaultChecked ? <Switch defaultSelected /> : <Switch isSelected={false} />}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-1.5">
            <span className="text-price text-foreground tabular-nums">{t(`models.${modelKey}.price`)}</span>
            <span className="font-mono text-spec text-muted-foreground">{t(`models.${modelKey}.interval`)}</span>
          </div>
          <p className={`mt-2 text-body-sm ${descriptionClassName ?? "text-muted-foreground"}`}>{t(`models.${modelKey}.description`)}</p>
        </div>

        <div className="mb-6 h-px w-full bg-border" />

        <div className="flex-1">
          <p className="mb-4 font-mono text-label text-muted-foreground uppercase">{t("labels.includedAccess")}</p>
          <ul className="space-y-3">
            {featureKeys.map((featureKey) => (
              <li key={featureKey} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-ring" strokeWidth={1.75} />
                <span className="text-sm text-muted-foreground">{t(`features.${featureKey}`)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <FooterIcon className="size-4" />
            {footerLabelKey === "labels.activeUsers" && activeUserCount !== undefined
              ? t("labels.activeUsers", { count: activeUserCount })
              : t("labels.inactive")}
          </div>
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button aria-label={t("labels.editModel")} className="size-8 text-muted-foreground" size="icon" variant="ghost">
              <Pencil className="size-4" />
            </Button>
            {showDeleteAction ? (
              <Button
                aria-label={t("labels.deleteModel")}
                className="size-8 text-muted-foreground hover:text-destructive"
                size="icon"
                variant="ghost"
              >
                <Trash2 className="size-4" />
              </Button>
            ) : (
              <Button aria-label={t("labels.moreOptions")} className="size-8 text-muted-foreground" size="icon" variant="ghost">
                <MoreHorizontal className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
