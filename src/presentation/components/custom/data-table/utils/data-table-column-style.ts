export type ColumnAlign = "left" | "right" | "center"

/** Text alignment from a column's `meta.align`. Left is the table default. */
export function alignClass(align?: ColumnAlign): string | undefined {
  if (align === "right") {
    return "text-right"
  }

  // Auto margins center the block-level checkbox; symmetric padding keeps the true
  // middle, since the table primitive drops right padding on checkbox cells.
  return align === "center" ? "text-center has-[[role=checkbox]]:px-0" : undefined
}
