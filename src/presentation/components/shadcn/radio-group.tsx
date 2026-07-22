"use client"

import {
  composeRenderProps,
  RadioButton,
  RadioField,
  RadioGroup as RadioGroupPrimitive,
  type RadioFieldProps,
  type RadioGroupProps,
} from "react-aria-components"

import { cn } from "~/src/utils"

function RadioGroup({ className, ...props }: Readonly<RadioGroupProps>) {
  return <RadioGroupPrimitive className={cn("grid w-full gap-2", className)} data-slot="radio-group" {...props} />
}

function RadioGroupItem({ children, className, ...props }: Readonly<RadioFieldProps>) {
  return (
    <RadioField data-slot="radio-group-field" {...props}>
      <RadioButton
        className={cn(
          "group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-input outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary data-focus-visible:border-ring data-focus-visible:ring-3 data-focus-visible:ring-ring/50 data-invalid:border-destructive data-invalid:ring-3 data-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:data-invalid:border-destructive/50 dark:data-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary data-selected:border-primary data-selected:bg-primary data-selected:text-primary-foreground data-invalid:data-selected:border-primary dark:data-selected:bg-primary data-disabled:cursor-not-allowed data-disabled:opacity-50",
          className,
        )}
        data-slot="radio-group-item"
      >
        {composeRenderProps(children, (renderedChildren, { isSelected }) => (
          <>
            <span className="flex size-4 items-center justify-center" data-slot="radio-group-indicator">
              {isSelected ? (
                <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground" />
              ) : undefined}
            </span>
            {renderedChildren}
          </>
        ))}
      </RadioButton>
    </RadioField>
  )
}

export { RadioGroup, RadioGroupItem }
