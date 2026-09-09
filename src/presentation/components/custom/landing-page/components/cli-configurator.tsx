import { type JSX, type ReactNode, createContext, use, useCallback, useEffect, useMemo, useState } from "react"

import { AnimatePresence, animate, useMotionValue, useTransform } from "motion/react"
import * as m from "motion/react-m"

import { CLI_CHOICES, CLI_EXTRAS, CLI_MODULES, NONE, PACKAGE_MANAGERS, SCAFFOLD_DIR, SCAFFOLD_TARGET } from "~/src/data/cli"

import { cn } from "~/src/lib/cn"

import { CopyButton } from "~/src/presentation/components/custom/landing-page/components/copy-button"
import { RunnerTabs } from "~/src/presentation/components/custom/landing-page/components/runner-tabs"
import { EXP, EXP_FAST, PRESS, TAP } from "~/src/presentation/components/custom/landing-page/constants/motion-tokens"

interface ConfiguratorState {
  readonly extras: readonly string[]
  readonly select: (choiceId: string, optionId: string) => void
  readonly taken: Readonly<Record<string, string>>
  readonly toggle: (extraId: string) => void
}

type Taken = Readonly<Record<string, string>>

interface ChoiceOption {
  readonly id: string
  readonly unavailableWhen?: Readonly<Record<string, readonly string[]>> | undefined
  readonly visibleWhen?: Readonly<Record<string, readonly string[]>> | undefined
}

const isUnavailable = (option: ChoiceOption, taken: Taken): boolean => {
  const rules = option.unavailableWhen
  if (rules === undefined) {
    return false
  }
  return Object.entries(rules).some(([choiceId, blocked]) => blocked.includes(taken[choiceId] ?? ""))
}

export const isVisible = (option: ChoiceOption, taken: Taken): boolean => {
  const rules = option.visibleWhen
  if (rules === undefined) {
    return true
  }
  return Object.entries(rules).every(([choiceId, allowed]) => allowed.includes(taken[choiceId] ?? ""))
}

const findOption = (choiceId: string, optionId: string | undefined): ChoiceOption | undefined => {
  const choice = CLI_CHOICES.find((entry) => entry.id === choiceId)
  return choice?.options.find((entry) => entry.id === optionId)
}

// Reset choices invalidated by another selection.
const reconcile = (taken: Taken): Taken => {
  const next: Record<string, string> = { ...taken }
  for (const choice of CLI_CHOICES) {
    const current = findOption(choice.id, next[choice.id])
    const isLegal = current !== undefined && isVisible(current, next) && !isUnavailable(current, next)
    if (!isLegal) {
      const fallback: ChoiceOption | undefined = choice.options.find((option) => isVisible(option, next) && !isUnavailable(option, next))
      next[choice.id] = fallback?.id ?? next[choice.id] ?? ""
    }
  }
  return next
}

const ignoreSelection = (): void => {}

const ConfiguratorContext = createContext<ConfiguratorState>({ extras: [], select: ignoreSelection, taken: {}, toggle: ignoreSelection })

interface CliChoiceOptionProps {
  readonly choiceId: string
  readonly label: string
  readonly optionId: string
  readonly unavailableReason?: string | undefined
}

const CHIP_CLASSNAME =
  "inline-flex items-center rounded-md border px-3 py-1.5 text-body-sm transition-colors duration-200 ease-exp focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

export const CliChoiceOption = ({ choiceId, label, optionId, unavailableReason }: CliChoiceOptionProps): JSX.Element | undefined => {
  const { select, taken } = use(ConfiguratorContext)
  const option = findOption(choiceId, optionId)
  const isHidden = option !== undefined && !isVisible(option, taken)
  const isBlocked = option !== undefined && isUnavailable(option, taken)
  const isTaken = !isBlocked && taken[choiceId] === optionId

  if (isHidden) {
    return undefined
  }
  if (isBlocked) {
    return (
      <button
        className={cn(CHIP_CLASSNAME, "cursor-not-allowed border-border/40 text-muted-foreground/40")}
        disabled
        title={unavailableReason}
        type="button"
      >
        <span className="line-through decoration-muted-foreground/30">{label}</span>
      </button>
    )
  }

  return (
    <m.button
      aria-pressed={isTaken}
      className={cn(
        CHIP_CLASSNAME,
        "cursor-pointer",
        isTaken
          ? "border-transparent bg-muted font-medium text-foreground"
          : "border-border text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground",
      )}
      onClick={() => {
        select(choiceId, optionId)
      }}
      transition={PRESS}
      type="button"
      whileTap={TAP}
    >
      {label}
    </m.button>
  )
}

interface CliExtraOptionProps {
  readonly extraId: string
  readonly label: string
  readonly unavailableReason?: string | undefined
}

