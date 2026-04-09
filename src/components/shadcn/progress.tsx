"use client"

import type { JSX } from "react"

import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "~/src/lib/utils"

function Progress({ className, children, value, ...props }: Readonly<ProgressPrimitive.Root.Props>): JSX.Element {
  return (
    <ProgressPrimitive.Root value={value} data-slot="progress" className={cn("flex flex-wrap gap-3", className)} {...props}>
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

function ProgressTrack({ className, ...props }: Readonly<ProgressPrimitive.Track.Props>): JSX.Element {
  return (
    <ProgressPrimitive.Track
      className={cn("relative flex h-1 w-full items-center overflow-x-hidden rounded-lg bg-muted", className)}
      data-slot="progress-track"
      {...props}
    />
  )
}

function ProgressIndicator({ className, ...props }: Readonly<ProgressPrimitive.Indicator.Props>): JSX.Element {
  return (
    <ProgressPrimitive.Indicator data-slot="progress-indicator" className={cn("h-full bg-primary transition-all", className)} {...props} />
  )
}

function ProgressLabel({ className, ...props }: Readonly<ProgressPrimitive.Label.Props>): JSX.Element {
  return <ProgressPrimitive.Label className={cn("text-xs", className)} data-slot="progress-label" {...props} />
}

function ProgressValue({ className, ...props }: Readonly<ProgressPrimitive.Value.Props>): JSX.Element {
  return (
    <ProgressPrimitive.Value
      className={cn("ml-auto text-muted-foreground text-xs tabular-nums", className)}
      data-slot="progress-value"
      {...props}
    />
  )
}

export { Progress, ProgressIndicator, ProgressLabel, ProgressTrack, ProgressValue }
