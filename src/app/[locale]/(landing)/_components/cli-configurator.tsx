"use client"

import { type JSX, type ReactNode, createContext, use, useCallback, useEffect, useMemo, useState } from "react"

import { AnimatePresence, animate, useMotionValue, useTransform } from "motion/react"
import * as m from "motion/react-m"

import { cn } from "~/src/utils"

import {
  CLI_CHOICES,
  CLI_EXTRAS,
  CLI_MODULES,
  NONE,
  PACKAGE_MANAGERS,
  SCAFFOLD_DIR,
  SCAFFOLD_TARGET,
} from "~/src/app/[locale]/(landing)/_components/cli-choices"
import { CopyButton } from "~/src/app/[locale]/(landing)/_components/copy-button"
import { EXP, EXP_FAST, PRESS, TAP } from "~/src/app/[locale]/(landing)/_components/motion-tokens"
import { RunnerTabs } from "~/src/app/[locale]/(landing)/_components/runner-tabs"

const FIRST = 0
const ONE = 1

interface ConfiguratorState {
  readonly extras: readonly string[]
  readonly select: (choiceId: string, optionId: string) => void
  readonly taken: Readonly<Record<string, string>>
  readonly toggle: (extraId: string) => void
}

type Taken = Readonly<Record<string, string>>

/**
 * Whether an answer is ruled out by an answer given elsewhere.
 *
 * Only SQLite declares one today: Vercel has no persistent filesystem and no D1 binding, so the
 * pairing is not a preference the scaffold could honour. The rule lives on the option rather than
 * in this function so a new constraint is a data change.
 */
interface ChoiceOption {
  readonly id: string
  readonly unavailableWhen?: Readonly<Record<string, readonly string[]>> | undefined
  readonly visibleWhen?: Readonly<Record<string, readonly string[]>> | undefined
}

function isUnavailable(option: ChoiceOption, taken: Taken): boolean {
  const rules = option.unavailableWhen
  if (rules === undefined) {
    return false
  }
  return Object.entries(rules).some(([choiceId, blocked]) => blocked.includes(taken[choiceId] ?? ""))
}

/** Options for the other engine are absent rather than struck through: four crossed-out chips is noise. */
export function isVisible(option: ChoiceOption, taken: Taken): boolean {
  const rules = option.visibleWhen
  if (rules === undefined) {
    return true
  }
  return Object.entries(rules).every(([choiceId, allowed]) => allowed.includes(taken[choiceId] ?? ""))
}

function findOption(choiceId: string, optionId: string | undefined): ChoiceOption | undefined {
  const choice = CLI_CHOICES.find((entry) => entry.id === choiceId)
  return choice?.options.find((entry) => entry.id === optionId)
}

