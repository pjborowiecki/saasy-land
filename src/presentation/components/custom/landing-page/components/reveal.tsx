import {
  type CSSProperties,
  type JSX,
  type ReactNode,
  type TransitionEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { cn } from "~/src/lib/cn"

const REVEAL_THRESHOLD = 0.12

const SETTLE_FALLBACK_MS = 900

type OnReveal = (isVisible: boolean) => void

const observerHolder: { current?: IntersectionObserver } = {}
const observedTargets = new WeakMap<Element, OnReveal>()

const observe = (element: Element, onReveal: OnReveal): (() => void) => {
  observerHolder.current ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          observedTargets.get(entry.target)?.(true)
          observerHolder.current?.unobserve(entry.target)
        }
      }
    },
    { threshold: REVEAL_THRESHOLD },
  )

  observedTargets.set(element, onReveal)
  observerHolder.current.observe(element)

  return () => {
    observedTargets.delete(element)
    observerHolder.current?.unobserve(element)
  }
}

type RevealVariant = "block" | "heading" | "quiet"

const SHOWN_CLASSNAME: Record<RevealVariant, string> = {
  block: "translate-y-0 opacity-100",
  heading: "translate-y-0 opacity-100",
  quiet: "opacity-100",
}

const HIDDEN_CLASSNAME: Record<RevealVariant, string> = {
  block: "translate-y-3 opacity-0",
  heading: "translate-y-4 opacity-0",
  quiet: "opacity-0",
}

const DURATION_CLASSNAME: Record<RevealVariant, string> = {
  block: "duration-[560ms]",
  heading: "duration-[700ms]",
  quiet: "duration-[420ms]",
}

interface RevealProps {
  readonly children: ReactNode
  readonly className?: string
  readonly delay?: number
  readonly variant?: RevealVariant
}

export const Reveal = ({ children, className, delay = 0, variant = "block" }: RevealProps): JSX.Element => {
  const elementRef = useRef<HTMLDivElement>(null)

  const [isVisible, setIsVisible] = useState(true)
  const [hasSettled, setHasSettled] = useState(true)

  const [isArmed, setIsArmed] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) {
      return
    }
    if (element.getBoundingClientRect().top < globalThis.innerHeight) {
      return
    }

    setIsVisible(false)
    setHasSettled(false)

    const frame = globalThis.requestAnimationFrame(() => {
      setIsArmed(true)
    })
    const unobserve = observe(element, setIsVisible)

    return () => {
      globalThis.cancelAnimationFrame(frame)
      unobserve()
    }
  }, [])

  const delayStyle: CSSProperties | undefined = useMemo(() => (delay > 0 ? { transitionDelay: `${delay}ms` } : undefined), [delay])

  useEffect(() => {
    if (!isVisible || hasSettled) {
      return
    }
    const timeoutId = globalThis.setTimeout(() => {
      setHasSettled(true)
    }, SETTLE_FALLBACK_MS + delay)
    return () => {
      globalThis.clearTimeout(timeoutId)
    }
  }, [delay, hasSettled, isVisible])

  const handleTransitionEnd = useCallback((event: TransitionEvent<HTMLDivElement>): void => {
    if (event.target === elementRef.current) {
      setHasSettled(true)
    }
  }, [])

  return (
    <div
      ref={elementRef}
      style={delayStyle}
      onTransitionEnd={handleTransitionEnd}
      className={cn(
        isArmed ? cn("transition-[opacity,transform] ease-exp", DURATION_CLASSNAME[variant]) : "transition-none",
        isVisible && !hasSettled ? "will-change-[opacity,transform]" : "will-change-auto",
        isVisible ? SHOWN_CLASSNAME[variant] : HIDDEN_CLASSNAME[variant],
        "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none motion-reduce:will-change-auto",
        className,
      )}
    >
      {children}
    </div>
  )
}
