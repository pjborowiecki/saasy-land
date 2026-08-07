export type SortDirection = false | "asc" | "desc"

/** Maps TanStack's sort state onto the `aria-sort` value a column header reports. */
export function ariaSort(sorted: SortDirection): "ascending" | "descending" | "none" {
  if (sorted === "asc") {
    return "ascending"
  }

  return sorted === "desc" ? "descending" : "none"
}
