import type { JSX } from "react"

import { Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { Wordmark } from "~/src/presentation/components/custom/wordmark"

/*
 * The chrome spans the whole split: the wordmark sits at the left gutter over the gate frame,
 * the way out sits at the right gutter. Below `lg` the frame is gone and both land on the
 * ground. The lockup is the marketing site's exactly, so the visitor arrives on the mark they
 * clicked.
 */
const HEADER_CLASS = "absolute inset-x-0 top-0 z-10 flex h-20 items-center justify-between gap-6 px-6 md:px-10"

const BACK_LINK_CLASS =
  "group inline-flex h-11 items-center gap-2 text-body-sm font-medium text-muted-foreground transition-colors duration-200 ease-exp hover:text-foreground"

const BACK_ARROW_CLASS =
  "size-4 transition-transform duration-200 ease-exp group-hover:-translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none"

export const AuthHeaderFallback = (): JSX.Element => (
  <header className={HEADER_CLASS}>
    <Wordmark className="h-11" />
    <span aria-hidden className="h-4 w-28 animate-pulse rounded-sm bg-muted motion-reduce:animate-none" />
  </header>
)

export const AuthHeader = (): JSX.Element => {
  const t = useTranslations("auth.layout")

  return (
    <header className={HEADER_CLASS}>
      <Link
        className="flex h-11 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        to="/"
      >
        <Wordmark />
      </Link>

      <Link className={BACK_LINK_CLASS} to="/">
        <ArrowLeft aria-hidden className={BACK_ARROW_CLASS} strokeWidth={1.5} />
        {t("backToHome")}
      </Link>
    </header>
  )
}
