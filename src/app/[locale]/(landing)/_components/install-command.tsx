"use client"

import { type JSX, useMemo, useState } from "react"

import { PACKAGE_MANAGERS, SCAFFOLD_TARGET } from "~/src/app/[locale]/(landing)/_components/cli-choices"
import { CopyButton } from "~/src/app/[locale]/(landing)/_components/copy-button"
import { RunnerTabs } from "~/src/app/[locale]/(landing)/_components/runner-tabs"

const FIRST = 0

/** The command the page is asking the visitor to run, as it stands before anyone picks a runner. */
export const INSTALL_COMMAND = `${PACKAGE_MANAGERS[FIRST].exec} ${SCAFFOLD_TARGET}`

interface InstallCommandProps {
  readonly copiedLabel: string
  readonly copyLabel: string
  readonly runnerLabel: string
}

/**
 * The chrome bar of the product frame, and the page's one genuinely useful control.
 *
 * A landing page that shows you a product should let you start it, so the frame's title bar is
 * the install command with a working copy button rather than three decorative window dots. The
 * button and the runner tabs are shared with the CLI section so both behave identically.
 */
export function InstallCommand({ copiedLabel, copyLabel, runnerLabel }: InstallCommandProps): JSX.Element {
  const [runner, setRunner] = useState<string>(PACKAGE_MANAGERS[FIRST].id)

  const command = useMemo(() => {
    const exec = PACKAGE_MANAGERS.find((manager) => manager.id === runner)?.exec ?? PACKAGE_MANAGERS[FIRST].exec
    return `${exec} ${SCAFFOLD_TARGET}`
  }, [runner])

  return (
    <div>
      <RunnerTabs className="bg-background/40 px-2 py-1.5" label={runnerLabel} onSelect={setRunner} taken={runner} />
      <div className="flex items-center justify-between gap-4 border-b border-border bg-background/40 py-2 pr-2 pl-4">
        <code className="truncate font-mono text-spec text-muted-foreground">
          <span aria-hidden className="mr-2 text-muted-foreground/50 select-none">
            $
          </span>
          {command}
        </code>
        <CopyButton copiedLabel={copiedLabel} copyLabel={copyLabel} value={command} />
      </div>
    </div>
  )
}
