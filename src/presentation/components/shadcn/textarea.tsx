"use client"

import type { ComponentProps } from "react"

import { composeRenderProps, TextArea as TextareaPrimitive } from "react-aria-components"

import { cn } from "~/src/utils"

function Textarea({ className, ...props }: Readonly<ComponentProps<typeof TextareaPrimitive>>) {
  return (
    <TextareaPrimitive
      data-slot="textarea"
      className={composeRenderProps(className, (renderClassName) =>
        cn(
          "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          renderClassName,
        ),
      )}
      {...props}
    />
  )
}

export { Textarea }
