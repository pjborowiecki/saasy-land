// @vitest-environment jsdom

import type { JSX, ReactNode } from "react"

import { createColumnHelper } from "@tanstack/react-table"
import { act, render, type RenderResult } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"

import { loadLocaleMessagesFromDir } from "~/src/integrations/next-intl/i18n.utils"

import { DataTable } from "~/src/presentation/components/custom/data-table/data-table"
import type { DataTableColumnDef, DataTableFeatures, DataTableOptions } from "~/src/presentation/components/custom/data-table/features"

interface Row {
  id: string
  name: string
  status: string
}

const SELECT_SIZE = 52
const NAME_SIZE = 300
const NAME_MIN_SIZE = 220
const STATUS_SIZE = 120
const TOTAL_SIZE = SELECT_SIZE + NAME_SIZE + STATUS_SIZE

const SELECT_INDEX = 0
const NAME_INDEX = 1
const STATUS_INDEX = 2
const SPACER_INDEX = 3
const HEADER_CELL_COUNT = 4

const PINNED_SPACER_INDEX = 2
const PINNED_STATUS_INDEX = 3

const DRAG_START_X = 500
const GROW_DELTA = 60
const COLLAPSE_DELTA = -400
const RESIZABLE_COLUMN_COUNT = 2
const NAME_HANDLE = 0

const helper = createColumnHelper<DataTableFeatures, Row>()

const DATA: Row[] = [{ id: "1", name: "Ada", status: "active" }]
const EMPTY_DATA: Row[] = []

const COLUMNS = helper.columns([
  helper.display({ enableResizing: false, header: "", id: "select", size: SELECT_SIZE }),
  helper.accessor("name", { header: "Name", id: "name", minSize: NAME_MIN_SIZE, size: NAME_SIZE }),
  helper.accessor("status", { header: "Status", id: "status", size: STATUS_SIZE }),
]) as DataTableColumnDef<Row>[]

const PINNED_OPTIONS: DataTableOptions<Row> = { initialState: { columnPinning: { end: ["status"], start: ["select"] } } }

function renderTable(options?: DataTableOptions<Row>): RenderResult {
  const messages = loadLocaleMessagesFromDir("en-US")

  function Wrapper({ children }: { children: ReactNode }): JSX.Element {
    return (
      <NextIntlClientProvider locale="en-US" messages={messages}>
        {children}
      </NextIntlClientProvider>
    )
  }

  const table =
    options === undefined ? <DataTable columns={COLUMNS} data={DATA} /> : <DataTable columns={COLUMNS} data={DATA} options={options} />

  return render(table, { wrapper: Wrapper })
}

function resizeHandle(container: HTMLElement, index: number): Element {
  const handle = container.querySelectorAll('thead th button[aria-label="Resize column"]')[index]

  if (handle === undefined) {
    throw new Error(`expected a resize handle at index ${index}`)
  }

  return handle
}

function drag(handle: Element, from: number, to: number): void {
  act(() => {
    handle.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, clientX: from }))
  })

  act(() => {
    document.dispatchEvent(new MouseEvent("mousemove", { bubbles: true, clientX: to }))
    document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, clientX: to }))
  })
}

