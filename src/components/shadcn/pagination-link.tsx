"use client"

import { type ComponentProps, type JSX, useMemo } from "react"

import { cn } from "~/src/lib/utils"

import { Button } from "~/src/components/shadcn/button"

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ComponentProps<typeof Button>, "size"> &
  ComponentProps<"a">

function PaginationLink({ className, isActive, size = "icon", children, ...props }: PaginationLinkProps): JSX.Element {
  const anchorRender = useMemo(
    () => (
      <a aria-current={isActive === true ? "page" : undefined} data-slot="pagination-link" data-active={isActive} {...props}>
        {children}
      </a>
    ),
    [children, isActive, props],
  )

  return (
    <Button
      variant={isActive === true ? "outline" : "ghost"}
      size={size}
      className={cn(className)}
      nativeButton={false}
      render={anchorRender}
    />
  )
}

export { PaginationLink, type PaginationLinkProps }
