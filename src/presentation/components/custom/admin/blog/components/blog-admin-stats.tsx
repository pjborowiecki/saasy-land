import type { JSX } from "react"

import { Calendar, Eye, TrendingUp, Users } from "lucide-react"
import { useFormatter, useTranslations } from "use-intl/react"

import { DEMO_BLOG_STATS } from "~/src/data/admin-blog"

import { Card, CardContent } from "~/src/presentation/components/shadcn/card"

export const BlogAdminStats = (): JSX.Element => {
  const t = useTranslations("pages.admin.blog")
  const format = useFormatter()
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{t("stats.totalViews")}</span>
            <Eye className="size-4 text-muted-foreground" />
          </div>
          <div className="text-headline-support text-foreground tabular-nums">
            {format.number(DEMO_BLOG_STATS.totalViews, { maximumFractionDigits: 1, notation: "compact" })}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-ring">
            <TrendingUp className="size-3" />
            <span>{format.number(DEMO_BLOG_STATS.viewsGrowth, { maximumFractionDigits: 1, signDisplay: "always", style: "percent" })}</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{t("stats.subscribers")}</span>
            <Users className="size-4 text-muted-foreground" />
          </div>
          <div className="text-headline-support text-foreground tabular-nums">{format.number(DEMO_BLOG_STATS.subscribers)}</div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-ring">
            <TrendingUp className="size-3" />
            <span>
              {format.number(DEMO_BLOG_STATS.subscribersGrowth, { maximumFractionDigits: 1, signDisplay: "always", style: "percent" })}
            </span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{t("stats.publishedPosts")}</span>
            <Calendar className="size-4 text-muted-foreground" />
          </div>
          <div className="text-headline-support text-foreground tabular-nums">{format.number(DEMO_BLOG_STATS.publishedPosts)}</div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <span>{t("stats.draftsPending", { count: DEMO_BLOG_STATS.draftsPending })}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
