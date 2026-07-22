"use client"

import { useCallback, useMemo, type ComponentProps, type ReactNode } from "react"

import { type CalendarDate } from "@internationalized/date"
import type { Key } from "@react-types/shared"
import { cva } from "class-variance-authority"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import {
  Calendar as AriaCalendar,
  CalendarGridHeader as AriaCalendarGridHeader,
  RangeCalendar as AriaRangeCalendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarHeaderCell,
  CalendarHeading,
  CalendarMonthPicker,
  CalendarYearPicker,
  type CalendarCellRenderProps,
  type CalendarProps,
  type DateValue,
  type RangeCalendarProps,
} from "react-aria-components"
import {
  type CalendarHeadingProps,
  type CalendarMonthPickerAria,
  type CalendarYearPickerAria,
  type CalendarYearPickerProps,
} from "react-aria/useCalendar"

import { cn } from "~/src/presentation/utils"

import { Button, buttonVariants } from "~/src/presentation/components/shadcn/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/src/presentation/components/shadcn/select"

const DEFAULT_VISIBLE_MONTH_COUNT = 1

type HeaderFormat = NonNullable<CalendarHeadingProps["format"]>
type YearFormat = NonNullable<CalendarYearPickerProps["format"]>
type MonthFormat = NonNullable<ComponentProps<typeof CalendarMonthPicker>["format"]>

type CellRenderProps = CalendarCellRenderProps & {
  defaultChildren: ReactNode | undefined
}

type CalendarRenderCell = (renderProps: CellRenderProps) => ReactNode

const CALENDAR_DAY_BUTTON_CLASSNAME = cn(
  buttonVariants({ size: "icon", variant: "ghost" }),
  "relative isolate z-10 flex aspect-square h-full w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50 data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-muted data-[range-middle=true]:text-foreground data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground dark:hover:text-foreground [&>span]:text-xs [&>span]:opacity-70",
)

const cellVariants = cva(
  "group/day relative mt-2 aspect-square h-full w-full cursor-default rounded-(--cell-radius) p-0 text-center select-none [&:is(:last-child>[data-selected=true])>div]:rounded-r-(--cell-radius)",
  {
    variants: {
      isDisabled: {
        true: "text-muted-foreground opacity-50",
      },
      isOutsideMonth: {
        true: "text-muted-foreground aria-selected:text-muted-foreground",
      },
      isSelectionEnd: {
        true: "relative isolate z-0 rounded-r-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-muted",
      },
      isSelectionStart: {
        true: "relative isolate z-0 rounded-l-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-muted",
      },
      isToday: {
        true: "rounded-(--cell-radius) bg-muted text-foreground data-[selected=true]:rounded-none",
      },
      isUnavailable: {
        true: "text-muted-foreground opacity-50 [&>div]:line-through",
      },
      showWeekNumber: {
        false: "[&:is(:first-child>[data-selected=true])>div]:rounded-l-(--cell-radius)",
        true: "[&:is(:nth-child(2)>[data-selected=true])>div]:rounded-l-(--cell-radius)",
      },
    },
  },
)

function resolveVisibleMonthCount(numberOfMonths: number | undefined): number {
  return numberOfMonths ?? DEFAULT_VISIBLE_MONTH_COUNT
}

function toYearFormat(format: HeaderFormat | undefined): YearFormat | undefined {
  if (format === undefined) {
    return undefined
  }

  if (format.year === undefined) {
    if (format.era === undefined) {
      return undefined
    }

    return { era: format.era }
  }

  if (format.era === undefined) {
    return { year: format.year }
  }

  return { era: format.era, year: format.year }
}

function toNumberKey(key: string | number): number {
  if (typeof key === "number") {
    return key
  }

  return Number(key)
}

interface CalendarExtraProps {
  buttonVariant?: ComponentProps<typeof Button>["variant"] | undefined
  captionLayout?: "label" | "dropdown" | undefined
  headerFormat?: HeaderFormat | undefined
  numberOfMonths?: number | undefined
  renderCell?: CalendarRenderCell | undefined
  showWeekNumber?: boolean | undefined
}

function Calendar<T extends DateValue, M extends "single" | "multiple" = "single">(
  props: Omit<CalendarProps<T, M>, "visibleDuration"> & CalendarExtraProps,
) {
  const visibleMonthCount = resolveVisibleMonthCount(props.numberOfMonths)
  const visibleDuration = useMemo(() => ({ months: visibleMonthCount }), [visibleMonthCount])

  return (
    <AriaCalendar
      {...props}
      className={cn(
        "group/calendar w-fit bg-background p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        props.className,
      )}
      data-slot="calendar"
      visibleDuration={visibleDuration}
    >
      <CalendarInner {...props} />
    </AriaCalendar>
  )
}

function RangeCalendar<T extends DateValue>(props: RangeCalendarProps<T> & CalendarExtraProps) {
  const visibleMonthCount = resolveVisibleMonthCount(props.numberOfMonths)
  const visibleDuration = useMemo(() => ({ months: visibleMonthCount }), [visibleMonthCount])

  return (
    <AriaRangeCalendar
      {...props}
      className={cn(
        "group/calendar w-fit bg-background p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        props.className,
      )}
      data-slot="calendar"
      visibleDuration={visibleDuration}
    >
      <CalendarInner {...props} isRange />
    </AriaRangeCalendar>
  )
}

