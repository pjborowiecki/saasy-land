import type { JSX } from "react"

import { Link } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { MobileMenu } from "~/src/presentation/components/custom/landing-page/components/mobile-menu"
import { NavLinks } from "~/src/presentation/components/custom/landing-page/components/nav-links"
import { NavShell } from "~/src/presentation/components/custom/landing-page/components/nav-shell"
import { Wordmark } from "~/src/presentation/components/custom/wordmark"

import { ROUTES } from "~/src/routes"

/**
 * The bar's action is quiet on purpose.
 *
 * The hero's primary CTA is 200px below this one, in the same viewport, with the same label. The
 * page has one filled surface to spend above the fold and the hero owns it, so the bar states
 * the same destination in outline. It scrolls to `#pricing` rather than jumping to sign-up: the
 * three tier buttons are the page's only commercial exit.
 *
 * `h-9` and a 44px-tall tap target on the mobile toggle: this control is on screen for the whole
 * scroll and it is the only navigation a phone has.
 */
/**
 * Sign in is quieter than everything beside it, and it has to exist.
 *
 * Every action on this page points at buying, so a visitor who has already bought had nowhere to
 * go: the bar sent them to `#pricing` and the footer offered them the same tiers again. Plain
 * text rather than a second button, because returning customers are looking for this and new
 * ones should not be offered a login before they have a reason to have one.
 */
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
