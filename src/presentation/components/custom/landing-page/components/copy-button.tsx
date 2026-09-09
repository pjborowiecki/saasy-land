import { type JSX, useEffect, useState } from "react"

import { Copy } from "lucide-react"
import { AnimatePresence } from "motion/react"
import * as m from "motion/react-m"

import { cn } from "~/src/lib/cn"

import { DRAW, PRESS, SWAP, TAP } from "~/src/presentation/components/custom/landing-page/constants/motion-tokens"

const CONFIRMATION_MS = 2000

const SWAP_HIDDEN = { filter: "blur(4px)", opacity: 0 }
const SWAP_SHOWN = { filter: "blur(0px)", opacity: 1 }

const PATH_UNDRAWN = { pathLength: 0 }
const PATH_DRAWN = { pathLength: 1 }

const CHECK_STROKE = 2.25
const COPY_STROKE = 1.75

const CheckGlyph = (): JSX.Element => (
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

interface CopyButtonProps {
  readonly copiedLabel: string
  readonly copyLabel: string
  readonly value: string
}

export const CopyButton = ({ copiedLabel, copyLabel, value }: CopyButtonProps): JSX.Element => {
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

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value)
      setHasCopied(true)
    } catch {
      // The command remains selectable when clipboard access is denied.
    }
  }

  return (
    <m.button
      aria-label={hasCopied ? copiedLabel : copyLabel}
      className="inline-flex h-7 shrink-0 cursor-pointer items-center justify-center rounded-md px-1.5 text-muted-foreground transition-colors duration-200 ease-exp hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      layout
      onClick={() => void copy()}
      transition={PRESS}
      type="button"
      whileTap={TAP}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <m.span
          animate={SWAP_SHOWN}
          className={cn("flex items-center", hasCopied && "gap-1.5 text-body-sm font-medium text-ring")}
          exit={SWAP_HIDDEN}
          initial={SWAP_HIDDEN}
          key={hasCopied ? "copied" : "copy"}
          layout="position"
          transition={SWAP}
        >
          {hasCopied ? (
            <>
              <CheckGlyph />
              {copiedLabel}
            </>
          ) : (
            <Copy aria-hidden className="size-3.5" strokeWidth={COPY_STROKE} />
          )}
        </m.span>
      </AnimatePresence>
    </m.button>
  )
}
