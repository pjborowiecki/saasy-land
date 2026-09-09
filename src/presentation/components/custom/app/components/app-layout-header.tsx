import type { JSX } from "react"

import { Link, useRouterState } from "@tanstack/react-router"
import { ArrowUpRight } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { SidebarTrigger } from "~/src/presentation/components/shadcn/sidebar"

import { APP_NAVIGATION } from "~/src/presentation/components/custom/app/constants/navigation"

import { ROUTES } from "~/src/routes"

export const AppLayoutHeader = (): JSX.Element => {
  const t = useTranslations("pages.app.navigation")
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const current = APP_NAVIGATION.find((item) => item.url === pathname)

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background/80 px-3 backdrop-blur-xl md:px-5">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger className="-ml-1 text-muted-foreground" />
        <span aria-hidden className="h-4 w-px bg-border" />
        <span className="truncate text-body-sm font-medium">{t(current?.label ?? "overview")}</span>
      </div>
      <Link
        className="flex shrink-0 items-center gap-1 rounded-sm text-body-sm text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        to={ROUTES.HOME}
      >
        {t("website")}
        <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.5} />
      </Link>
    </header>
  )
}
