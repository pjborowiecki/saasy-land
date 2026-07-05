"use client"

import type { JSX } from "react"

import { ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"

import { Link, usePathname } from "~/src/integrations/next-intl/i18n.navigation"

import { EMPTY_PATH_PARTS_LENGTH } from "~/src/lib/admin/constants"

const ADMIN_PATH_INDEX = 0
const ADMIN_ROUTE_INDEX = 1
const MIN_ADMIN_PATH_PARTS = 1

const routeMappings: Record<string, { group: string; link: string }> = {
  analytics: { group: "overview", link: "analytics" },
  blog: { group: "content", link: "blog" },
  "content-access": { group: "offerings", link: "contentAccess" },
  "landing-page": { group: "content", link: "landingPage" },
  payments: { group: "administration", link: "payments" },
  "pricing-models": { group: "offerings", link: "pricingModels" },
  products: { group: "offerings", link: "products" },
  sessions: { group: "administration", link: "activeSessions" },
  settings: { group: "administration", link: "settings" },
  users: { group: "administration", link: "userManagement" },
}

export function AdminBreadcrumbs(): JSX.Element | undefined {
  const pathname = usePathname()
  const t = useTranslations("admin.sidebar")

  const pathParts = pathname.split("/").filter(Boolean)
  if (pathParts.length === EMPTY_PATH_PARTS_LENGTH || pathParts[ADMIN_PATH_INDEX] !== "admin") {
    return undefined
  }

  if (pathParts.length === MIN_ADMIN_PATH_PARTS) {
    return (
      <div className="hidden items-center gap-2 text-sm font-medium text-muted-foreground sm:flex">
        <Link href="/admin" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="cursor-default">{t("groups.overview")}</span>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{t("links.dashboard")}</span>
      </div>
    )
  }

  const [currentPath, action] = pathParts.slice(ADMIN_ROUTE_INDEX)
  const mapping = currentPath === undefined ? undefined : routeMappings[currentPath]

  return (
    <div className="hidden items-center gap-2 text-sm font-medium text-muted-foreground sm:flex">
      <Link href="/admin" className="transition-colors hover:text-foreground">
        Home
      </Link>

      {mapping === undefined ? undefined : (
        <>
          <ChevronRight className="size-3.5" />
          <span className="cursor-default">{t(`groups.${mapping.group}`)}</span>
          <ChevronRight className="size-3.5" />
          {action === undefined ? (
            <span className="text-foreground">{t(`links.${mapping.link}`)}</span>
          ) : (
            <Link href={`/admin/${currentPath}`} className="transition-colors hover:text-foreground">
              {t(`links.${mapping.link}`)}
            </Link>
          )}

          {action === undefined ? undefined : (
            <>
              <ChevronRight className="size-3.5" />
              <span className="text-foreground capitalize">{action}</span>
            </>
          )}
        </>
      )}
    </div>
  )
}
