import type { JSX } from "react"

const USERS_TABLE_CHECKBOX_CLASS =
  "size-4 shrink-0 rounded border border-input accent-primary outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"

interface UsersTableCheckboxProps {
  readonly selectAll?: boolean
}

export function UsersTableCheckbox({ selectAll = false }: Readonly<UsersTableCheckboxProps>): JSX.Element {
  return <input type="checkbox" aria-label={selectAll ? "Select all rows" : "Select row"} className={USERS_TABLE_CHECKBOX_CLASS} />
}
