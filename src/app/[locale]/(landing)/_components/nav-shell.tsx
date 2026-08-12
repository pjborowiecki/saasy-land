"use client"

import { type JSX, type ReactNode, useEffect, useRef, useState } from "react"

import { cn } from "~/src/utils"

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
      </header>
    </>
  )
}
