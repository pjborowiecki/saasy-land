"use client"

import { type ComponentProps, createContext, type JSX, useContext, useEffect, useRef } from "react"

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
  if (orientation === "left") return <ChevronLeftIcon className={cn("size-4", className)} {...props} />
  if (orientation === "right") return <ChevronRightIcon className={cn("size-4", className)} {...props} />
  return <ChevronDownIcon className={cn("size-4", className)} {...props} />
}

function CalendarDayButtonSlot({ ...props }: Readonly<DayButtonProps>): JSX.Element {
  const locale = useCalendarLocale()
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
  ...props
}: Readonly<
  ComponentProps<typeof DayPicker> & {
    buttonVariant?: ComponentProps<typeof Button>["variant"]
  }
>): JSX.Element {
  const defaultClassNames = getDefaultClassNames()

  return (
    <CalendarLocaleContext.Provider value={locale}>
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn(
          "group/calendar bg-background in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent p-2 [--cell-size:--spacing(7)]",
          String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
          String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
          className,
        )}
        captionLayout={captionLayout}
        locale={locale}
        formatters={{
          formatMonthDropdown: (date) => date.toLocaleString(locale?.code, { month: "short" }),
          ...formatters,
        }}
        classNames={{
          root: cn("w-fit", defaultClassNames.root),
          months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
          month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
          nav: cn("absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1", defaultClassNames.nav),
          button_previous: cn(
            buttonVariants({ variant: buttonVariant }),
            "size-(--cell-size) select-none p-0 aria-disabled:opacity-50",
            defaultClassNames.button_previous,
          ),
          button_next: cn(
            buttonVariants({ variant: buttonVariant }),
            "size-(--cell-size) select-none p-0 aria-disabled:opacity-50",
            defaultClassNames.button_next,
          ),
          month_caption: cn("flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)", defaultClassNames.month_caption),
          dropdowns: cn("flex h-(--cell-size) w-full items-center justify-center gap-1.5 font-medium text-sm", defaultClassNames.dropdowns),
          dropdown_root: cn("relative rounded-(--cell-radius)", defaultClassNames.dropdown_root),
          dropdown: cn("absolute inset-0 bg-popover opacity-0", defaultClassNames.dropdown),
          caption_label: cn(
            "select-none font-medium",
            captionLayout === "label"
              ? "text-sm"
              : "flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
            defaultClassNames.caption_label,
          ),
          table: "w-full border-collapse",
          weekdays: cn("flex", defaultClassNames.weekdays),
          weekday: cn(
            "flex-1 select-none rounded-(--cell-radius) font-normal text-[0.8rem] text-muted-foreground",
            defaultClassNames.weekday,
          ),
          week: cn("mt-2 flex w-full", defaultClassNames.week),
          week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
          week_number: cn("select-none text-[0.8rem] text-muted-foreground", defaultClassNames.week_number),
          day: cn(
            "group/day relative aspect-square h-full w-full select-none rounded-(--cell-radius) p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
            props.showWeekNumber
              ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
              : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
            defaultClassNames.day,
          ),
          range_start: cn(
            "relative isolate z-0 rounded-l-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-muted",
            defaultClassNames.range_start,
          ),
          range_middle: cn("rounded-none", defaultClassNames.range_middle),
          range_end: cn(
            "relative isolate z-0 rounded-r-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-muted",
            defaultClassNames.range_end,
          ),
          today: cn("rounded-(--cell-radius) bg-muted text-foreground data-[selected=true]:rounded-none", defaultClassNames.today),
          outside: cn("text-muted-foreground aria-selected:text-muted-foreground", defaultClassNames.outside),
          disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
          hidden: cn("invisible", defaultClassNames.hidden),
          ...classNames,
        }}
        components={{
          Root: CalendarRoot,
          Chevron: CalendarChevron,
          DayButton: CalendarDayButtonSlot,
          WeekNumber: CalendarWeekNumber,
          ...components,
        }}
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

  useEffect(
    function focusDayButtonWhenFocusedModifierChanges() {
      if (!modifiers.focused) return
      ref.current?.focus()
    },
    [modifiers.focused],
  )

  return (
    <Button
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 font-normal leading-none data-[range-end=true]:rounded-(--cell-radius) data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) data-[range-end=true]:bg-primary data-[range-middle=true]:bg-muted data-[range-start=true]:bg-primary data-[selected-single=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:text-foreground data-[range-start=true]:text-primary-foreground data-[selected-single=true]:text-primary-foreground group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50 dark:hover:text-foreground [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
