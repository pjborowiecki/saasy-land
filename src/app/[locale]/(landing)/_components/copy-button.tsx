"use client"

import { type JSX, useCallback, useEffect, useState } from "react"

import { Copy } from "lucide-react"
import { AnimatePresence } from "motion/react"
import * as m from "motion/react-m"

import { DRAW, PRESS, SWAP, TAP } from "~/src/app/[locale]/(landing)/_components/motion-tokens"

/** Long enough to register as an acknowledgement, short enough not to look stuck. */
const CONFIRMATION_MS = 2000

/**
 * Blur, not just opacity.
 *
 * A glyph that only fades looks like it is being deleted; a glyph that defocuses as it goes looks
 * like it is being replaced. Four pixels on a fourteen-pixel icon is far too little to read as an
 * effect and exactly enough to stop the swap looking like a flicker.
 */
const SWAP_HIDDEN = { filter: "blur(4px)", opacity: 0 }
const SWAP_SHOWN = { filter: "blur(0px)", opacity: 1 }

const PATH_UNDRAWN = { pathLength: 0 }
const PATH_DRAWN = { pathLength: 1 }

const CHECK_STROKE = 2.25
const COPY_STROKE = 1.75

/**
 * A tick that draws itself.
 *
 * Lucide's `Check` would fade in whole. This is the same shape as an inline path so `pathLength`
 * can run a stroke along it, which turns the confirmation from a state the button switched to
 * into a mark the button made.
 *
 * Geometrically identical to Lucide's `check`, and at the same `2.25` stroke every other tick on
 * the page uses — the record table, the pricing features, the quality spec. The path is simply
 * written in reverse, from the short arm to the long one, because `pathLength` draws in source
 * order and a tick that starts at its own tail draws backwards.
 */
function CheckGlyph(): JSX.Element {
  return (
    <svg
      aria-hidden
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={CHECK_STROKE}
      viewBox="0 0 24 24"
    >
      <m.path animate={PATH_DRAWN} d="M4 12l5 5L20 6" initial={PATH_UNDRAWN} transition={DRAW} />
    </svg>
  )
}

interface CopyButtonProps {
  readonly copiedLabel: string
  readonly copyLabel: string
  readonly value: string
}

/**
 * The page's copy control, in one place.
 *
 * There are two of these on the landing page — the hero's product frame and the CLI section's
 * command bar — and they were drifting: one crossfaded two stacked icons, the other had been
 * given a spring. A confirmation that behaves differently in two places teaches the visitor
 * nothing, so both now render this.
 *
 * At rest it is a bare glyph. On success it widens to say so, then narrows back. `layout` on the
 * button animates that width rather than snapping it, which is the difference between a control
 * that answers and a control that twitches.
 *
 * Failure stays silent by design. `writeText` rejects on an insecure origin or a denied
 * permission, and the command is visible and selectable right next to the button.
 */
export function CopyButton({ copiedLabel, copyLabel, value }: CopyButtonProps): JSX.Element {
  const [hasCopied, setHasCopied] = useState(false)

  useEffect(() => {
    if (!hasCopied) {
      return
    }
    const timeoutId = globalThis.setTimeout(() => {
      setHasCopied(false)
    }, CONFIRMATION_MS)
    return () => {
      globalThis.clearTimeout(timeoutId)
    }
  }, [hasCopied])

  const handleClick = useCallback((): void => {
    const copy = async (): Promise<void> => {
      try {
        await navigator.clipboard?.writeText(value)
        setHasCopied(true)
      } catch {
        // Intentionally silent; the command next to this button is selectable.
      }
    }
    void copy()
  }, [value])

  return (
    <m.button
      aria-label={hasCopied ? copiedLabel : copyLabel}
      className="inline-flex h-7 shrink-0 cursor-pointer items-center justify-center rounded-md px-1.5 text-muted-foreground transition-colors duration-200 ease-exp hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      layout
      onClick={handleClick}
      transition={PRESS}
      type="button"
      whileTap={TAP}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {hasCopied ? (
          <m.span
            animate={SWAP_SHOWN}
            className="flex items-center gap-1.5 text-body-sm font-medium text-ring"
            exit={SWAP_HIDDEN}
            initial={SWAP_HIDDEN}
            key="copied"
            layout="position"
            transition={SWAP}
          >
            <CheckGlyph />
            {copiedLabel}
          </m.span>
        ) : (
          <m.span
            animate={SWAP_SHOWN}
            className="flex items-center"
            exit={SWAP_HIDDEN}
            initial={SWAP_HIDDEN}
            key="copy"
            layout="position"
            transition={SWAP}
          >
            <Copy aria-hidden className="size-3.5" strokeWidth={COPY_STROKE} />
          </m.span>
        )}
      </AnimatePresence>
    </m.button>
  )
}
