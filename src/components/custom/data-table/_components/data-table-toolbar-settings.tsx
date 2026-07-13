"use client"
"use no memo"

import { useCallback, useMemo, type JSX } from "react"

import { Settings2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "~/src/lib/utils"

import { buttonVariants } from "~/src/components/shadcn/button"
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "~/src/components/shadcn/popover"
import { ToggleGroup, ToggleGroupItem } from "~/src/components/shadcn/toggle-group"

import { useDataTable } from "~/src/components/custom/data-table/_components/data-table-provider"
import { DATA_TABLE } from "~/src/components/custom/data-table/_constants/data-table.constants"
import { DATA_TABLE_ROW_DENSITIES, type DataTableRowDensity } from "~/src/components/custom/data-table/_types/data-table.types"

function isDataTableRowDensity(value: string | undefined): value is DataTableRowDensity {
  return value !== undefined && (DATA_TABLE_ROW_DENSITIES as readonly string[]).includes(value)
}

export function DataTableToolbarSettings(): JSX.Element {
  const t = useTranslations()
  const { rowDensity, setRowDensity } = useDataTable()
  const rowDensityValue = useMemo(() => [rowDensity] as const, [rowDensity])

  const handleRowDensityChange = useCallback(
    (groupValue: string[]) => {
      const [next] = groupValue
      if (!isDataTableRowDensity(next)) {
        return
      }
      setRowDensity(next)
    },
    [setRowDensity],
  )

  return (
    <Popover>
      <PopoverTrigger
        aria-label={t("components.custom.data-table.settings.trigger")}
        className={cn(buttonVariants({ size: "icon", variant: "outline" }), "size-10 shrink-0")}
        data-testid={DATA_TABLE.TEST_IDS.TOOLBAR_SETTINGS}
        type="button"
      >
        <Settings2 className="size-4 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 gap-3 p-3" side="bottom" sideOffset={6}>
        <PopoverHeader>
          <PopoverTitle>{t("components.custom.data-table.settings.title")}</PopoverTitle>
        </PopoverHeader>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-foreground">{t("components.custom.data-table.settings.rowDensity.label")}</p>
          <ToggleGroup
            className="grid w-full grid-cols-3"
            data-testid={DATA_TABLE.TEST_IDS.TOOLBAR_SETTINGS_ROW_DENSITY}
            size="sm"
            value={rowDensityValue}
            variant="outline"
            onValueChange={handleRowDensityChange}
          >
            {DATA_TABLE_ROW_DENSITIES.map((density) => (
              <ToggleGroupItem key={density} className="px-2" value={density}>
                {t(`components.custom.data-table.settings.rowDensity.${density}`)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </PopoverContent>
    </Popover>
  )
}
