import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { Wordmark } from "~/src/presentation/components/custom/wordmark"

import { MobileMenu } from "~/src/app/[locale]/(landing)/_components/mobile-menu"
import { NavLinks } from "~/src/app/[locale]/(landing)/_components/nav-links"
import { NavShell } from "~/src/app/[locale]/(landing)/_components/nav-shell"

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
const NAV_CTA_CLASSNAME =
  "hidden h-9 shrink-0 items-center rounded-lg border border-border sm:inline-flex bg-card/60 px-3.5 text-body-sm font-medium whitespace-nowrap text-foreground transition-[color,border-color,background-color] duration-200 ease-exp hover:border-border hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-y-px"

export async function Navigation(): Promise<JSX.Element> {
  const t = await getTranslations("pages.landing.components.navigation")

  return (
    <NavShell>
      <nav aria-label={t("ariaLabel")} className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-6 md:px-10">
        <Link className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring" href="/">
          <Wordmark />
        </Link>

        <div className="flex items-center gap-2 lg:gap-4">
          <NavLinks
            blogHref="/blog"
            blogLabel={t("items.blog")}
            docsHref="/docs"
            docsLabel={t("items.docs")}
            faqLabel={t("items.faq")}
            lineLabel={t("items.line")}
            pricingLabel={t("items.pricing")}
            qualityLabel={t("items.quality")}
            studioLabel={t("items.studio")}
          />
          <a className={NAV_CTA_CLASSNAME} href="#pricing">
            {t("getStarted")}
          </a>
          <MobileMenu
            closeLabel={t("closeMenu")}
            docsLabel={t("items.docs")}
            faqLabel={t("items.faq")}
            lineLabel={t("items.line")}
            openLabel={t("openMenu")}
            pricingLabel={t("items.pricing")}
            qualityLabel={t("items.quality")}
            studioLabel={t("items.studio")}
          />
        </div>
      </nav>
    </NavShell>
  )
}
