import type { JSX } from "react"

import { Link, type LinkProps, useRouterState } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

const ADMIN_PATH_INDEX = 0
const ADMIN_ROUTE_INDEX = 1
const MIN_ADMIN_PATH_PARTS = 1

const routeMappings: Record<string, { group: string; link: string; to: NonNullable<LinkProps["to"]> }> = {
  analytics: { group: "overview", link: "analytics", to: "/admin/analytics" },
  blog: { group: "content", link: "blog", to: "/admin/blog" },
  "landing-page": { group: "content", link: "landingPage", to: "/admin/landing-page" },
  payments: { group: "administration", link: "payments", to: "/admin/payments" },
  "pricing-models": { group: "offerings", link: "pricingModels", to: "/admin/pricing-models" },
  settings: { group: "administration", link: "settings", to: "/admin/settings" },
  users: { group: "administration", link: "userManagement", to: "/admin/users" },
}

const TRAIL_CLASSNAME = "hidden min-w-0 items-center gap-1.5 text-body-sm text-muted-foreground sm:flex"

const LINK_CLASSNAME =
  "rounded-sm transition-colors duration-200 ease-exp hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

const Divider = (): JSX.Element => (
  <span aria-hidden className="text-muted-foreground/40 select-none">
    /
  </span>
)

export const AdminBreadcrumbs = (): JSX.Element | undefined => {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const t = useTranslations("pages.admin.sidebar")
  const tBreadcrumbs = useTranslations("pages.admin.components.breadcrumbs")

  const pathParts = pathname.split("/").filter(Boolean)
  if (pathParts.length === 0 || pathParts[ADMIN_PATH_INDEX] !== "admin") {
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
      <Link className={LINK_CLASSNAME} to="/admin">
        {tBreadcrumbs("home")}
      </Link>

      {mapping === undefined ? undefined : (
        <>
          <Divider />
          {action === undefined ? (
            <span className="truncate font-medium text-foreground">{t(`links.${mapping.link}`)}</span>
          ) : (
            <Link className={LINK_CLASSNAME} to={mapping.to}>
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
