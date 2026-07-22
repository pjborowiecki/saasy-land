"use client"

import { Children, isValidElement, type CSSProperties, type ReactElement, type ReactNode } from "react"

import type { DOMAttributes } from "@react-types/shared"
import {
  Focusable,
  OverlayArrow,
  Tooltip as TooltipPrimitive,
  TooltipTrigger as TooltipTriggerPrimitive,
  type OverlayArrowRenderProps,
  type TooltipProps as TooltipPrimitiveProps,
  type TooltipTriggerComponentProps,
} from "react-aria-components"

import { cn } from "~/src/presentation/utils"

const TOOLTIP_OFFSET = 4
const TOOLTIP_CROSS_OFFSET = 0

const OVERLAY_ARROW_TRANSFORMS = {
  bottom: "translate(-50%, calc(50% + 2px)) rotate(45deg)",
  center: "translate(-50%, calc(-50% - 2px)) rotate(45deg)",
  left: "translate(calc(-50% - 2px), -50%) rotate(45deg)",
  right: "translate(calc(50% + 2px), -50%) rotate(45deg)",
  top: "translate(-50%, calc(-50% - 2px)) rotate(45deg)",
} as const

type OverlayArrowStyleValues = OverlayArrowRenderProps & {
  defaultStyle: CSSProperties
}

function getOverlayArrowStyle({ defaultStyle, placement: arrowPlacement }: OverlayArrowStyleValues): CSSProperties {
  const transform = arrowPlacement === null ? OVERLAY_ARROW_TRANSFORMS.top : OVERLAY_ARROW_TRANSFORMS[arrowPlacement]

  return {
    ...defaultStyle,
    rotate: "0deg",
    transform,
    translate: "0 0",
  }
}

function isFocusableTrigger(node: ReactNode): node is ReactElement<DOMAttributes, string> {
  return isValidElement(node)
}

function TooltipTrigger({ delay = 0, children, ...props }: Readonly<TooltipTriggerComponentProps>) {
  const [trigger, tooltip] = Children.toArray(children)

  return (
    <TooltipTriggerPrimitive data-slot="tooltip-trigger" delay={delay} {...props}>
      {isFocusableTrigger(trigger) ? <Focusable>{trigger}</Focusable> : trigger}
      {tooltip}
    </TooltipTriggerPrimitive>
  )
}

function Tooltip({
  className,
  placement = "top",
  offset = TOOLTIP_OFFSET,
  crossOffset = TOOLTIP_CROSS_OFFSET,
  children,
  ...props
}: Omit<TooltipPrimitiveProps, "children" | "className"> & {
  className?: string
  children?: ReactNode
}) {
  return (
    <TooltipPrimitive
      data-slot="tooltip-content"
      placement={placement}
      offset={offset}
      crossOffset={crossOffset}
      className={cn(
        "z-50 inline-flex w-fit max-w-xs origin-(--trigger-anchor-point) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-entering:animate-in data-entering:fade-in-0 data-entering:zoom-in-95 data-exiting:animate-out data-exiting:fade-out-0 data-exiting:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm",
        className,
      )}
      {...props}
    >
      {children}
      <OverlayArrow
        className="z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground"
        style={getOverlayArrowStyle}
      />
    </TooltipPrimitive>
  )
}

export { Tooltip, TooltipTrigger }
