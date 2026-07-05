"use client"

import { type ComponentProps, createContext, type JSX, useContext, useEffect, useMemo, useRef } from "react"

import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { type DayButton, DayPicker, getDefaultClassNames, type Locale } from "react-day-picker"

import { cn } from "~/src/lib/utils"

import { Button, buttonVariants } from "~/src/components/shadcn/button"

type DayPickerComponents = NonNullable<ComponentProps<typeof DayPicker>["components"]>
type RootProps = Parameters<NonNullable<DayPickerComponents["Root"]>>[0]
type ChevronProps = Parameters<NonNullable<DayPickerComponents["Chevron"]>>[0]
type WeekNumberProps = Parameters<NonNullable<DayPickerComponents["WeekNumber"]>>[0]
type DayButtonProps = Parameters<NonNullable<DayPickerComponents["DayButton"]>>[0]

const CalendarLocaleContext = createContext<Partial<Locale> | undefined>(undefined)

function useCalendarLocale(): Partial<Locale> | undefined {
  return useContext(CalendarLocaleContext)
}

function CalendarRoot({ className, rootRef, ...props }: Readonly<RootProps>): JSX.Element {
  return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />
}

function CalendarChevron({ className, orientation, ...props }: Readonly<ChevronProps>): JSX.Element {
  if (orientation === "left") {
    return <ChevronLeftIcon className={cn("size-4", className)} {...props} />
  }
  if (orientation === "right") {
    return <ChevronRightIcon className={cn("size-4", className)} {...props} />
  }
  return <ChevronDownIcon className={cn("size-4", className)} {...props} />
}

function CalendarDayButtonSlot({ ...props }: Readonly<DayButtonProps>): JSX.Element {
  const locale = useCalendarLocale()
  if (locale === undefined) {
    return <CalendarDayButton {...props} />
  }
  return <CalendarDayButton locale={locale} {...props} />
}

function CalendarWeekNumber({ children, ...props }: Readonly<WeekNumberProps>): JSX.Element {
  return (
    <td {...props}>
      <div className="flex size-(--cell-size) items-center justify-center text-center">{children}</div>
    </td>
  )
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  showWeekNumber,
  ...props
}: Readonly<
  ComponentProps<typeof DayPicker> & {
    buttonVariant?: ComponentProps<typeof Button>["variant"]
  }
>): JSX.Element {
  const defaultClassNames = getDefaultClassNames()
  const calendarFormatters = useMemo(
    () => ({
      formatMonthDropdown: (date: Date) => date.toLocaleString(locale?.code, { month: "short" }),
      ...formatters,
    }),
    [formatters, locale?.code],
  )
  const calendarClassNames = useMemo(
    () => ({
      button_next: cn(
        buttonVariants({ variant: buttonVariant }),
        "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
        defaultClassNames.button_next,
      ),
      button_previous: cn(
        buttonVariants({ variant: buttonVariant }),
        "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
        defaultClassNames.button_previous,
      ),
      caption_label: cn(
        "font-medium select-none",
        captionLayout === "label"
          ? "text-sm"
          : "flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
        defaultClassNames.caption_label,
      ),
      day: cn(
        "group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
        showWeekNumber === true
          ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
          : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
        defaultClassNames.day,
      ),
      disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
      dropdown: cn("absolute inset-0 bg-popover opacity-0", defaultClassNames.dropdown),
      dropdown_root: cn("relative rounded-(--cell-radius)", defaultClassNames.dropdown_root),
      dropdowns: cn("flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium", defaultClassNames.dropdowns),
      hidden: cn("invisible", defaultClassNames.hidden),
      month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
      month_caption: cn("flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)", defaultClassNames.month_caption),
      month_grid: "w-full border-collapse",
      months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
      nav: cn("absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1", defaultClassNames.nav),
      outside: cn("text-muted-foreground aria-selected:text-muted-foreground", defaultClassNames.outside),
      range_end: cn(
        "relative isolate z-0 rounded-r-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-muted",
        defaultClassNames.range_end,
      ),
      range_middle: cn("rounded-none", defaultClassNames.range_middle),
      range_start: cn(
        "relative isolate z-0 rounded-l-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-muted",
        defaultClassNames.range_start,
      ),
      root: cn("w-fit", defaultClassNames.root),
      today: cn("rounded-(--cell-radius) bg-muted text-foreground data-[selected=true]:rounded-none", defaultClassNames.today),
      week: cn("mt-2 flex w-full", defaultClassNames.week),
      week_number: cn("text-[0.8rem] text-muted-foreground select-none", defaultClassNames.week_number),
      week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
      weekday: cn("flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none", defaultClassNames.weekday),
      weekdays: cn("flex", defaultClassNames.weekdays),
      ...classNames,
    }),
    [buttonVariant, captionLayout, classNames, defaultClassNames, showWeekNumber],
  )
  const calendarComponents = useMemo(
    () => ({
      Chevron: CalendarChevron,
      DayButton: CalendarDayButtonSlot,
      Root: CalendarRoot,
      WeekNumber: CalendarWeekNumber,
      ...components,
    }),
    [components],
  )

  return (
    <CalendarLocaleContext.Provider value={locale}>
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn(
          "group/calendar bg-background p-2 [--cell-size:--spacing(7)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
          String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
          String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
          className,
        )}
        captionLayout={captionLayout}
        locale={locale}
        formatters={calendarFormatters}
        classNames={calendarClassNames}
        components={calendarComponents}
        {...(showWeekNumber === undefined ? {} : { showWeekNumber })}
        {...props}
      />
    </CalendarLocaleContext.Provider>
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }): JSX.Element {
  const defaultClassNames = getDefaultClassNames()

  const ref = useRef<HTMLButtonElement>(null)

  const isFocused = modifiers["focused"] === true

  useEffect(
    function focusDayButtonWhenFocusedModifierChanges() {
      if (!isFocused) {
        return
      }
      ref.current?.focus()
    },
    [isFocused],
  )

  return (
    <Button
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers["selected"] === true &&
        modifiers["range_start"] !== true &&
        modifiers["range_end"] !== true &&
        modifiers["range_middle"] !== true
      }
      data-range-start={modifiers["range_start"] === true}
      data-range-end={modifiers["range_end"] === true}
      data-range-middle={modifiers["range_middle"] === true}
      className={cn(
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50 data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-muted data-[range-middle=true]:text-foreground data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground dark:hover:text-foreground [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