describe("column resizing", () => {
  it("shows a handle on every resizable column", () => {
    expect.hasAssertions()

    const { container } = renderTable()

    // Only the fixed select column opts out; data columns all resize.
    expect(container.querySelectorAll('thead th button[aria-label="Resize column"]')).toHaveLength(RESIZABLE_COLUMN_COUNT)
  })

  it("renders every column at its model size with the total as the width floor", () => {
    expect.hasAssertions()

    const { container } = renderTable()
    const headers = container.querySelectorAll("thead th")

    expect(headers[SELECT_INDEX]).toHaveStyle({ width: `${SELECT_SIZE}px` })
    expect(headers[NAME_INDEX]).toHaveStyle({ width: `${NAME_SIZE}px` })
    expect(headers[STATUS_INDEX]).toHaveStyle({ width: `${STATUS_SIZE}px` })
    expect(container.querySelector("table")).toHaveStyle({ minWidth: `${TOTAL_SIZE}px` })
  })

  it("appends a width-less spacer cell that absorbs leftover container space", () => {
    expect.hasAssertions()

    const { container } = renderTable()
    const headers = container.querySelectorAll("thead th")

    expect(headers).toHaveLength(HEADER_CELL_COUNT)
    expect(headers[SPACER_INDEX]?.getAttribute("aria-hidden")).toBe("true")
    expect(headers[SPACER_INDEX]?.getAttribute("style")).toBeNull()
  })

  it("resizes only the dragged column", () => {
    expect.hasAssertions()

    const { container } = renderTable()
    const headers = container.querySelectorAll("thead th")

    drag(resizeHandle(container, NAME_HANDLE), DRAG_START_X, DRAG_START_X + GROW_DELTA)

    expect(headers[NAME_INDEX]).toHaveStyle({ width: `${NAME_SIZE + GROW_DELTA}px` })
    expect(container.querySelectorAll("tbody td")[NAME_INDEX]).toHaveStyle({ width: `${NAME_SIZE + GROW_DELTA}px` })
    expect(headers[SELECT_INDEX]).toHaveStyle({ width: `${SELECT_SIZE}px` })
    expect(headers[STATUS_INDEX]).toHaveStyle({ width: `${STATUS_SIZE}px` })
  })

  it("tracks the resized total in the table's width floor", () => {
    expect.hasAssertions()

    const { container } = renderTable()

    drag(resizeHandle(container, NAME_HANDLE), DRAG_START_X, DRAG_START_X + GROW_DELTA)

    expect(container.querySelector("table")).toHaveStyle({ minWidth: `${TOTAL_SIZE + GROW_DELTA}px` })
  })

  it("clamps a resized column at its declared minimum size", () => {
    expect.hasAssertions()

    const { container } = renderTable()

    drag(resizeHandle(container, NAME_HANDLE), DRAG_START_X, DRAG_START_X + COLLAPSE_DELTA)

    expect(container.querySelectorAll("thead th")[NAME_INDEX]).toHaveStyle({ width: `${NAME_MIN_SIZE}px` })
  })
})

describe("column pinning", () => {
  it("sticks pinned columns to their edges with model offsets", () => {
    expect.hasAssertions()

    const { container } = renderTable(PINNED_OPTIONS)
    const headers = container.querySelectorAll("thead th")

    expect(headers[SELECT_INDEX]?.className).toContain("sticky")
    expect(headers[SELECT_INDEX]).toHaveStyle({ insetInlineStart: "0px" })
    expect(headers[PINNED_STATUS_INDEX]?.className).toContain("sticky")
    expect(headers[PINNED_STATUS_INDEX]).toHaveStyle({ insetInlineEnd: "0px" })
  })

  it("renders end-pinned columns after the spacer so they sit against the edge", () => {
    expect.hasAssertions()

    const { container } = renderTable(PINNED_OPTIONS)
    const headers = container.querySelectorAll("thead th")

    expect(headers[PINNED_SPACER_INDEX]?.getAttribute("aria-hidden")).toBe("true")
    expect(headers[PINNED_STATUS_INDEX]?.textContent).toContain("Status")
  })

  it("keeps the spacer and end region in skeleton rows while loading", () => {
    expect.hasAssertions()

    const messages = loadLocaleMessagesFromDir("en-US")

    function Wrapper({ children }: { children: ReactNode }): JSX.Element {
      return (
        <NextIntlClientProvider locale="en-US" messages={messages}>
          {children}
        </NextIntlClientProvider>
      )
    }

    const { container } = render(<DataTable columns={COLUMNS} data={EMPTY_DATA} isLoading options={PINNED_OPTIONS} />, { wrapper: Wrapper })
    const firstRowCells = container.querySelectorAll("tbody tr:first-child td")

    expect(firstRowCells).toHaveLength(HEADER_CELL_COUNT)
    expect(firstRowCells[PINNED_SPACER_INDEX]?.getAttribute("aria-hidden")).toBe("true")
    expect(firstRowCells[PINNED_STATUS_INDEX]).toHaveStyle({ insetInlineEnd: "0px" })
  })
})
