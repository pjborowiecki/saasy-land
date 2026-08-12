"use client"

import type { JSX } from "react"

import { useTranslations } from "next-intl"

import { Link, usePathname } from "~/src/integrations/next-intl/i18n.navigation"

import { EMPTY_PATH_PARTS_LENGTH } from "~/src/app/[locale]/(admin)/admin/_lib/constants"

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

const TRAIL_CLASSNAME = "hidden min-w-0 items-center gap-1.5 text-body-sm text-muted-foreground sm:flex"

const LINK_CLASSNAME =
  "rounded-sm transition-colors duration-200 ease-exp hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

/**
 * A slash, not a chevron. The trail is a path, the visitor already reads paths with slashes all
 * day, and a 14px chevron between every crumb is three extra glyphs of chrome for no extra
 * meaning.
 */
function Divider(): JSX.Element {
  return (
    <span aria-hidden className="text-muted-foreground/40 select-none">
      /
    </span>
  )
}

export function AdminBreadcrumbs(): JSX.Element | undefined {
  const pathname = usePathname()
  const t = useTranslations("pages.admin.sidebar")
  const tBreadcrumbs = useTranslations("pages.admin.components.breadcrumbs")

  const pathParts = pathname.split("/").filter(Boolean)
  if (pathParts.length === EMPTY_PATH_PARTS_LENGTH || pathParts[ADMIN_PATH_INDEX] !== "admin") {
    return undefined
  }

  if (pathParts.length === MIN_ADMIN_PATH_PARTS) {
    return (
      <nav aria-label={tBreadcrumbs("home")} className={TRAIL_CLASSNAME}>
        <span>{tBreadcrumbs("home")}</span>
        <Divider />
        <span className="font-medium text-foreground">{t("links.dashboard")}</span>
      </nav>
    )
  }

  const [currentPath, action] = pathParts.slice(ADMIN_ROUTE_INDEX)
  const mapping = currentPath === undefined ? undefined : routeMappings[currentPath]

  return (
    <nav aria-label={tBreadcrumbs("home")} className={TRAIL_CLASSNAME}>
      <Link className={LINK_CLASSNAME} href="/admin">
        {tBreadcrumbs("home")}
      </Link>

      {mapping === undefined ? undefined : (
        <>
          <Divider />
          {action === undefined ? (
            <span className="truncate font-medium text-foreground">{t(`links.${mapping.link}`)}</span>
          ) : (
            <Link className={LINK_CLASSNAME} href={`/admin/${currentPath}`}>
              {t(`links.${mapping.link}`)}
            </Link>
          )}

          {action === undefined ? undefined : (
            <>
              <Divider />
              <span className="truncate font-medium text-foreground capitalize">{action}</span>
            </>
          )}
        </>
      )}
    </nav>
  )
}
