import type { JSX } from "react"

import { DATA_TABLE } from "~/src/presentation/components/custom/data-table/_constants/data-table.constants"

/** Static Suspense fallback — do not mount TanStack Table here (dev `Date.now` breaks Cache Components prerender). */
export function AllUsersTabFallback(): JSX.Element {
  return <div className={DATA_TABLE.CLASSES.LAYOUT.ROOT} aria-hidden />
}
