"use client"

import type { JSX } from "react"

import { CopyButton } from "~/src/app/[locale]/(landing)/_components/copy-button"

/** The command the page is asking the visitor to run. Real, and the only one that matters. */
export const INSTALL_COMMAND = "bunx saasyland@latest init"

interface InstallCommandProps {
  readonly copiedLabel: string
  readonly copyLabel: string
}

/**
 * The chrome bar of the product frame, and the page's one genuinely useful control.
 *
 * A landing page that shows you a product should let you start it, so the frame's title bar is
 * the install command with a working copy button rather than three decorative window dots. The
 * button itself is shared with the CLI section so the confirmation is identical in both places.
 */
export function InstallCommand({ copiedLabel, copyLabel }: InstallCommandProps): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border bg-background/40 py-2 pr-2 pl-4">
      <code className="truncate font-mono text-spec text-muted-foreground">
        <span aria-hidden className="mr-2 text-muted-foreground/50 select-none">
          $
        </span>
        {INSTALL_COMMAND}
      </code>
      <CopyButton copiedLabel={copiedLabel} copyLabel={copyLabel} value={INSTALL_COMMAND} />
    </div>
  )
}
