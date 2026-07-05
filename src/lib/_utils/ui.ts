import type { CSSProperties } from "react"

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cssVars(vars: Record<`--${string}`, string | number>): CSSProperties {
  return vars
}