export const CliExtraOption = ({ extraId, label, unavailableReason }: CliExtraOptionProps): JSX.Element => {
  const { extras, taken, toggle } = use(ConfiguratorContext)
  const extra = CLI_EXTRAS.find((entry) => entry.id === extraId)
  const isBlocked = extra !== undefined && isUnavailable(extra, taken)
  const isOn = !isBlocked && extras.includes(extraId)

  if (isBlocked) {
    return (
      <button
        className={cn(CHIP_CLASSNAME, "cursor-not-allowed border-border/40 text-muted-foreground/40")}
        disabled
        title={unavailableReason}
        type="button"
      >
        <span className="line-through decoration-muted-foreground/30">{label}</span>
      </button>
    )
  }

  return (
    <m.button
      aria-pressed={isOn}
      className={cn(
        CHIP_CLASSNAME,
        "cursor-pointer",
        isOn
          ? "border-transparent bg-muted font-medium text-foreground"
          : "border-border text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground",
      )}
      onClick={() => {
        toggle(extraId)
      }}
      transition={PRESS}
      type="button"
      whileTap={TAP}
    >
      {label}
    </m.button>
  )
}

const PaneLabel = ({ children }: Readonly<{ children: ReactNode }>): JSX.Element => (
  <span className="font-mono text-label text-muted-foreground/70 uppercase">{children}</span>
)

export const CliGroupHeading = ({ label }: Readonly<{ label: string }>): JSX.Element => (
  <div className="bg-muted/25 px-5 py-2 font-mono text-label text-muted-foreground/70 uppercase md:px-7">{label}</div>
)

interface CliChoiceRowProps {
  readonly children: ReactNode
  readonly choiceId: string
  readonly label: string
}

export const CliChoiceRow = ({ children, choiceId, label }: CliChoiceRowProps): JSX.Element | undefined => {
  const { taken } = use(ConfiguratorContext)
  const choice = CLI_CHOICES.find((entry) => entry.id === choiceId)
  if (choice !== undefined && !choice.options.some((option) => isVisible(option, taken))) {
    return undefined
  }

  return (
    <div className="grid gap-x-5 gap-y-3 px-5 py-3.5 md:grid-cols-[7.5rem_1fr] md:items-center md:px-7 md:py-4">
      <dt className="font-mono text-label text-muted-foreground uppercase">{label}</dt>
      <dd className="flex flex-wrap items-center gap-2.5">{children}</dd>
    </div>
  )
}

const LAST_LINE_OFFSET = 1

const ROW_ENTER = { opacity: 0, x: -8 }
const ROW_SETTLED = { opacity: 1, x: 0 }

interface RunCountProps {
  readonly value: number
}

const RunCount = ({ value }: RunCountProps): JSX.Element => {
  const count = useMotionValue(value)
  const rounded = useTransform(count, (current) => String(Math.round(current)))

  useEffect(() => {
    const controls = animate(count, value, EXP)
    return () => {
      controls.stop()
    }
  }, [count, value])

  return <m.span className="font-mono tabular-nums">{rounded}</m.span>
}

interface CliRunProps {
  readonly greenLabel: string
  readonly label: string
  readonly moduleLabel: string
}

const CliRun = ({ greenLabel, label, moduleLabel }: CliRunProps): JSX.Element => {
  const { extras, taken } = use(ConfiguratorContext)

  const modules = useMemo(() => {
    const base = CLI_MODULES.filter((module) => !("choiceId" in module) || taken[module.choiceId] !== NONE).map((module) => module.id)
    const added = CLI_EXTRAS.filter((extra) => extras.includes(extra.id) && !isUnavailable(extra, taken)).map((extra) => extra.module)
    return [...base, ...added]
  }, [extras, taken])

  return (
    <div className="w-full flex-1 px-5 py-6 md:px-7 md:py-7">
      <PaneLabel>{label}</PaneLabel>

      <ul className="mt-4 grid w-fit grid-cols-2 gap-x-14 gap-y-3 font-mono text-spec text-muted-foreground">
        <AnimatePresence initial={false} mode="popLayout">
          {modules.map((name) => (
            // PopLayout needs a direct motion element to measure each exiting row.
            <m.li
              animate={ROW_SETTLED}
              className="flex items-center gap-3"
              exit={ROW_ENTER}
              initial={ROW_ENTER}
              key={name}
              layout
              transition={EXP}
            >
              <span aria-hidden className="text-ring">
                ✓
              </span>
              {name}
            </m.li>
          ))}
        </AnimatePresence>
      </ul>
      <m.p className="mt-8 flex items-center gap-3 border-t border-border pt-6 text-body-sm text-foreground" layout transition={EXP_FAST}>
        <span aria-hidden className="size-1.25 shrink-0 rounded-xs bg-ring" />
        <span>
          <RunCount value={modules.length} /> {moduleLabel} · {greenLabel}
        </span>
      </m.p>
    </div>
  )
}

interface CommandBlockProps {
  readonly copiedLabel: string
  readonly copyLabel: string
  readonly label: string
  readonly lines: readonly string[]
  readonly value: string
}

