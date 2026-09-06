import type { ComponentProps } from "react"

import { useHydrated } from "@tanstack/react-router"
import { Input as InputPrimitive, composeRenderProps } from "react-aria-components"

import { cn } from "~/src/lib/cn"

const Input = ({ className, type, readOnly = false, ...props }: ComponentProps<typeof InputPrimitive>) => {
  const hydrated = useHydrated()
  return (
    <InputPrimitive
      type={type}
      readOnly={readOnly || !hydrated}
      data-slot="input"
      className={composeRenderProps(className, (resolvedClassName) =>
        cn(
          "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          resolvedClassName,
        ),
      )}
      {...props}
    />
  )
}

export { Input }
