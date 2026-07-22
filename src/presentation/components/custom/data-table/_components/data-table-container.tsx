"use client"

import type { ComponentProps, JSX } from "react"

import { cn } from "~/src/utils"

import { DATA_TABLE } from "~/src/presentation/components/custom/data-table/_constants/data-table.constants"

export type DataTableContainerProps = ComponentProps<"div">

export function DataTableContainer({ children, className, ...props }: Readonly<DataTableContainerProps>): JSX.Element {
  return (
    <div {...props} className={cn(DATA_TABLE.CLASSES.LAYOUT.CONTAINER, className)} data-testid={DATA_TABLE.TEST_IDS.CONTAINER}>
      {children}
    </div>
  )
}
