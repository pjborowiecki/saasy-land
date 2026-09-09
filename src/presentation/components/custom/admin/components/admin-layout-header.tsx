import { type JSX, Suspense } from "react"

import { SidebarTrigger } from "~/src/presentation/components/shadcn/sidebar"

import { AdminBreadcrumbs } from "~/src/presentation/components/custom/admin/components/admin-breadcrumbs"
import { AdminCommandPalette } from "~/src/presentation/components/custom/admin/components/admin-command-palette"

export const AdminLayoutHeader = (): JSX.Element => (
  <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background/80 px-3 backdrop-blur-xl md:px-5">
    <div className="flex min-w-0 items-center gap-2">
      <SidebarTrigger className="-ml-1 text-muted-foreground" />
      <span aria-hidden className="hidden h-4 w-px bg-border sm:block" />
      <Suspense>
        <AdminBreadcrumbs />
      </Suspense>
    </div>
    <div className="flex shrink-0 items-center gap-2">
      <AdminCommandPalette />
    </div>
  </header>
)
