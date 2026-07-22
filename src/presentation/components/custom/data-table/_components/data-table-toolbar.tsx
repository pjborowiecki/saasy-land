"use client"
// Controlled search / filter toggle must re-read context on interaction.
"use no memo"

import { type ComponentProps, type JSX, type ReactNode, useCallback, useEffect, useState } from "react"

import { Download, Filter, Loader2, RefreshCw, Search } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "~/src/utils"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Input } from "~/src/presentation/components/shadcn/input"

import { useDataTable } from "~/src/presentation/components/custom/data-table/_components/data-table-provider"
import { DataTableToolbarSettings } from "~/src/presentation/components/custom/data-table/_components/data-table-toolbar-settings"
import { DATA_TABLE } from "~/src/presentation/components/custom/data-table/_constants/data-table.constants"
import { buildDataTableCsv, downloadDataTableCsv } from "~/src/presentation/components/custom/data-table/_table/data-table-export-csv"
import type {
  DataTableExportCsvOptions,
  DataTableToolbarFetchOptions,
  DataTableToolbarOptions,
  DataTableToolbarSearchOptions,
} from "~/src/presentation/components/custom/data-table/_types/data-table.types"

export type DataTableToolbarProps = ComponentProps<"div">

const DEFAULT_EXPORT_FILENAME = "export.csv"

function resolveSearchOptions(search: boolean | DataTableToolbarSearchOptions | undefined): DataTableToolbarSearchOptions | undefined {
  if (search === false) {
    return undefined
  }

  if (search === undefined || search === true) {
    return {}
  }

  return search
}

function resolveToolbarConfig(toolbar: DataTableToolbarOptions | false | undefined): DataTableToolbarOptions | undefined {
  if (toolbar === false || toolbar === undefined) {
    return undefined
  }

  return toolbar
}

function useToolbarFiltersOpen(toolbarConfig: DataTableToolbarOptions | undefined): {
  filtersOpen: boolean
  setFiltersOpen: (open: boolean) => void
} {
  const controlledFiltersOpen = toolbarConfig?.filtersOpen
  const onFiltersOpenChange = toolbarConfig?.onFiltersOpenChange
  const isFiltersOpenControlled = controlledFiltersOpen !== undefined && onFiltersOpenChange !== undefined
  const [uncontrolledFiltersOpen, setUncontrolledFiltersOpen] = useState(() => controlledFiltersOpen === true)
  const filtersOpen = isFiltersOpenControlled ? controlledFiltersOpen : uncontrolledFiltersOpen

  useEffect(() => {
    if (!isFiltersOpenControlled && controlledFiltersOpen !== undefined) {
      setUncontrolledFiltersOpen(controlledFiltersOpen)
    }
  }, [controlledFiltersOpen, isFiltersOpenControlled])

  const setFiltersOpen = useCallback(
    (open: boolean) => {
      if (!isFiltersOpenControlled) {
        setUncontrolledFiltersOpen(open)
      }
      onFiltersOpenChange?.(open)
    },
    [isFiltersOpenControlled, onFiltersOpenChange],
  )

  return { filtersOpen, setFiltersOpen }
}

function resolveToolbarExportCsv(exportCsv: boolean | DataTableExportCsvOptions | undefined): {
  exportCsv: true | DataTableExportCsvOptions
  showExportCsv: boolean
} {
  if (exportCsv === false) {
    return { exportCsv: true, showExportCsv: false }
  }

  return { exportCsv: exportCsv ?? true, showExportCsv: true }
}

function resolveToolbarChrome(
  toolbarConfig: DataTableToolbarOptions,
  children: ReactNode,
): {
  exportCsv: true | DataTableExportCsvOptions
  hasFilters: boolean
  hasLeftControls: boolean
  hasRightActions: boolean
  isEmpty: boolean
  search: DataTableToolbarSearchOptions | undefined
  showExportCsv: boolean
  showFetch: boolean
  showSettings: boolean
} {
  const search = resolveSearchOptions(toolbarConfig.search)
  const { exportCsv, showExportCsv } = resolveToolbarExportCsv(toolbarConfig.exportCsv)
  const showSettings = toolbarConfig.settings !== false
  const hasFilters = toolbarConfig.filters !== undefined
  const showFetch = toolbarConfig.fetch !== undefined
  const hasLeftControls = hasFilters || showFetch
  const hasRightActions =
    showSettings ||
    showExportCsv ||
    toolbarConfig.primaryAction !== undefined ||
    toolbarConfig.secondaryAction !== undefined ||
    children !== undefined

  return {
    exportCsv,
    hasFilters,
    hasLeftControls,
    hasRightActions,
    isEmpty: search === undefined && !hasLeftControls && !hasRightActions,
    search,
    showExportCsv,
    showFetch,
    showSettings,
  }
}

function DataTableToolbarSearch({ search }: Readonly<{ search: DataTableToolbarSearchOptions }>): JSX.Element {
  const t = useTranslations()
  const { globalFilter, table } = useDataTable()

  const placeholder = search.placeholder ?? t("components.custom.data-table.toolbar.searchPlaceholder")
  const ariaLabel = search["aria-label"] ?? placeholder
  const value = search.value ?? globalFilter

  const handleChange = useCallback(
    (event: { currentTarget: { value: string } }) => {
      const nextValue = event.currentTarget.value
      table.setGlobalFilter(nextValue)
      search.onValueChange?.(nextValue)
    },
    [search, table],
  )

  return (
    <div className="group relative min-w-0 flex-1">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
      <Input
        aria-label={ariaLabel}
        className="h-10 w-full pl-10"
        data-testid={DATA_TABLE.TEST_IDS.TOOLBAR_SEARCH}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </div>
  )
}

