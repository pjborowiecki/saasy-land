"use client"

import { type JSX, type ReactNode, createContext, use, useCallback, useEffect, useMemo, useState } from "react"

import { AnimatePresence, animate, useMotionValue, useTransform } from "motion/react"
import * as m from "motion/react-m"

import { cn } from "~/src/utils"

import { CLI_CHOICES, CLI_MODULES, NONE } from "~/src/app/[locale]/(landing)/_components/cli-choices"
import { CopyButton } from "~/src/app/[locale]/(landing)/_components/copy-button"
import { INSTALL_COMMAND } from "~/src/app/[locale]/(landing)/_components/install-command"
import { EXP, EXP_FAST, PRESS, TAP } from "~/src/app/[locale]/(landing)/_components/motion-tokens"

const FIRST = 0

interface ConfiguratorState {
  readonly select: (choiceId: string, optionId: string) => void
  readonly taken: Readonly<Record<string, string>>
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

const ConfiguratorContext = createContext<ConfiguratorState>({ select: ignoreSelection, taken: {} })

interface CliChoiceOptionProps {
  readonly choiceId: string
  readonly label: string
  readonly optionId: string
}

/**
 * One answer, as a control.
 *
 * The accent square is present in both states and only changes colour, and the taken chip carries
 * a transparent border to pay for the one the untaken chip draws, so taking an option cannot move
 * the option beside it. A configurator whose row shifts two pixels on every click feels broken long
 * before anyone works out why.
 */
export function CliChoiceOption({ choiceId, label, optionId }: CliChoiceOptionProps): JSX.Element {
  const { select, taken } = use(ConfiguratorContext)
  const isTaken = taken[choiceId] === optionId

  const handleClick = useCallback((): void => {
    select(choiceId, optionId)
  }, [choiceId, optionId, select])

  return (
    <m.button
      aria-pressed={isTaken}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-1.5 text-body-sm transition-colors duration-200 ease-exp focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        isTaken
          ? "border-transparent bg-muted font-medium text-foreground"
          : "border-border text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground",
      )}
      onClick={handleClick}
      transition={PRESS}
      type="button"
      whileTap={TAP}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.25 shrink-0 rounded-xs transition-colors duration-200 ease-exp",
          isTaken ? "bg-ring" : "bg-muted-foreground/35",
        )}
      />
      {label}
    </m.button>
  )
}

interface CliChoiceRowProps {
  readonly children: ReactNode
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
export function CliChoiceRow({ children, label }: CliChoiceRowProps): JSX.Element {
  return (
    <div className="grid gap-x-8 gap-y-3 px-5 py-4 md:grid-cols-[11rem_1fr] md:items-center md:px-7 md:py-5">
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
function CliRun({ greenLabel, moduleLabel }: CliRunProps): JSX.Element {
  const { taken } = use(ConfiguratorContext)

  const modules = useMemo(
    () => CLI_MODULES.filter((module) => !("choiceId" in module) || taken[module.choiceId] !== NONE).map((module) => module.id),
    [taken],
  )

  return (
    <div className="w-full px-5 py-7 md:px-7 md:py-8">
      {/* `w-fit`: two columns of eight-character words stretched across the cell read as two
          unrelated lists. Hugged together they read as one printed block, which is what they are.
          No `key` on the list any more — re-keying it would remount the rows and throw away the
          layout animation that is the whole point. */}
      <ul className="grid w-fit grid-cols-2 gap-x-14 gap-y-3.5 font-mono text-spec text-muted-foreground">
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
      <m.p className="mt-7 flex items-center gap-3 border-t border-border pt-6 text-body-sm text-foreground" layout transition={EXP_FAST}>
        <span aria-hidden className="size-1.25 shrink-0 rounded-xs bg-ring" />
        <span>
          <RunCount value={modules.length} /> {moduleLabel} · {greenLabel}
        </span>
      </m.p>
    </div>
  )
}

interface CliConfiguratorProps {
  readonly children: ReactNode
  readonly copiedLabel: string
  readonly copyLabel: string
  readonly footnote: string
  readonly greenLabel: string
  readonly moduleLabel: string
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
  copiedLabel,
  copyLabel,
  footnote,
  greenLabel,
  moduleLabel,
}: CliConfiguratorProps): JSX.Element {
  const [taken, setTaken] = useState<Record<string, string>>(() =>
    Object.fromEntries(CLI_CHOICES.map((choice) => [choice.id, choice.options[FIRST].id])),
  )

  const command = useMemo(() => {
    const flags = CLI_CHOICES.map((choice) => choice.options.find((option) => option.id === taken[choice.id])?.flag ?? "")
    return [INSTALL_COMMAND, ...flags.filter((flag) => flag.length > 0)].join(" ")
  }, [taken])

  const select = useCallback((choiceId: string, optionId: string): void => {
    setTaken((current) => ({ ...current, [choiceId]: optionId }))
  }, [])

  const state = useMemo<ConfiguratorState>(() => ({ select, taken }), [select, taken])

  return (
    <ConfiguratorContext value={state}>
      <div className="overflow-hidden rounded-xl border border-border">
        {/* The command heads the frame, so everything below reads as its arguments and its output
            rather than as a feature table. It scrolls rather than wraps: a bar that changed height
            as flags were added would shift the whole exhibit on every click. */}
        <div className="flex items-center gap-4 border-b border-border bg-card py-2.5 pr-2.5 pl-5 md:pl-7">
          <code className="min-w-0 flex-1 overflow-x-auto font-mono text-spec whitespace-nowrap text-muted-foreground">
            <span aria-hidden className="mr-2 text-muted-foreground/50 select-none">
              $
            </span>
            {command}
          </code>
          <CopyButton copiedLabel={copiedLabel} copyLabel={copyLabel} value={command} />
        </div>

        {/* Not an even split. The matrix has to hold a question with four answers on one line, and
            the run is a short column of eight-character words — an even split starved the half
            that had content and padded the half that did not. */}
        <div className="grid divide-y divide-border lg:grid-cols-[1.4fr_1fr] lg:divide-x lg:divide-y-0">
          <dl className="divide-y divide-border">{children}</dl>

          {/* Centred, because the run is shorter than the matrix and gets shorter still as
              capabilities are switched off: the leftover height belongs to the cell. */}
          <div className="flex items-center bg-card">
            <CliRun greenLabel={greenLabel} moduleLabel={moduleLabel} />
          </div>
        </div>

        <p className="border-t border-border bg-card px-5 py-4 text-body-sm text-pretty text-muted-foreground md:px-7">{footnote}</p>
      </div>
    </ConfiguratorContext>
  )
}
