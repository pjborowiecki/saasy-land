import type { JSX } from "react"

import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "~/src/lib/utils"

function isNumberArray(value: unknown): value is readonly number[] {
  return Array.isArray(value) && value.every((item): item is number => typeof item === "number")
}

function getSliderThumbValues({
  value,
  defaultValue,
  min,
  max,
}: {
  value: SliderPrimitive.Root.Props["value"]
  defaultValue: SliderPrimitive.Root.Props["defaultValue"]
  min: number
  max: number
}): readonly number[] {
  if (isNumberArray(value)) {
    return value
  }
  if (isNumberArray(defaultValue)) {
    return defaultValue
  }
  return [min, max]
}

function Slider({ className, defaultValue, value, min = 0, max = 100, ...props }: Readonly<SliderPrimitive.Root.Props>): JSX.Element {
  const values = getSliderThumbValues({ defaultValue, max, min, value })

  return (
    <SliderPrimitive.Root
      className={cn("data-horizontal:w-full data-vertical:h-full", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-lg bg-muted select-none data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-primary select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        {values.map((thumbValue) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={thumbValue}
            className="relative block size-3 shrink-0 rounded-lg border border-ring bg-white ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-1 focus-visible:ring-1 focus-visible:outline-hidden active:ring-1 disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
