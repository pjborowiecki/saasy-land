import type { ComponentProps, JSX } from "react"

import { cn } from "~/src/lib/cn"

const TableContainer = ({ className, ...props }: ComponentProps<"div">): JSX.Element => (
  <div data-slot="table-container" className={cn("custom-scrollbar relative w-full overflow-x-auto", className)} {...props} />
)

/*
 * 13px, not 12px, and rows a third taller than the shadcn default.
 *
 * Tables are where a console is actually used, and 12px in a 32px row is a spreadsheet: it fits
 * more and it is read less. The extra pixel and the extra padding are the difference between
 * scanning a list and squinting at one. Numeric columns should add `tabular-nums` at the call
 * site so figures stay in their columns while the data changes.
 */
const Table = ({ className, ...props }: ComponentProps<"table">): JSX.Element => (
  <table data-slot="table" className={cn("w-full caption-bottom text-[0.8125rem]", className)} {...props} />
)

const TableHeader = ({ className, ...props }: ComponentProps<"thead">): JSX.Element => (
  <thead data-slot="table-header" className={cn("[&_tr]:border-b", className)} {...props} />
)

const TableBody = ({ className, ...props }: ComponentProps<"tbody">): JSX.Element => (
  <tbody data-slot="table-body" className={cn("[&_tr:last-child]:border-0", className)} {...props} />
)

const TableFooter = ({ className, ...props }: ComponentProps<"tfoot">): JSX.Element => (
  <tfoot data-slot="table-footer" className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)} {...props} />
)

const TableRow = ({ className, ...props }: ComponentProps<"tr">): JSX.Element => (
  <tr
    data-slot="table-row"
    className={cn(
      "border-b transition-colors duration-200 ease-exp hover:bg-muted/45 has-aria-expanded:bg-muted/45 data-[state=selected]:bg-muted",
      className,
    )}
    {...props}
  />
)

const TableHead = ({ className, ...props }: ComponentProps<"th">): JSX.Element => (
  <th
    data-slot="table-head"
    className={cn(
      "h-9 px-3 text-left align-middle text-[0.6875rem] font-medium tracking-[0.04em] whitespace-nowrap text-muted-foreground uppercase has-[[role=checkbox]]:pr-0",
      className,
    )}
    {...props}
  />
)

const TableCell = ({ className, ...props }: ComponentProps<"td">): JSX.Element => (
  <td
    data-slot="table-cell"
    className={cn("px-3 py-2.5 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0", className)}
    {...props}
  />
)

const TableCaption = ({ className, ...props }: ComponentProps<"caption">): JSX.Element => (
  <caption data-slot="table-caption" className={cn("mt-4 text-xs text-muted-foreground", className)} {...props} />
)

export { Table, TableBody, TableCaption, TableCell, TableContainer, TableFooter, TableHead, TableHeader, TableRow }