const CommandBlock = ({ copiedLabel, copyLabel, label, lines, value }: CommandBlockProps): JSX.Element => (
  <div className="flex-1 px-5 py-6 md:px-7 md:py-7">
    <div className="flex items-center justify-between gap-4">
      <PaneLabel>{label}</PaneLabel>
      <CopyButton copiedLabel={copiedLabel} copyLabel={copyLabel} value={value} />
    </div>
    <code className="mt-4 block font-mono text-spec leading-relaxed">
      <span aria-hidden className="mr-2 text-muted-foreground/50 select-none">
        $
      </span>
      {lines.map((line, index) => (
        <span className={cn("whitespace-pre-wrap", index > 0 ? "block pl-6 text-muted-foreground" : "text-foreground")} key={line}>
          {line}
          {index < lines.length - LAST_LINE_OFFSET ? " \\" : ""}
        </span>
      ))}
    </code>
  </div>
)

interface NextBlockProps {
  readonly dev: string
  readonly label: string
}

const NextBlock = ({ dev, label }: NextBlockProps): JSX.Element => (
  <div className="w-full flex-1 px-5 py-6 md:px-7 md:py-7">
    <PaneLabel>{label}</PaneLabel>
    <code className="mt-4 block font-mono text-spec leading-relaxed text-muted-foreground">
      <span className="block">
        <span aria-hidden className="mr-2 text-muted-foreground/50 select-none">
          $
        </span>
        cd {SCAFFOLD_DIR}
      </span>
      <span className="block">
        <span aria-hidden className="mr-2 text-muted-foreground/50 select-none">
          $
        </span>
        {dev}
      </span>
      <span className="mt-2 block text-muted-foreground/60">
        <span aria-hidden className="mr-2 select-none">
          →
        </span>
        http://localhost:3000
      </span>
    </code>
  </div>
)

interface CliConfiguratorProps {
  readonly children: ReactNode
  readonly copiedLabel: string
  readonly copyLabel: string
  readonly commandLabel: string
  readonly footnote: string
  readonly greenLabel: string
  readonly moduleLabel: string
  readonly nextLabel: string
  readonly outputLabel: string
  readonly runnerLabel: string
}

export const CliConfigurator = ({
  children,
  commandLabel,
  copiedLabel,
  copyLabel,
  footnote,
  greenLabel,
  moduleLabel,
  nextLabel,
  outputLabel,
  runnerLabel,
}: CliConfiguratorProps): JSX.Element => {
  const [taken, setTaken] = useState<Record<string, string>>(() =>
    reconcile(Object.fromEntries(CLI_CHOICES.map((choice) => [choice.id, choice.options[0].id]))),
  )
  const [extras, setExtras] = useState<readonly string[]>([])
  const [runner, setRunner] = useState<string>(PACKAGE_MANAGERS[0].id)

  const chosenRunner = PACKAGE_MANAGERS.find((manager) => manager.id === runner) ?? PACKAGE_MANAGERS[0]

  const lines = useMemo(() => {
    const { exec } = chosenRunner
    const flags = CLI_CHOICES.map((choice) => {
      const option = choice.options.find((entry) => entry.id === taken[choice.id])
      return option !== undefined && isVisible(option, taken) ? option.flag : ""
    })
    const added = CLI_EXTRAS.filter((extra) => extras.includes(extra.id) && !isUnavailable(extra, taken)).map((extra) => extra.flag)
    return [`${exec} ${SCAFFOLD_TARGET}`, ...flags.filter((flag) => flag.length > 0), ...added]
  }, [chosenRunner, extras, taken])

  const command = lines.join(" \\\n  ")

  const select = useCallback((choiceId: string, optionId: string): void => {
    setTaken((current) => reconcile({ ...current, [choiceId]: optionId }))
  }, [])

  const toggle = useCallback((extraId: string): void => {
    setExtras((current) => (current.includes(extraId) ? current.filter((id) => id !== extraId) : [...current, extraId]))
  }, [])

  const state = useMemo<ConfiguratorState>(() => ({ extras, select, taken, toggle }), [extras, select, taken, toggle])

  return (
    <ConfiguratorContext value={state}>
      <div className="overflow-hidden rounded-xl border border-border">
        <RunnerTabs className="bg-card px-3 py-2 md:px-5" label={runnerLabel} onSelect={setRunner} taken={runner} />

        <div className="grid divide-y divide-border lg:grid-cols-[1.45fr_1fr] lg:divide-x lg:divide-y-0">
          <dl className="divide-y divide-border">{children}</dl>

          <div className="flex flex-col divide-y divide-border bg-card">
            <CommandBlock copiedLabel={copiedLabel} copyLabel={copyLabel} label={commandLabel} lines={lines} value={command} />
            <CliRun greenLabel={greenLabel} label={outputLabel} moduleLabel={moduleLabel} />
            <NextBlock dev={chosenRunner.dev} label={nextLabel} />
          </div>
        </div>

        <p className="border-t border-border bg-card px-5 py-4 text-body-sm text-pretty text-muted-foreground md:px-7">{footnote}</p>
      </div>
    </ConfiguratorContext>
  )
}
