import { type JSX, useState } from "react"

import { PACKAGE_MANAGERS, SCAFFOLD_TARGET } from "~/src/data/cli"

import { CopyButton } from "~/src/presentation/components/custom/landing-page/components/copy-button"
import { RunnerTabs } from "~/src/presentation/components/custom/landing-page/components/runner-tabs"

interface InstallCommandProps {
  readonly copiedLabel: string
  readonly copyLabel: string
  readonly runnerLabel: string
}

export const InstallCommand = ({ copiedLabel, copyLabel, runnerLabel }: InstallCommandProps): JSX.Element => {
  const [runner, setRunner] = useState<string>(PACKAGE_MANAGERS[0].id)

  const exec = PACKAGE_MANAGERS.find((manager) => manager.id === runner)?.exec ?? PACKAGE_MANAGERS[0].exec
  const command = `${exec} ${SCAFFOLD_TARGET}`

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