/** After any answer changes, move every selection that the change just invalidated to its first legal option. */
function reconcile(taken: Taken): Taken {
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

/**
 * The answers, shared down.
 *
 * Context rather than props because the rows are composed by the Server Component that owns the
 * translations: it hands this component finished markup as children, and children cannot be given
 * state from the client boundary they are passed through. The default is inert rather than null so
 * an option rendered outside the frame is a dead button instead of a thrown render.
 */
function ignoreSelection(): void {
  // The inert default. See above: an option outside the frame is a dead button, not a crash.
}

const ConfiguratorContext = createContext<ConfiguratorState>({ extras: [], select: ignoreSelection, taken: {}, toggle: ignoreSelection })

interface CliChoiceOptionProps {
  readonly choiceId: string
  readonly label: string
  readonly optionId: string
  /** Shown when the answer is ruled out, so the visitor learns the constraint rather than a dead click. */
  readonly unavailableReason?: string | undefined
}

/**
 * One answer, as a control.
 *
 * The accent square is present in both states and only changes colour, and the taken chip carries
 * a transparent border to pay for the one the untaken chip draws, so taking an option cannot move
 * the option beside it. A configurator whose row shifts two pixels on every click feels broken long
 * before anyone works out why.
 */
const CHIP_CLASSNAME =
  "inline-flex items-center rounded-md border px-3 py-1.5 text-body-sm transition-colors duration-200 ease-exp focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

export function CliChoiceOption({ choiceId, label, optionId, unavailableReason }: CliChoiceOptionProps): JSX.Element | undefined {
  const { select, taken } = use(ConfiguratorContext)
  const option = findOption(choiceId, optionId)
  const isHidden = option !== undefined && !isVisible(option, taken)
  const isBlocked = option !== undefined && isUnavailable(option, taken)
  const isTaken = !isBlocked && taken[choiceId] === optionId

  const handleClick = useCallback((): void => {
    select(choiceId, optionId)
  }, [choiceId, optionId, select])

  if (isHidden) {
    return undefined
  }

  // A ruled-out answer is a plain disabled button: it has no press to animate, and motion's
  // optional props reject an explicit `undefined` under `exactOptionalPropertyTypes`.
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
      onClick={handleClick}
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

/**
 * One feature, on or off.
 *
 * Same chip as an answer above, because it does the same job for the visitor, but it toggles: a
 * store and a course platform are not alternatives. Ruled out reads exactly as it does above, so
 * the reason a chip is dead is learned in one place rather than two.
 */
export function CliExtraOption({ extraId, label, unavailableReason }: CliExtraOptionProps): JSX.Element {
  const { extras, taken, toggle } = use(ConfiguratorContext)
  const extra = CLI_EXTRAS.find((entry) => entry.id === extraId)
  const isBlocked = extra !== undefined && isUnavailable(extra, taken)
  const isOn = !isBlocked && extras.includes(extraId)

  const handleClick = useCallback((): void => {
    toggle(extraId)
  }, [extraId, toggle])

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
      onClick={handleClick}
      transition={PRESS}
      type="button"
      whileTap={TAP}
    >
      {label}
    </m.button>
  )
}

/** The heading each of the three right-hand panes carries, so they read as one transcript. */
function PaneLabel({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
  return <span className="font-mono text-label text-muted-foreground/70 uppercase">{children}</span>
}

/** A band naming what the questions below it decide, so twelve rows read as three decisions. */
export function CliGroupHeading({ label }: Readonly<{ label: string }>): JSX.Element {
  return <div className="bg-muted/25 px-5 py-2 font-mono text-label text-muted-foreground/70 uppercase md:px-7">{label}</div>
}

interface CliChoiceRowProps {
  readonly children: ReactNode
  readonly choiceId: string
  readonly label: string
}

/**
 * One question and both of its answers.
 *
 * Both are always printed, and the taken one is marked rather than being the only one shown. That
 * is the whole point of the section: the value is not that this project uses Stripe, it is that
 * Stripe was a choice and the other answer writes a different repository. Hiding the road not
 * taken would turn a configurator back into a template.
 */
export function CliChoiceRow({ children, choiceId, label }: CliChoiceRowProps): JSX.Element | undefined {
  const { taken } = use(ConfiguratorContext)
  const choice = CLI_CHOICES.find((entry) => entry.id === choiceId)

  // Every answer hidden means the question does not apply, and a label with nothing beside it
  // reads as a bug. The options hide themselves; only the row knows they all did.
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

/** Travel, not distance. Eight pixels reads as "arrived from the left" without being a slide. */
const ROW_ENTER = { opacity: 0, x: -8 }
const ROW_SETTLED = { opacity: 1, x: 0 }

interface RunCountProps {
  readonly value: number
}

/**
 * The module count, counted rather than swapped.
 *
 * A figure that cuts from 10 to 8 is a re-render; a figure that travels through 9 is the tool
 * doing something. The value lives in a motion value and never in React state, so the digits
 * update outside the render cycle — a `setState` per frame would re-render this whole half of
 * the exhibit sixty times a second to move one glyph.
 */
function RunCount({ value }: RunCountProps): JSX.Element {
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

/**
 * THE RUN — what the answers on the left actually write.
 *
 * This half was a rendered video until the matrix beside it became a working control, and then it
 * could not stay one: a run declaring `✓ billing` next to a matrix set to `Billing: None` is worse
 * than no run at all, because it tells the visitor the exhibit is a picture of a product rather
 * than the product. Turning an answer off now removes the module and drops the count, which is the
 * section's entire claim performed instead of asserted.
 *
 * Re-keyed on the module set so the browser replays the stagger from the top on every change: the
 * output visibly re-runs, the way it would in a terminal.
 */
function CliRun({ greenLabel, label, moduleLabel }: CliRunProps): JSX.Element {
  const { extras, taken } = use(ConfiguratorContext)

  const modules = useMemo(() => {
    const base = CLI_MODULES.filter((module) => !("choiceId" in module) || taken[module.choiceId] !== NONE).map((module) => module.id)
    const added = CLI_EXTRAS.filter((extra) => extras.includes(extra.id) && !isUnavailable(extra, taken)).map((extra) => extra.module)
    return [...base, ...added]
  }, [extras, taken])

  return (
    <div className="w-full flex-1 px-5 py-6 md:px-7 md:py-7">
      <PaneLabel>{label}</PaneLabel>
      {/* `w-fit`: two columns of eight-character words stretched across the cell read as two
          unrelated lists. Hugged together they read as one printed block, which is what they are.
          No `key` on the list — re-keying it would remount the rows and throw away the layout
          animation that is the whole point. */}
      <ul className="mt-4 grid w-fit grid-cols-2 gap-x-14 gap-y-3 font-mono text-spec text-muted-foreground">
        {/* `popLayout` takes the leaving row out of flow immediately, so the rows below it start
            travelling while it is still fading rather than after. `initial={false}` because the
            card already arrives under `Reveal`; animating both would be two entrances. */}
        <AnimatePresence initial={false} mode="popLayout">
          {modules.map((name) => (
            // Inline, not extracted. `popLayout` attaches a ref to its direct child to measure it
            // and take it out of flow; a plain wrapper component swallows that ref and the pop
            // silently degrades to a fade followed by a jump.
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

/**
 * The command, printed the way a command this long is actually written: the invocation on the
 * first line in full strength, one flag per continuation beneath it in the muted tone the matrix
 * uses. The eye reads the shape as "this program, these answers" before it reads a single word.
 */
function CommandBlock({ copiedLabel, copyLabel, label, lines, value }: CommandBlockProps): JSX.Element {
  return (
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
          <span className={cn("whitespace-pre-wrap", index > FIRST ? "block pl-6 text-muted-foreground" : "text-foreground")} key={line}>
            {line}
            {index < lines.length - ONE ? " \\" : ""}
          </span>
        ))}
      </code>
    </div>
  )
}

interface NextBlockProps {
  readonly dev: string
  readonly label: string
}

/**
 * The two commands after the one the section is selling.
 *
 * Here because the exhibit was making a claim it stopped one step short of proving: a scaffold is
 * only worth a landing page if what it wrote runs. Two lines and a URL is the whole distance from
 * the copied command to a browser tab, and printing them is cheaper than a paragraph promising it.
 * The dev command follows the runner tabs, so a visitor on npm is never shown `bun dev`.
 */
function NextBlock({ dev, label }: NextBlockProps): JSX.Element {
  return (
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
}

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

/**
 * THE CONFIGURATOR — the CLI section's one exhibit, and the page's second working control.
 *
 * The claim is that the scaffold is a tool rather than a template, and the cheapest way to prove a
 * tool is to hand someone the handle. So the answers are buttons, the command in the frame's header
 * is assembled from whatever is currently taken, and the copy button returns a string that runs. A
 * visitor who switches tenancy and watches `--tenancy multi` become `--tenancy single` has been
 * shown the thing the paragraph above only asserts.
 *
 * The command is the state, not a caption on it: there is no separate "your configuration" readout
 * to fall out of sync, and nothing on screen that the copied string does not say.
 */
export function CliConfigurator({
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
}: CliConfiguratorProps): JSX.Element {
  const [taken, setTaken] = useState<Record<string, string>>(() =>
    Object.fromEntries(CLI_CHOICES.map((choice) => [choice.id, choice.options[FIRST].id])),
  )
  const [extras, setExtras] = useState<readonly string[]>([])
  const [runner, setRunner] = useState<string>(PACKAGE_MANAGERS[FIRST].id)

  const chosenRunner = useMemo(() => PACKAGE_MANAGERS.find((manager) => manager.id === runner) ?? PACKAGE_MANAGERS[FIRST], [runner])

  const lines = useMemo(() => {
    const { exec } = chosenRunner
    const flags = CLI_CHOICES.map((choice) => {
      const option = choice.options.find((entry) => entry.id === taken[choice.id])
      // A question the matrix is not asking cannot contribute a flag, or copying the command
      // under Monolith would hand over an `--api` the scaffold has nothing to do with.
      return option !== undefined && isVisible(option, taken) ? option.flag : ""
    })
    // Extras a rule has since ruled out drop off the command rather than being silently kept:
    // the string on screen is the string that runs, or the exhibit is lying about itself.
    const added = CLI_EXTRAS.filter((extra) => extras.includes(extra.id) && !isUnavailable(extra, taken)).map((extra) => extra.flag)
    return [`${exec} ${SCAFFOLD_TARGET}`, ...flags.filter((flag) => flag.length > 0), ...added]
  }, [chosenRunner, extras, taken])

  /** What the clipboard gets: a real multi-line invocation, continuations and all. */
  const command = useMemo(() => lines.join(" \\\n  "), [lines])

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

        {/* The command sits beside the matrix rather than above it, because twelve flags on one
            line needed a horizontal scrollbar, and a scrollbar on the one string the section wants
            you to take is the worst place on the page to put one. Two labelled panes reading top
            down: what you would type, then what typing it writes. */}
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
