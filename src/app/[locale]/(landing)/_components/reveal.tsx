"use client"

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

import { cn } from "~/src/utils"

const REVEAL_THRESHOLD = 0.12

/**
 * The longest entrance on the page, in milliseconds, and the backstop for `hasSettled`.
 *
 * A block that is already intersecting when it mounts can have both states committed inside one
 * paint, in which case the browser never starts a transition and `transitionend` never fires. That
 * is not a rare case: it is every block above the fold. Without this the entrance is invisible but
 * the `will-change` hint it left behind is permanent, which is a compositor layer held for the life
 * of the page for nothing.
 */
const SETTLE_FALLBACK_MS = 900

type OnReveal = (isVisible: boolean) => void

const observerHolder: { current?: IntersectionObserver } = {}
const observedTargets = new WeakMap<Element, OnReveal>()

function observe(element: Element, onReveal: OnReveal): () => void {
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

/**
 * Which entrance a block gets. The variant is the block's rank, not a taste choice: if every
 * block enters identically, no block enters at all.
 *
 * - `heading` a section's opening statement. The furthest travel, the longest duration.
 * - `block`   a discrete content block underneath an already-revealed heading.
 * - `quiet`   supporting matter. Opacity only, and quick, so it never competes.
 */
type RevealVariant = "block" | "heading" | "quiet"

/** Resting state per variant. */
const SHOWN_CLASSNAME: Record<RevealVariant, string> = {
  block: "translate-y-0 opacity-100",
  heading: "translate-y-0 opacity-100",
  quiet: "opacity-100",
}

/**
 * Pre-entrance state per variant.
 *
 * The travel is 12px and 16px, not the 32px an entrance usually gets. At 32px the block is
 * visibly somewhere else before it is where it belongs, and the eye reads the motion instead of
 * the content. At 12px the block resolves rather than arrives, which is the whole brief.
 */
const HIDDEN_CLASSNAME: Record<RevealVariant, string> = {
  block: "translate-y-3 opacity-0",
  heading: "translate-y-4 opacity-0",
  quiet: "opacity-0",
}

/** Exponential ease-out from an already-visible default; never `linear`, never `ease-in-out`. */
const DURATION_CLASSNAME: Record<RevealVariant, string> = {
  block: "duration-[560ms]",
  heading: "duration-[700ms]",
  quiet: "duration-[420ms]",
}

interface RevealProps {
  readonly children: ReactNode
  readonly className?: string
  /** Transition delay in milliseconds, applied once the block enters the viewport. */
  readonly delay?: number
  /** Entrance rank. Defaults to `block`; see {@link RevealVariant}. */
  readonly variant?: RevealVariant
}

/**
 * The page's one generic scroll entrance. One-shot, IntersectionObserver-driven, never
 * re-triggered, and rationed to about two instances per section: cards, rows and list items ride
 * their section's reveal rather than each earning their own. A page where every element has its
 * own entrance is a page that cannot be read while it is still arriving.
 *
 * Reduced motion renders the final state with no transition at all, so the content is complete
 * and legible without ever having moved.
 */
export function Reveal({ children, className, delay = 0, variant = "block" }: RevealProps): JSX.Element {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasSettled, setHasSettled] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) {
      return
    }
    return observe(element, setIsVisible)
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

  // `transitionend` bubbles, so every hover transition on a button or link inside the block would
  // otherwise report this block's entrance as finished, some of them before it had begun.
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
        "transition-[opacity,transform] ease-exp",
        DURATION_CLASSNAME[variant],
        // will-change is a promise the compositor keeps paying for, so it is made only for the
        // one entrance and dropped the moment it finishes. There are dozens of these on the page
        // and most are viewports below the fold, so promising from first render would reserve a
        // stack of layers that nothing is going to animate for another ten seconds.
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
