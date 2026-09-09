import type { JSX } from "react"

import { Link } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { MobileMenu } from "~/src/presentation/components/custom/landing-page/components/mobile-menu"
import { NavLinks } from "~/src/presentation/components/custom/landing-page/components/nav-links"
import { NavShell } from "~/src/presentation/components/custom/landing-page/components/nav-shell"
import { Wordmark } from "~/src/presentation/components/custom/wordmark"

import { ROUTES } from "~/src/routes"

const NAV_SIGN_IN_CLASSNAME =
  "hidden shrink-0 rounded-md px-1 text-body-sm font-medium whitespace-nowrap text-muted-foreground transition-colors duration-200 ease-exp hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:inline-flex"

const NAV_CTA_CLASSNAME =
  "hidden h-9 shrink-0 items-center rounded-lg border border-border sm:inline-flex bg-card/60 px-3.5 text-body-sm font-medium whitespace-nowrap text-foreground transition-[color,border-color,background-color] duration-200 ease-exp hover:border-border hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-y-px"

export const Navigation = (): JSX.Element => {
  const t = useTranslations("components.navigation")

  return (
    <NavShell>
      <nav aria-label={t("ariaLabel")} className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-6 md:px-10">
        <Link className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring" to="/">
          <Wordmark />
        </Link>

        <div className="flex items-center gap-2 lg:gap-4">
          <NavLinks />
          <Link className={NAV_SIGN_IN_CLASSNAME} to={ROUTES.SIGN_IN}>
            {t("signIn")}
          </Link>
          <a className={NAV_CTA_CLASSNAME} href={ROUTES.HOME_PRICING_SECTION}>
            {t("getStarted")}
          </a>
          <MobileMenu />
        </div>
      </nav>
    </NavShell>
  )
}
