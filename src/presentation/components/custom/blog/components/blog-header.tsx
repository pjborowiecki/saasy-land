import type { JSX } from "react"

import { Link } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { Wordmark } from "~/src/presentation/components/custom/wordmark"

import { ROUTES } from "~/src/routes"

const LINK_CLASSNAME =
  "rounded-md text-body-sm transition-colors duration-200 ease-exp hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"

const CTA_CLASSNAME =
  "inline-flex h-9 items-center rounded-lg bg-primary px-4 text-body-sm font-semibold text-primary-foreground transition-[background-color,transform] duration-200 ease-exp hover:bg-primary/88 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring active:translate-y-px"

export const BlogHeader = (): JSX.Element => {
  const t = useTranslations("pages.blog")

  return (
    <header className="relative z-50 border-b border-border">
      <nav aria-label={t("metadata.title")} className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-6 md:px-10">
        <Link className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring" to="/">
          <Wordmark />
        </Link>

        <div className="flex items-center gap-5 lg:gap-7">
          <Link className={`${LINK_CLASSNAME} text-muted-foreground`} to={ROUTES.DOCS}>
            {t("nav.docs")}
          </Link>
          <Link aria-current="page" className={`${LINK_CLASSNAME} text-foreground`} to={ROUTES.BLOG}>
            {t("nav.blog")}
          </Link>
          <Link className={CTA_CLASSNAME} to="/" hash="pricing">
            {t("nav.getStarted")}
          </Link>
        </div>
      </nav>
    </header>
  )
}
