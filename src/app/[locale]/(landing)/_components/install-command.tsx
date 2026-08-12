"use client"

import { type JSX, useCallback, useEffect, useState } from "react"

import { Check, Copy } from "lucide-react"

import { cn } from "~/src/utils"

/** The command the page is asking the visitor to run. Real, and the only one that matters. */
export const INSTALL_COMMAND = "bunx saasyland@latest init"

/** Long enough to register as an acknowledgement, short enough not to look stuck. */
const CONFIRMATION_MS = 2000

interface InstallCommandProps {
  readonly copiedLabel: string
  readonly copyLabel: string
}

/**
 * The chrome bar of the product frame, and the page's one genuinely useful control.
 *
 * A landing page that shows you a product should let you start it, so the frame's title bar is
 * the install command with a copy button rather than three decorative window dots. The button
 * swaps its glyph for a tick on success, which is the whole feedback cycle: no toast, no
 * sound, no animation beyond the 200ms colour change.
 *
 * Failure is silent by design. `navigator.clipboard` rejects on an insecure origin or a denied
 * permission, and there is nothing useful to tell someone in that case that the visible,
 * selectable command text next to the button does not already solve.
 */
export function InstallCommand({ copiedLabel, copyLabel }: InstallCommandProps): JSX.Element {
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

  const copy = useCallback(async (): Promise<void> => {
    try {
      await navigator.clipboard?.writeText(INSTALL_COMMAND)
      setHasCopied(true)
    } catch {
      // `writeText` rejects on an insecure origin or a denied permission. There is nothing
      // useful to say in that case that the visible, selectable command text does not already
      // solve, so the failure is silent.
    }
  }, [])

  const handleCopy = useCallback((): void => {
    void copy()
  }, [copy])

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border bg-background/40 py-2 pr-2 pl-4">
      <code className="truncate font-mono text-spec text-muted-foreground">
        <span aria-hidden className="mr-2 text-muted-foreground/50 select-none">
          $
        </span>
        {INSTALL_COMMAND}
      </code>
      <button
        aria-label={hasCopied ? copiedLabel : copyLabel}
        className="relative inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 ease-exp hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        onClick={handleCopy}
        type="button"
      >
        <Check
          aria-hidden
          className={cn("absolute size-3.5 text-ring transition-opacity duration-200 ease-exp", hasCopied ? "opacity-100" : "opacity-0")}
          strokeWidth={2}
        />
        <Copy
          aria-hidden
          className={cn("size-3.5 transition-opacity duration-200 ease-exp", hasCopied ? "opacity-0" : "opacity-100")}
          strokeWidth={1.75}
        />
      </button>
    </div>
  )
}
