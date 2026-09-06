/*
 * AUTH SURFACE VOCABULARY — the shared class strings for the auth shell.
 *
 * The auth group renders inside the landing's committed `.dark` world, so every value
 * here resolves through a semantic token: hairline `border-input` edges, the `rounded-lg`
 * control radius on inputs and buttons, the accent `ring` on focus, and one monochrome
 * fill for the single primary action on each page. Controls are 44px (`h-11`) or 48px
 * (`h-12`) so every target clears the touch floor, and every transition enumerates its
 * properties and eases on `ease-exp`.
 */

/** The field: hairline edge, control radius, accent focus ring, 44px target. */
export const AUTH_INPUT_CLASS =
  "h-11 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 text-base text-foreground outline-none transition-[border-color,box-shadow] duration-200 ease-exp placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40"

/** The password field wrapper, matching the field metrics with the reveal toggle inside. */
export const AUTH_INPUT_GROUP_CLASS =
  "h-11 rounded-lg border-input transition-[border-color,box-shadow] duration-200 ease-exp dark:bg-input/30"

/** The one filled surface on the page: the submit. */
export const AUTH_PRIMARY_BUTTON_CLASS =
  "h-12 w-full gap-2 rounded-lg text-body-sm font-semibold transition-[background-color,color,transform] duration-200 ease-exp"

/** Hairline: OAuth, mode switches, and every secondary action. */
export const AUTH_SECONDARY_BUTTON_CLASS =
  "h-11 w-full gap-2 rounded-lg border-border bg-transparent text-body-sm font-medium text-foreground transition-[background-color,border-color,color,transform] duration-200 ease-exp hover:bg-muted dark:border-border dark:bg-transparent dark:hover:bg-muted"

/** Field labels: 0.875rem medium in the foreground, against the muted copy around them. */
export const AUTH_LABEL_CLASS = "text-body-sm font-medium text-foreground"

/** The field stack: label to control to error, then field to field. */
export const AUTH_FIELD_CONTENT_CLASS = "gap-2"
export const AUTH_FIELD_GROUP_CLASS = "flex flex-col gap-5"
