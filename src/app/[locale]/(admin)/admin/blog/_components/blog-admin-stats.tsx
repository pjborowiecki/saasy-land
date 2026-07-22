import type { JSX } from "react"

import { Calendar, Eye, TrendingUp, Users } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Card, CardContent } from "~/src/presentation/components/shadcn/card"

export async function BlogAdminStats(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.blog")
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{t("stats.totalViews")}</span>
            <Eye className="size-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-medium tracking-tight text-foreground">45.2k</div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-500">
            <TrendingUp className="size-3" />
            <span>+12.5%</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{t("stats.subscribers")}</span>
            <Users className="size-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-medium tracking-tight text-foreground">8,409</div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-500">
            <TrendingUp className="size-3" />
            <span>+4.2%</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{t("stats.publishedPosts")}</span>
            <Calendar className="size-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-medium tracking-tight text-foreground">142</div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <span>{t("stats.draftsPending", { count: 12 })}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
