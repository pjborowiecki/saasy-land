"use client"

import { type JSX, type ReactNode, createContext, use, useCallback, useMemo, useState } from "react"

import { AnimatePresence } from "motion/react"
import * as m from "motion/react-m"

import { cn } from "~/src/utils"

import { ConceptLoop } from "~/src/app/[locale]/(landing)/_components/concept-loop"
import { PRESS } from "~/src/app/[locale]/(landing)/_components/motion-tokens"

/**
 * One highlight for the whole lattice, identified by name.
 *
 * `layoutId` is what makes this worth doing. The lit ground is not four grounds fading in and out
 * of four cells; it is a single element that unmounts from the cell you left and mounts into the
 * cell you entered, and Motion animates the gap between those two positions. The eye reads that
 * as one object travelling, which is the effect, and it is impossible to fake with per-cell
 * transitions — those can only fade one out while another fades in.
 */
const HIGHLIGHT_ID = "line-station-highlight"

const HIDDEN = { opacity: 0 }
const SHOWN = { opacity: 1 }

interface StationGridState {
  /**
   * Optional rather than `string | null`, and cleared by calling with no argument.
   *
   * The repo bans `null` literals and also bans passing a literal `undefined`, so neither empty
   * value can be written down. An optional parameter is the one shape that satisfies both, and
   * the explicit `| undefined` is what `exactOptionalPropertyTypes` needs to accept the state.
   */
  readonly hovered?: string | undefined
  readonly setHovered: (id?: string) => void
}

function ignoreHover(): void {
  // Inert default, so a cell rendered outside the grid is inert rather than a thrown render.
}

const StationGridContext = createContext<StationGridState>({ setHovered: ignoreHover })

interface StationGridProps {
  readonly children: ReactNode
}

/**
 * The four-cell lattice.
 *
 * Hover state lives here rather than in each cell because the highlight is shared: a cell cannot
 * know it should give the mark up unless something above it knows where the mark went.
 */
export function StationGrid({ children }: StationGridProps): JSX.Element {
  const [hovered, setHovered] = useState<string>()
  const select = useCallback((id?: string): void => {
    setHovered(id)
  }, [])
  const clear = useCallback((): void => {
    select()
  }, [select])
  const state = useMemo<StationGridState>(() => ({ hovered, setHovered: select }), [hovered, select])

  return (
    <StationGridContext value={state}>
      {/* `overflow-hidden` stays: the highlight only ever travels between cells inside this box,
          so nothing it does needs to escape, and the rounded corners still need clipping. */}
      <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-2" onMouseLeave={clear}>
        {children}
      </div>
    </StationGridContext>
  )
}

interface SpecChipProps {
  readonly label: string
}

function SpecChip({ label }: SpecChipProps): JSX.Element {
  return (
    <p className="mt-auto flex items-center gap-2.5 pt-8">
      <span aria-hidden className="size-1.25 shrink-0 rounded-xs bg-ring" />
      <span className="font-mono text-spec text-foreground">{label}</span>
    </p>
  )
}

interface StationCellProps {
  readonly body: string
  readonly id: string
  readonly loop: string
  readonly offsetSeconds: number
  readonly spec: string
  readonly title: string
}

/**
 * One station.
 *
 * TWO THINGS HERE ARE LOAD BEARING AND LOOK LIKE FUSS.
 *
 * The lit cell is raised to `z-10`. Cells are opaque — they have to be, because the 1px lattice
 * between them is the container's background showing through the gaps — and they are siblings, so
 * paint order is DOM order. Without the raise, a highlight travelling right-to-left would be
 * drawn by the cell it is arriving at and then painted over by the cell it is leaving, and the
 * mark would vanish for exactly the length of the journey.
 *
 * The content sits in its own positioned wrapper. An absolutely positioned element paints above
 * static siblings no matter where it appears in the source, so without a positioned wrapper the
 * ground would cover the copy instead of sitting under it.
 */
export function StationCell({ body, id, loop, offsetSeconds, spec, title }: StationCellProps): JSX.Element {
  const { hovered, setHovered } = use(StationGridContext)
  const isLit = hovered === id

  const handleEnter = useCallback((): void => {
    setHovered(id)
  }, [id, setHovered])

  return (
    <div className={cn("relative bg-background", isLit && "z-10")} onMouseEnter={handleEnter}>
      <AnimatePresence>
        {isLit ? (
          <m.div
            animate={SHOWN}
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-muted/45"
            exit={HIDDEN}
            initial={HIDDEN}
            key={HIGHLIGHT_ID}
            layoutId={HIGHLIGHT_ID}
            transition={PRESS}
          />
        ) : undefined}
      </AnimatePresence>

      <div className="relative flex h-full flex-col p-7 md:p-10">
        <h3 className="text-headline-support text-balance text-foreground">{title}</h3>
        <p
          className={cn(
            "mt-4 max-w-[44ch] text-body text-pretty transition-colors duration-400 ease-exp",
            isLit ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {body}
        </p>
        <SpecChip label={spec} />
        <ConceptLoop className="mt-7 max-sm:hidden md:mt-9" name={loop} offsetSeconds={offsetSeconds} />
      </div>
    </div>
  )
}
