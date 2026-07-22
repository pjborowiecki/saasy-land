"use client"

import { createContext, use, useMemo, type ComponentProps, type CSSProperties, type ReactNode } from "react"

import {
  Label as LabelPrimitive,
  ProgressBar as ProgressPrimitive,
  type LabelProps,
  type ProgressBarProps as ProgressPrimitiveProps,
} from "react-aria-components"

import { cn } from "~/src/presentation/utils"

const PROGRESS_FULL_PERCENT = 100
const PROGRESS_WIDTH_STEPS = 101

const PROGRESS_WIDTH_STYLES: Record<number, CSSProperties> = Object.fromEntries(
  Array.from({ length: PROGRESS_WIDTH_STEPS }, (_, percentage) => [percentage, { width: `${String(percentage)}%` }]),
)

interface ProgressContextValue {
  isIndeterminate: boolean
  percentage?: number
  valueText?: string
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined)

function useProgress(): ProgressContextValue {
  const context = use(ProgressContext)

  if (context === undefined) {
    throw new Error("useProgress must be used within a Progress.")
  }

  return context
}

function ProgressContent({
  children,
  isIndeterminate,
  percentage,
  valueText,
}: ProgressContextValue & {
  children?: ReactNode
}) {
  const context = useMemo(
    () => ({
      isIndeterminate,
      ...(percentage === undefined ? {} : { percentage }),
      ...(valueText === undefined ? {} : { valueText }),
    }),
    [isIndeterminate, percentage, valueText],
  )

  return (
    <ProgressContext value={context}>
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressContext>
  )
}

function Progress({
  children,
  className,
  ...props
}: Omit<ProgressPrimitiveProps, "children" | "className"> & {
  children?: ReactNode
  className?: string
}) {
  return (
    <ProgressPrimitive className={cn("flex flex-wrap gap-3", className)} data-slot="progress" {...props}>
      {({ isIndeterminate, percentage, valueText }) => (
        <ProgressContent
          isIndeterminate={isIndeterminate}
          {...(percentage === undefined ? {} : { percentage })}
          {...(valueText === undefined ? {} : { valueText })}
        >
          {children}
        </ProgressContent>
      )}
    </ProgressPrimitive>
  )
}

function ProgressTrack({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn("relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted", className)}
      data-slot="progress-track"
      {...props}
    />
  )
}

function ProgressIndicator({ className, ...props }: Omit<ComponentProps<"span">, "style">) {
  const { isIndeterminate, percentage } = useProgress()
  const widthPercent = isIndeterminate ? PROGRESS_FULL_PERCENT : Math.min(PROGRESS_FULL_PERCENT, Math.max(0, Math.round(percentage ?? 0)))

  return (
    <span
      className={cn("h-full bg-primary transition-all", className)}
      data-slot="progress-indicator"
      style={PROGRESS_WIDTH_STYLES[widthPercent] ?? PROGRESS_WIDTH_STYLES[0]}
      {...props}
    />
  )
}

function ProgressLabel({ className, ...props }: Readonly<LabelProps>) {
  return <LabelPrimitive className={cn("text-sm font-medium", className)} data-slot="progress-label" {...props} />
}

function ProgressValue({
  children,
  className,
  ...props
}: Omit<ComponentProps<"span">, "children"> & {
  children?: (value: string) => ReactNode
}) {
  const { valueText } = useProgress()

  return (
    <span className={cn("ml-auto text-sm text-muted-foreground tabular-nums", className)} data-slot="progress-value" {...props}>
      {children !== undefined && valueText !== undefined ? children(valueText) : valueText}
    </span>
  )
}

export { Progress, ProgressIndicator, ProgressLabel, ProgressTrack, ProgressValue }
