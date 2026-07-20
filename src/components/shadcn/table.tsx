"use client"

import type { ComponentProps, JSX } from "react"

import { cn } from "~/src/lib/utils"

function Table({ className, containerClassName, ...props }: ComponentProps<"table"> & { containerClassName?: string }): JSX.Element {
  return (
    <div data-slot="table-container" className={cn("relative w-full", containerClassName ?? "custom-scrollbar overflow-x-auto")}>
      <table data-slot="table" className={cn("w-full caption-bottom text-xs", className)} {...props} />
    </div>
  )
}

function TableHeader({ className, ...props }: ComponentProps<"thead">): JSX.Element {
  return <thead data-slot="table-header" className={cn("[&_tr]:border-b", className)} {...props} />
}

function TableBody({ className, ...props }: ComponentProps<"tbody">): JSX.Element {
  return <tbody data-slot="table-body" className={cn("[&_tr:last-child]:border-0", className)} {...props} />
}

function TableFooter({ className, ...props }: ComponentProps<"tfoot">): JSX.Element {
  return <tfoot data-slot="table-footer" className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)} {...props} />
}

function TableRow({ className, ...props }: ComponentProps<"tr">): JSX.Element {
  return (
    <tr
      data-slot="table-row"
      className={cn("border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted", className)}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: ComponentProps<"th">): JSX.Element {
  return (
    <th
      data-slot="table-head"
      className={cn("h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0", className)}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: ComponentProps<"td">): JSX.Element {
  return <td data-slot="table-cell" className={cn("p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0", className)} {...props} />
}

function TableCaption({ className, ...props }: ComponentProps<"caption">): JSX.Element {
  return <caption data-slot="table-caption" className={cn("mt-4 text-xs text-muted-foreground", className)} {...props} />
}

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow }
