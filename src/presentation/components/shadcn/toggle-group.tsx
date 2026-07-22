"use client"

import { createContext, use, useMemo, type CSSProperties, type ReactNode } from "react"

import { type VariantProps } from "class-variance-authority"
import {
  ToggleButton as TogglePrimitive,
  ToggleButtonGroup as ToggleGroupPrimitive,
  type ToggleButtonGroupProps,
  type ToggleButtonProps,
} from "react-aria-components"

import { cn } from "~/src/utils"

import { toggleVariants } from "~/src/presentation/components/shadcn/toggle"

const DEFAULT_SPACING = 2

type ToggleGroupContextValue = VariantProps<typeof toggleVariants> & {
  orientation?: "horizontal" | "vertical"
  spacing?: number
}

const ToggleGroupContext = createContext<ToggleGroupContextValue>({
  orientation: "horizontal",
  size: "default",
  spacing: DEFAULT_SPACING,
  variant: "default",
})

function ToggleGroup({
  children,
  className,
  orientation = "horizontal",
  size,
  spacing = DEFAULT_SPACING,
  variant,
  ...props
}: Omit<ToggleButtonGroupProps, "children"> &
  VariantProps<typeof toggleVariants> & {
    children?: ReactNode
    orientation?: "horizontal" | "vertical"
    spacing?: number
  }) {
  const contextValue = useMemo(
    (): ToggleGroupContextValue => ({
      orientation,
      size,
      spacing,
      variant,
    }),
    [orientation, size, spacing, variant],
  )

  const gapStyle = useMemo(
    (): CSSProperties & Record<`--${string}`, string> => ({
      "--gap": `calc(var(--spacing) * ${String(spacing)})`,
    }),
    [spacing],
  )

  return (
    <ToggleGroupPrimitive
      className={cn(
        "group/toggle-group flex w-fit flex-row items-center gap-(--gap) rounded-lg data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-vertical:flex-col data-vertical:items-stretch",
        className,
      )}
      data-size={size}
      data-slot="toggle-group"
      data-spacing={spacing}
      data-variant={variant}
      orientation={orientation}
      style={gapStyle}
      {...props}
    >
      <ToggleGroupContext value={contextValue}>{children}</ToggleGroupContext>
    </ToggleGroupPrimitive>
  )
}

function ToggleGroupItem({
  children,
  className,
  size = "default",
  variant = "default",
  ...props
}: ToggleButtonProps & VariantProps<typeof toggleVariants>) {
  const context = use(ToggleGroupContext)
  const resolvedSize = context.size ?? size
  const resolvedVariant = context.variant ?? variant

  return (
    <TogglePrimitive
      className={cn(
        "shrink-0 group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-1.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-1.5 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-lg group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-lg group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-lg group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-lg group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t",
        toggleVariants({
          size: resolvedSize,
          variant: resolvedVariant,
        }),
        className,
      )}
      data-size={resolvedSize}
      data-slot="toggle-group-item"
      data-spacing={context.spacing}
      data-variant={resolvedVariant}
      {...props}
    >
      {children}
    </TogglePrimitive>
  )
}

export { ToggleGroup, ToggleGroupItem }
