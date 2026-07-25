"use client"
"use no memo"

import { useCallback, useMemo, type JSX } from "react"

import type { Key } from "@react-types/shared"
import { Settings2 } from "lucide-react"
import { useTranslations } from "next-intl"
import type { Selection } from "react-aria-components"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Popover, PopoverHeader, PopoverTitle, PopoverTrigger } from "~/src/presentation/components/shadcn/popover"
import { ToggleGroup, ToggleGroupItem } from "~/src/presentation/components/shadcn/toggle-group"
import { Tooltip, TooltipTrigger } from "~/src/presentation/components/shadcn/tooltip"

import { useDataTable } from "~/src/presentation/components/custom/data-table/_components/data-table-provider"
import { DATA_TABLE } from "~/src/presentation/components/custom/data-table/_constants/data-table.constants"
import { DATA_TABLE_ROW_DENSITIES, type DataTableRowDensity } from "~/src/presentation/components/custom/data-table/_types/data-table.types"

function isDataTableRowDensity(value: Key | undefined): value is DataTableRowDensity {
  return typeof value === "string" && DATA_TABLE_ROW_DENSITIES.some((density) => density === value)
}

/** Pure selection parser — extracted so the `"all"` / invalid-key branches are unit-testable. */
export function nextRowDensityFromSelection(keys: Selection): DataTableRowDensity | undefined {
  if (keys === "all") {
    return undefined
  }
  const [next] = keys
  if (!isDataTableRowDensity(next)) {
    return undefined
  }
  return next
}

export function DataTableToolbarSettings(): JSX.Element {
  const t = useTranslations()
  const { rowDensity, setRowDensity } = useDataTable()
  const selectedKeys = useMemo(() => new Set<Key>([rowDensity]), [rowDensity])

  const handleRowDensityChange = useCallback(
    (keys: Selection) => {
      const next = nextRowDensityFromSelection(keys)
      if (next === undefined) {
        return
      }
      setRowDensity(next)
    },
    [setRowDensity],
  )

  const triggerLabel = t("components.custom.data-table.settings.trigger")

  return (
    <PopoverTrigger>
      <TooltipTrigger>
        <Button
          aria-label={triggerLabel}
          className="size-10 shrink-0"
          data-testid={DATA_TABLE.TEST_IDS.TOOLBAR_SETTINGS}
          size="icon"
          variant="outline"
        >
          <Settings2 className="size-4 text-muted-foreground" />
        </Button>
        <Tooltip>{triggerLabel}</Tooltip>
      </TooltipTrigger>
      <Popover className="w-64 gap-3 p-3" offset={6} placement="bottom end">
        <PopoverHeader>
          <PopoverTitle>{t("components.custom.data-table.settings.title")}</PopoverTitle>
        </PopoverHeader>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-foreground">{t("components.custom.data-table.settings.rowDensity.label")}</p>
          <ToggleGroup
            aria-label={t("components.custom.data-table.settings.rowDensity.label")}
            className="grid w-full grid-cols-3"
            data-testid={DATA_TABLE.TEST_IDS.TOOLBAR_SETTINGS_ROW_DENSITY}
            disallowEmptySelection
            selectedKeys={selectedKeys}
            selectionMode="single"
            size="sm"
            variant="outline"
            onSelectionChange={handleRowDensityChange}
          >
            {DATA_TABLE_ROW_DENSITIES.map((density) => (
              <ToggleGroupItem key={density} className="px-2" id={density}>
                {t(`components.custom.data-table.settings.rowDensity.${density}`)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </Popover>
    </PopoverTrigger>
  )
}
