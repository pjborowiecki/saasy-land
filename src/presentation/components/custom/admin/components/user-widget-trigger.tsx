import type { ComponentProps, JSX } from "react"

import { ChevronsUpDown } from "lucide-react"

import { SidebarMenuButton } from "~/src/presentation/components/shadcn/sidebar"

const INITIALS_LENGTH = 2

interface UserWidgetTriggerProps {
  readonly email: string
  readonly name: string
}

const initialsOf = (name: string): string => {
  const words = name.trim().split(/\s+/u)
  const letters = words.map((word) => word.charAt(0))
  return letters.slice(0, INITIALS_LENGTH).join("").toUpperCase()
}

export const UserWidgetTrigger = ({
  email,
  name,
  ...props
}: UserWidgetTriggerProps & ComponentProps<typeof SidebarMenuButton>): JSX.Element => (
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
