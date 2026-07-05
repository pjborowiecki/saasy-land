import type { JSX } from "react"

import { Bell, Search } from "lucide-react"

import { Button } from "~/src/components/shadcn/button"
import { Input } from "~/src/components/shadcn/input"
import { Kbd, KbdGroup } from "~/src/components/shadcn/kbd"
import { SidebarTrigger } from "~/src/components/shadcn/sidebar"

import { AdminBreadcrumbs } from "~/src/components/custom/admin-breadcrumbs"

export function AdminLayoutHeader(): JSX.Element {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/40 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-2" />
        <AdminBreadcrumbs />
      </div>
      <div className="flex items-center gap-4">
        <AdminHeaderSearch />
        <Button variant="ghost" size="icon" className="text-muted-foreground" aria-label="Notifications">
          <Bell className="size-5" />
        </Button>
      </div>
    </header>
  )
}

function AdminHeaderSearch(): JSX.Element {
  return (
    <div className="group relative hidden sm:block">
      <Search className="absolute top-1/2 left-3 size-[18px] -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
      <Input
        placeholder="Search global..."
        className="h-9 w-64 border-border/40 bg-secondary/20 pr-4 pl-10 text-sm text-foreground transition-all placeholder:text-muted-foreground focus:border-border/80 focus:bg-secondary/40"
      />
      <KbdGroup className="absolute top-1/2 right-2 hidden -translate-y-1/2 lg:inline-flex">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </div>
  )
}
