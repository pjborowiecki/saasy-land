import type { User } from "~/src/modules/user/user.types"

import type { DataTableOptions } from "~/src/presentation/components/custom/data-table/features"

// The selection column pins to the start edge and the actions column to the end
// edge, so both stay visible while the middle scrolls.
export const DATA_TABLE_OPTIONS: DataTableOptions<User["select"]> = {
  initialState: { columnPinning: { end: ["actions"], start: ["select"] } },
}