function DataTableToolbarExportCsv({ exportCsv }: Readonly<{ exportCsv: true | DataTableExportCsvOptions }>): JSX.Element {
  const t = useTranslations()
  const { table } = useDataTable()

  const config: DataTableExportCsvOptions = exportCsv === true ? {} : exportCsv
  const label = config.label ?? t("components.custom.data-table.toolbar.exportCsv")
  const filename = config.filename ?? DEFAULT_EXPORT_FILENAME
  const { onExport } = config

  const handleExport = useCallback(() => {
    const csv = buildDataTableCsv(table)
    if (onExport !== undefined) {
      onExport(csv)
      return
    }
    downloadDataTableCsv(csv, filename)
  }, [filename, onExport, table])

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-10 gap-2 whitespace-nowrap"
      data-testid={DATA_TABLE.TEST_IDS.TOOLBAR_EXPORT_CSV}
      type="button"
      onPress={handleExport}
    >
      <Download className="size-4 text-muted-foreground" />
      {label}
    </Button>
  )
}

function DataTableToolbarFetch({ fetch }: Readonly<{ fetch: DataTableToolbarFetchOptions }>): JSX.Element {
  const t = useTranslations()
  const hasFetched = fetch.hasFetched === true
  const isDirty = fetch.isDirty === true
  const showFetchLabel = !hasFetched || isDirty
  const label = showFetchLabel
    ? (fetch.fetchLabel ?? t("components.custom.data-table.toolbar.fetch"))
    : (fetch.refetchLabel ?? t("components.custom.data-table.toolbar.refetch"))

  const handleFetch = useCallback(() => {
    void fetch.onFetch()
  }, [fetch])

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn("h-10 gap-2 whitespace-nowrap", {
        "border-primary/40 text-foreground": isDirty,
      })}
      data-testid={DATA_TABLE.TEST_IDS.TOOLBAR_FETCH}
      isDisabled={fetch.isFetching === true}
      type="button"
      onPress={handleFetch}
    >
      {fetch.isFetching === true ? (
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      ) : (
        <RefreshCw className="size-4 text-muted-foreground" />
      )}
      {label}
    </Button>
  )
}

function DataTableToolbarFiltersToggle({
  open,
  onOpenChange,
}: Readonly<{
  open: boolean
  onOpenChange: (open: boolean) => void
}>): JSX.Element {
  const t = useTranslations()

  const handleClick = useCallback(() => {
    onOpenChange(!open)
  }, [onOpenChange, open])

  return (
    <Button
      aria-expanded={open}
      aria-label={t("components.custom.data-table.toolbar.filtersToggle")}
      className={cn("size-10 shrink-0", {
        "bg-secondary text-foreground": open,
      })}
      data-testid={DATA_TABLE.TEST_IDS.TOOLBAR_FILTERS_TOGGLE}
      size="icon"
      type="button"
      variant="outline"
      onPress={handleClick}
    >
      <Filter className="size-4 text-muted-foreground" />
    </Button>
  )
}

export function DataTableToolbar({ className, children, ...props }: Readonly<DataTableToolbarProps>): ReactNode {
  const { classNames, toolbar } = useDataTable()
  const toolbarConfig = resolveToolbarConfig(toolbar)
  const { filtersOpen, setFiltersOpen } = useToolbarFiltersOpen(toolbarConfig)

  if (toolbarConfig === undefined) {
    return undefined
  }

  const chrome = resolveToolbarChrome(toolbarConfig, children)

  if (chrome.isEmpty) {
    return undefined
  }

  return (
    <>
      <div
        {...props}
        className={cn(DATA_TABLE.CLASSES.LAYOUT.TOOLBAR, classNames?.toolbar, className)}
        data-testid={DATA_TABLE.TEST_IDS.TOOLBAR}
      >
        {chrome.hasLeftControls ? (
          <div className="flex shrink-0 items-center gap-3">
            {chrome.hasFilters ? <DataTableToolbarFiltersToggle open={filtersOpen} onOpenChange={setFiltersOpen} /> : undefined}
            {chrome.showFetch && toolbarConfig.fetch !== undefined ? <DataTableToolbarFetch fetch={toolbarConfig.fetch} /> : undefined}
          </div>
        ) : undefined}

        {chrome.search === undefined ? <div className="min-w-0 flex-1" /> : <DataTableToolbarSearch search={chrome.search} />}

        {chrome.hasRightActions ? (
          <div className={DATA_TABLE.CLASSES.LAYOUT.TOOLBAR_ACTIONS}>
            {chrome.showSettings ? <DataTableToolbarSettings /> : undefined}
            {chrome.showExportCsv ? <DataTableToolbarExportCsv exportCsv={chrome.exportCsv} /> : undefined}
            {toolbarConfig.secondaryAction}
            {toolbarConfig.primaryAction}
            {children}
          </div>
        ) : undefined}
      </div>

      {chrome.hasFilters && filtersOpen ? (
        <div className={DATA_TABLE.CLASSES.LAYOUT.TOOLBAR_FILTERS_BAR} data-testid={DATA_TABLE.TEST_IDS.TOOLBAR_FILTERS}>
          {toolbarConfig.filters}
        </div>
      ) : undefined}
    </>
  )
}
