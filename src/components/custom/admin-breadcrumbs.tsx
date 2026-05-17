"use client"

import type { JSX } from "react"

import { ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"

import { Link, usePathname } from "~/src/integrations/next-intl/i18n.navigation"

export function AdminBreadcrumbs(): JSX.Element | null {
  const pathname = usePathname()
  const t = useTranslations("admin.sidebar")

  // This is a simple heuristic based on the sidebar config to generate breadcrumbs.
  // In a real app, you might map route paths to specific breadcrumb arrays.

  const pathParts = pathname.split("/").filter(Boolean)
  if (pathParts.length === 0 || pathParts[0] !== "admin") return null

  // If we're at /admin, maybe just show Home
  if (pathParts.length === 1) {
    return (
      <div className="hidden items-center gap-2 font-medium text-muted-foreground text-sm sm:flex">
        <Link href="/admin" className="transition-colors hover:text-foreground">
          {"Home"}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="cursor-default">{t("groups.overview")}</span>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{t("links.dashboard")}</span>
      </div>
    )
  }

  // /admin/products -> "Offerings" -> "Products"
  // For now we'll do a simple mapping
  const routeMappings: Record<string, { group: string; link: string }> = {
    products: { group: "offerings", link: "products" },
    "pricing-models": { group: "offerings", link: "pricingModels" },
    "content-access": { group: "offerings", link: "contentAccess" },
    blog: { group: "content", link: "blog" },
    "landing-page": { group: "content", link: "landingPage" },
    users: { group: "administration", link: "userManagement" },
    sessions: { group: "administration", link: "activeSessions" },
    payments: { group: "administration", link: "payments" },
    settings: { group: "administration", link: "settings" },
    analytics: { group: "overview", link: "analytics" },
  }

  const currentPath = pathParts[1]
  const mapping = currentPath ? routeMappings[currentPath] : null
  const action = pathParts[2]

  return (
    <div className="hidden items-center gap-2 font-medium text-muted-foreground text-sm sm:flex">
      <Link href="/admin" className="transition-colors hover:text-foreground">
        {"Home"}
      </Link>

      {mapping && (
        <>
          <ChevronRight className="size-3.5" />
          <span className="cursor-default">{t(`groups.${mapping.group}`)}</span>
          <ChevronRight className="size-3.5" />
          {action ? (
            <Link href={`/admin/${currentPath}`} className="transition-colors hover:text-foreground">
              {t(`links.${mapping.link}`)}
            </Link>
          ) : (
            <span className="text-foreground">{t(`links.${mapping.link}`)}</span>
          )}

          {action && (
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
