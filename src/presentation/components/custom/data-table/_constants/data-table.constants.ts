const PAGE_SIZE_10 = 10
const PAGE_SIZE_20 = 20
const PAGE_SIZE_30 = 30
const PAGE_SIZE_40 = 40
const PAGE_SIZE_50 = 50

export const DATA_TABLE = {
  CLASSES: {
    /**
     * System gutters stay `table-cell` (no `display:flex` on the cell).
     * Content is centered by an inner `SYSTEM_COLUMN_INNER` wrapper.
     */
    ACTIONS_COLUMN: "!box-border !w-12 !max-w-12 !min-w-12 !p-0 border-l border-border/40",
    ALIGN: {
      CENTER: "text-center",
      LEFT: "text-left",
      RIGHT: "text-right",
    },
    /** Column dividers — same weight as body row separators (`divide-border/40`). */
    COLUMN_DIVIDER: "border-r border-border/40 last:border-r-0",
    /**
     * Density pads content columns only. System gutters use `[data-system-column]`
     * so checkbox/actions keep equal left/right space (also beats shadcn `pr-0`).
     */
    DENSITY: {
      comfortable:
        "[&_td:not([data-system-column])]:px-4 [&_td:not([data-system-column])]:py-5 [&_th:not([data-system-column])]:px-4 [&_th:not([data-system-column])]:py-4 [&_td[data-system-column]]:!p-0 [&_th[data-system-column]]:!p-0",
      compact:
        "[&_td:not([data-system-column])]:px-3 [&_td:not([data-system-column])]:py-2 [&_th:not([data-system-column])]:px-3 [&_th:not([data-system-column])]:py-2 [&_td[data-system-column]]:!p-0 [&_th[data-system-column]]:!p-0",
      default:
        "[&_td:not([data-system-column])]:p-4 [&_th:not([data-system-column])]:p-4 [&_td[data-system-column]]:!p-0 [&_th[data-system-column]]:!p-0",
    },
    EMPTY_CELL: "h-24 text-center text-muted-foreground",
    LAYOUT: {
      BODY: "divide-y divide-border/40 [&_tr]:group [&_tr]:transition-colors [&_tr]:hover:bg-secondary/20 [&_tr[data-state=selected]]:hover:bg-secondary/50",
      /** Fills space between toolbar and pagination; body scrolls inside. */
      CONTAINER: "flex min-h-0 flex-1 flex-col overflow-hidden",
      HEAD: "group/head sticky top-0 z-20 transition-colors",
      /**
       * Bolder bottom edge than body `divide-border/40` so the header never reads
       * as just another row (especially when selected rows share a muted surface).
       */
      HEADER: "[&_tr]:border-b-2 [&_tr]:border-border [&_tr]:hover:bg-transparent",
      /**
       * Full header band (including select / actions): muted → hover → primary tint when sorted.
       * Column dividers match body separators (`border-border/40`); dropped on the last cell.
       */
      HEAD_CONTENT:
        "border-r border-border/40 bg-muted last:border-r-0 hover:bg-secondary/60 data-[sorted]:bg-primary/20 data-[sorted]:hover:bg-primary/30",
      PAGINATION: "shrink-0 border-t border-border/40 px-4 py-3",
      /**
       * Hug rows when short; `max-h-full` caps tall tables so the body scrolls.
       * Parent must be height-bounded for the cap to apply.
       */
      ROOT: "flex max-h-full min-h-0 w-full flex-col overflow-hidden rounded-lg border border-border/40 bg-card",
      /** `table-fixed` keeps column widths stable across pages (no content-driven reflow). */
      TABLE: "table-fixed [&_th]:text-xs [&_th]:font-medium [&_th]:tracking-wider [&_th]:text-muted-foreground [&_th]:uppercase",
      /**
       * No `scrollbar-gutter-stable`: the reserved gutter sits outside sticky
       * `right: 0` columns and makes row-actions look right-heavy.
       */
      TABLE_CONTAINER: "custom-scrollbar min-h-0 flex-1 overflow-auto overscroll-contain",
      /** Primary toolbar row: filter + fetch (left), search, then right-side actions. */
      TOOLBAR: "flex shrink-0 flex-wrap items-center gap-3 border-b border-border/40 px-4 py-3",
      TOOLBAR_ACTIONS: "flex shrink-0 flex-wrap items-center gap-3 sm:ml-auto",
      /** Collapsible filter chips row — same surface as the main toolbar (`bg-card` via root). */
      TOOLBAR_FILTERS_BAR: "flex shrink-0 flex-wrap items-center gap-3 border-b border-border/40 px-4 py-3",
    },
    LOADING: "h-24 text-center text-muted-foreground",
    /** Body pinned cells stay opaque over scrolling content. */
    PINNED_COLUMN: "bg-card",
    /** Pinned header cells — same surface states as `HEAD_CONTENT` (full band). */
    PINNED_HEADER:
      "border-r border-border/40 bg-muted last:border-r-0 hover:bg-secondary/60 data-[sorted]:bg-primary/20 data-[sorted]:hover:bg-primary/30",
    SELECT_COLUMN: "!box-border !w-12 !max-w-12 !min-w-12 !p-0 border-r border-border/40 [&:has([role=checkbox])]:!p-0",
    /** Centers checkbox / row-actions equally between the cell’s left and right edges. */
    SYSTEM_COLUMN_INNER: "flex w-full items-center justify-center",
  },
  COLUMN: {
    ACTIONS_SIZE: 48,
    PINNED_HEADER_Z_INDEX_LEFT: 30,
    PINNED_HEADER_Z_INDEX_RIGHT: 31,
    PINNED_Z_INDEX_LEFT: 10,
    PINNED_Z_INDEX_RIGHT: 11,
    ROW_DEPTH_INDENT_REM: 2,
    SELECT_SIZE: 48,
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE_OPTIONS: [PAGE_SIZE_10, PAGE_SIZE_20, PAGE_SIZE_30, PAGE_SIZE_40, PAGE_SIZE_50] as const,
    PAGE_INDEX_DISPLAY_OFFSET: 1,
  },
  ROW_DENSITY: {
    DEFAULT: "default",
  },
  TEST_IDS: {
    BODY: "data-table-body",
    CONTAINER: "data-table-container",
    EMPTY_STATE: "data-table-empty-state",
    FOOTER: "data-table-footer",
    HEADER: "data-table-header",
    LOADING_STATE: "data-table-loading-state",
    PAGINATION: "data-table-pagination",
    PAGINATION_NEXT: "data-table-pagination-next",
    PAGINATION_PAGE_INDICATOR: "data-table-pagination-page-indicator",
    PAGINATION_PAGE_SIZE: "data-table-pagination-page-size",
    PAGINATION_PREVIOUS: "data-table-pagination-previous",
    PAGINATION_ROW_COUNT: "data-table-pagination-row-count",
    TABLE: "data-table-table",
    TOOLBAR: "data-table-toolbar",
    TOOLBAR_EXPORT_CSV: "data-table-toolbar-export-csv",
    TOOLBAR_FETCH: "data-table-toolbar-fetch",
    TOOLBAR_FILTERS: "data-table-toolbar-filters",
    TOOLBAR_FILTERS_TOGGLE: "data-table-toolbar-filters-toggle",
    TOOLBAR_SEARCH: "data-table-toolbar-search",
    TOOLBAR_SETTINGS: "data-table-toolbar-settings",
    TOOLBAR_SETTINGS_ROW_DENSITY: "data-table-toolbar-settings-row-density",
  },
} as const

export type DataTableTestId = (typeof DATA_TABLE.TEST_IDS)[keyof typeof DATA_TABLE.TEST_IDS]