function CalendarInner({
  buttonVariant = "ghost",
  captionLayout = "label",
  headerFormat,
  isRange,
  numberOfMonths = DEFAULT_VISIBLE_MONTH_COUNT,
  renderCell,
  showWeekNumber = false,
}: CalendarExtraProps & {
  isRange?: boolean | undefined
}) {
  return (
    <div className="relative flex flex-col gap-4 md:flex-row">
      <header className="absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1">
        <Button className="size-(--cell-size) p-0 select-none aria-disabled:opacity-50" slot="previous" variant={buttonVariant}>
          <ChevronLeftIcon className="cn-rtl-flip size-4" />
        </Button>
        <Button className="size-(--cell-size) p-0 select-none aria-disabled:opacity-50" slot="next" variant={buttonVariant}>
          <ChevronRightIcon className="cn-rtl-flip size-4" />
        </Button>
      </header>
      {Array.from({ length: numberOfMonths }, (_, monthIndex) => (
        <CalendarMonthSection
          captionLayout={captionLayout}
          headerFormat={headerFormat}
          isRange={isRange}
          key={monthIndex}
          monthIndex={monthIndex}
          renderCell={renderCell}
          showWeekNumber={showWeekNumber}
        />
      ))}
    </div>
  )
}

function CalendarMonthSection({
  captionLayout,
  headerFormat,
  isRange,
  monthIndex,
  renderCell,
  showWeekNumber = false,
}: CalendarExtraProps & {
  isRange?: boolean | undefined
  monthIndex: number
}) {
  const gridOffset = useMemo(() => ({ months: monthIndex }), [monthIndex])
  const headingFormatProps = headerFormat === undefined ? {} : { format: headerFormat }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex h-(--cell-size) w-full items-center justify-center gap-1 px-(--cell-size)">
        {captionLayout === "dropdown" ? (
          <>
            <MonthDropdown format={headerFormat} />
            <YearDropdown format={headerFormat} />
          </>
        ) : (
          <CalendarHeading className="text-sm font-medium select-none" offset={gridOffset} {...headingFormatProps} />
        )}
      </div>
      <CalendarGrid className="w-full border-collapse" offset={gridOffset}>
        <AriaCalendarGridHeader>
          {(day) => (
            <CalendarHeaderCell className="rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none">
              {day}
            </CalendarHeaderCell>
          )}
        </AriaCalendarGridHeader>
        <CalendarGridBody>
          {(date) => <CalendarDayCell date={date} isRange={isRange} renderCell={renderCell} showWeekNumber={showWeekNumber} />}
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  )
}

function CalendarDayCell({
  date,
  isRange,
  renderCell,
  showWeekNumber,
}: Readonly<{
  date: CalendarDate
  isRange?: boolean | undefined
  renderCell?: CalendarRenderCell | undefined
  showWeekNumber: boolean
}>) {
  const cellClassName = useCallback(
    (renderProps: CalendarCellRenderProps) => cellVariants({ ...renderProps, showWeekNumber }),
    [showWeekNumber],
  )

  return (
    <CalendarCell className={cellClassName} date={date}>
      {(renderProps) => <CalendarCellDayContent isRange={isRange} renderCell={renderCell} renderProps={renderProps} />}
    </CalendarCell>
  )
}

function CalendarCellDayContent({
  isRange,
  renderCell,
  renderProps,
}: Readonly<{
  isRange?: boolean | undefined
  renderCell?: CalendarRenderCell | undefined
  renderProps: CellRenderProps
}>) {
  const rangeActive = isRange === true

  return (
    <div
      className={CALENDAR_DAY_BUTTON_CLASSNAME}
      data-range-end={renderProps.isSelectionEnd && rangeActive}
      data-range-middle={renderProps.isSelected && !renderProps.isSelectionStart && !renderProps.isSelectionEnd && rangeActive}
      data-range-start={renderProps.isSelectionStart && rangeActive}
      data-selected-single={renderProps.isSelected && !rangeActive}
    >
      {renderCell === undefined ? renderProps.defaultChildren : renderCell(renderProps)}
    </div>
  )
}

function CalendarPickerSelect({
  ariaLabel,
  items,
  onChange,
  value,
}: Readonly<{
  ariaLabel: string
  items: readonly { formatted: string; id: number }[]
  onChange: (key: string | number | null) => void
  value: string | number
}>) {
  const handleChange = useCallback(
    (nextValue: Key | null) => {
      onChange(nextValue)
    },
    [onChange],
  )

  return (
    <div className="relative">
      <Select value={toNumberKey(value)} onChange={handleChange}>
        <SelectTrigger aria-label={ariaLabel}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="min-w-0">
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.id} id={item.id} textValue={item.formatted}>
                {item.formatted}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

function MonthDropdown({ format }: Readonly<{ format?: HeaderFormat | undefined }>) {
  const monthFormat = format?.month

  return (
    <CalendarMonthPicker {...(monthFormat === undefined ? {} : { format: monthFormat satisfies MonthFormat })}>
      {(pickerProps: CalendarMonthPickerAria) => {
        const handleChange = pickerProps.onChange

        return (
          <CalendarPickerSelect
            ariaLabel={pickerProps["aria-label"]}
            items={pickerProps.items}
            onChange={handleChange}
            value={pickerProps.value}
          />
        )
      }}
    </CalendarMonthPicker>
  )
}

function YearDropdown({ format }: Readonly<{ format?: HeaderFormat | undefined }>) {
  const yearFormat = toYearFormat(format)

  return (
    <CalendarYearPicker {...(yearFormat === undefined ? {} : { format: yearFormat })}>
      {(pickerProps: CalendarYearPickerAria) => {
        const handleChange = pickerProps.onChange

        return (
          <CalendarPickerSelect
            ariaLabel={pickerProps["aria-label"]}
            items={pickerProps.items}
            onChange={handleChange}
            value={pickerProps.value}
          />
        )
      }}
    </CalendarYearPicker>
  )
}

export { Calendar, RangeCalendar }
