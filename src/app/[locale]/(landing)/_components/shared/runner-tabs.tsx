"use client"

import { type JSX, useCallback } from "react"

import { cn } from "~/src/utils"

import { PACKAGE_MANAGERS } from "~/src/app/[locale]/(landing)/_lib/cli-choices"

interface RunnerTabProps {
  readonly id: string
  readonly isTaken: boolean
  readonly onSelect: (id: string) => void
}

function RunnerTab({ id, isTaken, onSelect }: RunnerTabProps): JSX.Element {
  const handleClick = useCallback((): void => {
    onSelect(id)
  }, [id, onSelect])

  return (
    <button
      aria-selected={isTaken}
      className={cn(
        "cursor-pointer rounded-md px-2.5 py-1 font-mono text-spec transition-colors duration-200 ease-exp focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        isTaken ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
      onClick={handleClick}
      role="tab"
      type="button"
    >
      {id}
    </button>
  )
}

interface RunnerTabsProps {
  readonly className?: string | undefined
  readonly label: string
  readonly onSelect: (id: string) => void
  readonly taken: string
}

/**
 * The runner, above the command rather than inside the matrix.
 *
 * It is not one of the five questions: every other answer changes what gets written, and this one
 * only changes who fetches the writer. Putting it in the matrix would imply a `--package-manager`
 * flag that does not exist, so it sits where the convention already puts it, as tabs on the command.
 *
 * Shared by both frames that print a command, so the control a visitor learns in the hero is the
 * same control they meet again in the configurator.
 */
export function RunnerTabs({ className, label, onSelect, taken }: RunnerTabsProps): JSX.Element {
  return (
    <div aria-label={label} className={cn("flex items-center gap-1 border-b border-border", className)} role="tablist">
      {PACKAGE_MANAGERS.map((runner) => (
        <RunnerTab id={runner.id} isTaken={runner.id === taken} key={runner.id} onSelect={onSelect} />
      ))}
    </div>
  )
}
