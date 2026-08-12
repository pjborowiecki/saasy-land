"use client"

import type { ComponentProps, JSX } from "react"

import { ChevronsUpDown } from "lucide-react"

import { SidebarMenuButton } from "~/src/presentation/components/shadcn/sidebar"

const FIRST_CHARACTER = 0
const INITIALS_LENGTH = 2

interface UserWidgetTriggerProps {
  readonly email: string
  readonly name: string
}

/**
 * Initials, not a generic person glyph.
 *
 * Every account in the console got the same lucide `User2` icon, which is the avatar equivalent
 * of "John Doe": it identifies nobody. Two characters off the real name identify the account
 * that is actually signed in, cost nothing to render and never 404.
 */
function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/u)
  const letters = words.map((word) => word.charAt(FIRST_CHARACTER))
  return letters.slice(FIRST_CHARACTER, INITIALS_LENGTH).join("").toUpperCase()
}

export function UserWidgetTrigger({
  email,
  name,
  ...props
}: UserWidgetTriggerProps & ComponentProps<typeof SidebarMenuButton>): JSX.Element {
  return (
    <SidebarMenuButton
      className="h-11 gap-2.5 rounded-lg px-2 data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
      size="lg"
      {...props}
    >
      <span
        aria-hidden
        className="flex aspect-square size-7 shrink-0 items-center justify-center rounded-md bg-muted text-[0.6875rem] font-semibold text-foreground"
      >
        {initialsOf(name)}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5 text-left leading-none">
        <span className="truncate text-[0.8125rem] font-medium text-foreground">{name}</span>
        <span className="truncate text-[0.6875rem] text-muted-foreground">{email}</span>
      </span>
      <ChevronsUpDown aria-hidden className="ml-auto size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.5} />
    </SidebarMenuButton>
  )
}
