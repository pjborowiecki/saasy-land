"use client"

import { type JSX, useEffect, useState } from "react"

import { cn } from "~/src/utils"

/** The anchored sections, in page order. */
const ANCHOR_ITEMS = ["line", "quality", "studio", "pricing", "faq"] as const

type AnchorItem = (typeof ANCHOR_ITEMS)[number]

const LINK_CLASSNAME =
  "relative rounded-md px-2 py-1.5 text-body-sm transition-colors duration-200 ease-exp hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

/**
 * A one-pixel band at 42% of the viewport height. A section is "the one you are reading" the
 * moment its top crosses that band.
 */
const ACTIVE_BAND = "-42% 0px -58% 0px"

interface NavLinksProps {
  readonly blogHref: string
  readonly blogLabel: string
  readonly docsHref: string
  readonly docsLabel: string
  readonly faqLabel: string
  readonly lineLabel: string
  readonly pricingLabel: string
  readonly qualityLabel: string
  readonly studioLabel: string
}

/**
 * The bar's reading head.
 *
 * The active section is marked with a 3px dot in the accent, sitting under the label, rather
 * than with a travelling underline: the accent is the page's only chroma and its job is to say
 * "this is the live one". A dot says that in the smallest mark the system has.
 *
 * The section comes from an IntersectionObserver rather than from scroll position, so the state
 * is computed by the browser off the main thread and costs nothing per frame.
 */
export function NavLinks({
  blogHref,
  blogLabel,
  docsHref,
  docsLabel,
  faqLabel,
  lineLabel,
  pricingLabel,
  qualityLabel,
  studioLabel,
}: NavLinksProps): JSX.Element {
  const labels: Record<AnchorItem, string> = {
    faq: faqLabel,
    line: lineLabel,
    pricing: pricingLabel,
    quality: qualityLabel,
    studio: studioLabel,
  }

  const [activeHash, setActiveHash] = useState<AnchorItem | undefined>()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const item = ANCHOR_ITEMS.find((anchor) => anchor === entry.target.id)
          if (entry.isIntersecting && item) {
            setActiveHash(item)
          }
        }
      },
      { rootMargin: ACTIVE_BAND },
    )

    for (const hash of ANCHOR_ITEMS) {
      const section = document.querySelector(`#${hash}`)
      if (section) {
        observer.observe(section)
      }
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className="hidden items-center gap-0.5 lg:flex">
      {ANCHOR_ITEMS.map((item) => (
        <a
          aria-current={activeHash === item ? "true" : undefined}
          className={cn(LINK_CLASSNAME, activeHash === item ? "text-foreground" : "text-muted-foreground")}
          href={`#${item}`}
          key={item}
        >
          {labels[item]}
          <span
            aria-hidden
            className={cn(
              "absolute inset-x-0 -bottom-0.5 mx-auto size-0.75 rounded-full bg-ring transition-opacity duration-300 ease-exp motion-reduce:transition-none",
              activeHash === item ? "opacity-100" : "opacity-0",
            )}
          />
        </a>
      ))}
      <a className={cn(LINK_CLASSNAME, "text-muted-foreground")} href={blogHref}>
        {blogLabel}
      </a>
      <a className={cn(LINK_CLASSNAME, "text-muted-foreground")} href={docsHref}>
        {docsLabel}
      </a>
    </div>
  )
}
