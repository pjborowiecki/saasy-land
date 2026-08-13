"use client"

import { type JSX, type ReactNode, useEffect, useMemo, useRef, useState } from "react"

import { useScroll, useSpring } from "motion/react"
import * as m from "motion/react-m"

import { cn } from "~/src/utils"

import { PROGRESS_SPRING } from "~/src/app/[locale]/(landing)/_components/motion-tokens"

/**
 * The bar is transparent over the hero and materialises once the page has moved.
 *
 * The state comes from an IntersectionObserver watching a zero-height sentinel at the top of
 * the document, not from a scroll listener: a listener runs on every frame of every gesture to
 * answer a question whose answer changes twice in a session. The observer answers it twice.
 *
 * The sentinel sits 1px tall at the very top, so "not intersecting" means "the document has
 * scrolled at all", which is exactly the condition the bar cares about.
 */
export function NavShell({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [hasScrolled, setHasScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, PROGRESS_SPRING)
  const progressStyle = useMemo(() => ({ scaleX: progress }), [progress])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) {
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      setHasScrolled(entry?.isIntersecting !== true)
    })
    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="pointer-events-none absolute top-0 left-0 h-px w-px" />
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ease-exp motion-reduce:transition-none",
          // The border is always present and only its colour changes, so the bar never
          // gains a pixel of height mid-scroll and shifts the whole page down by one.
          hasScrolled ? "border-border bg-background/72 backdrop-blur-xl" : "border-transparent bg-transparent",
        )}
      >
        {children}
        {/*
         * How far through the page you are, as a hairline.
         *
         * The bar already materialises on scroll, but a 72%-opacity dark panel over a dark page
         * behind dark content is a change nobody can see. This is the same event, told in the one
         * colour the design contract reserves for state and progress.
         *
         * `scaleX` on a motion value, so it runs on the compositor and never re-renders this
         * component. Bound straight to the transform, there is no scroll handler and no state.
         */}
        <m.div aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left bg-ring" style={progressStyle} />
      </header>
    </>
  )
}
