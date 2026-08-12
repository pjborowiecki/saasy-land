import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/*
 * The type ramp has to be declared to tailwind-merge or `cn()` silently deletes it.
 * tailwind-merge classifies an unknown `text-*` utility as a colour, so out of the box
 * `twMerge("text-spec text-muted-foreground")` returned `"text-muted-foreground"` — every
 * role class in `--text-*` (globals.css) was being stripped the moment a colour followed it
 * in the same call. Registering the names under `font-size` restores both behaviours:
 * a size and a colour coexist, and two sizes still collide with the later one winning.
 *
 * Keep this list in sync with the `--text-*` tokens in src/presentation/styles/globals.css.
 */
const TYPE_RAMP_SIZES = [
  "body",
  "body-sm",
  "display-blast",
  "display-gate",
  "display-hero",
  "headline-peak",
  "headline-support",
  "label",
  "lead",
  "price",
  "spec",
  "statement",
  "title",
] as const

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...TYPE_RAMP_SIZES] }],
    },
  },
})

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
