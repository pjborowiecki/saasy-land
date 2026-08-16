import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { Wordmark } from "~/src/presentation/components/custom/wordmark"

import { ROUTES } from "~/src/routes"

const LINK_CLASSNAME =
  "rounded-md text-body-sm transition-colors duration-200 ease-exp hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"

const CTA_CLASSNAME =
  "inline-flex h-9 items-center rounded-lg bg-primary px-4 text-body-sm font-semibold text-primary-foreground transition-[background-color,transform] duration-200 ease-exp hover:bg-primary/88 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring active:translate-y-px"

/**
 * The blog's own bar, rather than the landing page's.
 *
 * The landing navigation is built from bare `#section` anchors and an IntersectionObserver watching
 * ids that exist only on that page; rendered here, every one of its links would be dead. This keeps
 * the same measure, height and wordmark so the two read as one site, and points only at places
 * that exist from anywhere.
 */
export async function BlogHeader(): Promise<JSX.Element> {
  const t = await getTranslations("pages.blog")

  return (
    <header className="relative z-50 border-b border-border">
      <nav aria-label={t("metadata.title")} className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-6 md:px-10">
        <Link className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring" href="/">
          <Wordmark />
        </Link>

        <div className="flex items-center gap-5 lg:gap-7">
          <Link className={`${LINK_CLASSNAME} text-muted-foreground`} href={ROUTES.DOCS}>
            {t("nav.docs")}
          </Link>
          <Link aria-current="page" className={`${LINK_CLASSNAME} text-foreground`} href={ROUTES.BLOG}>
            {t("nav.blog")}
          </Link>
          <Link className={CTA_CLASSNAME} href={ROUTES.HOME_PRICING_SECTION}>
            {t("nav.getStarted")}
          </Link>
        </div>
      </nav>
    </header>
  )
}
