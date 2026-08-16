"use client"

import { type JSX, type ReactNode, useEffect, useMemo, useRef, useState } from "react"

import { useScroll, useSpring } from "motion/react"
import * as m from "motion/react-m"

import { cn } from "~/src/utils"

import { PROGRESS_SPRING } from "~/src/app/[locale]/(landing)/_lib/motion-tokens"

export function NavShell({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
  const [hasScrolled, setHasScrolled] = useState(false)

  const { scrollYProgress } = useScroll()

  const sentinelRef = useRef<HTMLDivElement>(null)
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
          hasScrolled ? "border-border bg-background/72 backdrop-blur-xl" : "border-transparent bg-transparent",
        )}
      >
        {children}

        <m.div aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left bg-ring" style={progressStyle} />
      </header>
    </>
  )
}
