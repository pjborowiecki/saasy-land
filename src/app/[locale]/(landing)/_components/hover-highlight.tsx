"use client"

import { type JSX, type ReactNode, createContext, use, useCallback, useMemo, useState } from "react"

import { AnimatePresence } from "motion/react"
import * as m from "motion/react-m"

import { cn } from "~/src/utils"

import { PRESS } from "~/src/app/[locale]/(landing)/_components/motion-tokens"

const HIDDEN = { opacity: 0 }
const SHOWN = { opacity: 1 }

interface HighlightState {
  /**
   * Optional rather than `string | null`, and cleared by calling with no argument.
   *
   * The repo bans `null` literals and also bans passing a literal `undefined`, so neither empty
   * value can be written down. An optional parameter is the one shape that satisfies both, and
   * the explicit `| undefined` is what `exactOptionalPropertyTypes` needs to accept the state.
   */
  readonly hovered?: string | undefined
  readonly name: string
  readonly setHovered: (id?: string) => void
}

function ignoreHover(): void {
  // Inert default, so an item rendered outside a group is inert rather than a thrown render.
}

const HighlightContext = createContext<HighlightState>({ name: "", setHovered: ignoreHover })

interface HighlightGroupProps {
  readonly children: ReactNode
  readonly className: string
  /** `dl` where the items are a description list; the page has three of those and one plain grid. */
  readonly element?: "div" | "dl"
  /** Unique per group. Two groups sharing a name would fight over a single highlight. */
  readonly name: string
}

/**
 * A set of cells that share one lit ground.
 *
 * The effect this exists for is not "each cell lights on hover" — that is a CSS `:hover` and
 * needs none of this. It is that the lit ground is a *single object* which leaves the cell you
 * left and arrives at the cell you entered, travelling the distance between them. Motion does
 * that with `layoutId`: the element unmounts from one parent, mounts into another, and the
 * projection between the two measured positions is animated. Per-cell transitions cannot express
 * it, because they can only fade one thing out while a different thing fades in.
 *
 * Hover state lives in the group rather than the cells because no cell can know it should give
 * the mark up unless something above it knows where the mark went.
 */
export function HighlightGroup({ children, className, element = "div", name }: HighlightGroupProps): JSX.Element {
  const [hovered, setHovered] = useState<string>()
  const select = useCallback((id?: string): void => {
    setHovered(id)
  }, [])
  const clear = useCallback((): void => {
    select()
  }, [select])
  const state = useMemo<HighlightState>(() => ({ hovered, name, setHovered: select }), [hovered, name, select])

  return (
    <HighlightContext value={state}>
      {/*
       * The pointer handler sits on a plain wrapper, never on the `dl`.
       *
       * A description list carries the `list` role, and jsx-a11y rightly refuses mouse handlers on
       * non-interactive roles. The wrapper is roleless and layout-neutral — every grid, divide and
       * negative margin stays on the list itself — so the semantics and the geometry both survive.
       */}
      {element === "dl" ? (
        <div onMouseLeave={clear}>
          <dl className={className}>{children}</dl>
        </div>
      ) : (
        <div className={className} onMouseLeave={clear}>
          {children}
        </div>
      )}
    </HighlightContext>
  )
}

interface HighlightItemProps {
  readonly children: ReactNode
  /** The outer shell: background, grid spans, `group` for any CSS that keys off this cell. */
  readonly className?: string
  /** The inner, positioned wrapper: padding and internal layout. */
  readonly contentClassName?: string
  readonly id: string
}

/**
 * One cell in a highlight group.
 *
 * TWO THINGS HERE LOOK LIKE FUSS AND ARE LOAD BEARING.
 *
 * The lit cell is raised to `z-10`. Where cells are opaque — and some are, because a 1px lattice
 * is the container's background showing through the gaps — they are siblings, so paint order is
 * DOM order. Without the raise, a highlight travelling backwards would be drawn by the cell it is
 * arriving at and painted over by the cell it is leaving, and the mark would disappear for
 * exactly the length of the journey.
 *
 * The children sit in their own positioned wrapper. An absolutely positioned element paints above
 * static siblings wherever it appears in the source, so without that wrapper the ground would
 * cover the copy instead of sitting under it.
 */
export function HighlightItem({ children, className, contentClassName, id }: HighlightItemProps): JSX.Element {
  const { hovered, name, setHovered } = use(HighlightContext)
  const isLit = hovered === id

  const handleEnter = useCallback((): void => {
    setHovered(id)
  }, [id, setHovered])

  return (
    <div className={cn("relative", isLit && "z-10", className)} onMouseEnter={handleEnter}>
      <AnimatePresence>
        {isLit ? (
          <m.div
            animate={SHOWN}
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-muted/45"
            exit={HIDDEN}
            initial={HIDDEN}
            key={name}
            layoutId={name}
            transition={PRESS}
          />
        ) : undefined}
      </AnimatePresence>
      <div className={cn("relative", contentClassName)}>{children}</div>
    </div>
  )
}
