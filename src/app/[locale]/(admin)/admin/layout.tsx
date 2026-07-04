import type { JSX } from "react"
import { Suspense } from "react"

import { Bell, Search } from "lucide-react"

import { requireAdminPanel } from "~/src/integrations/better-auth/auth.guards"

import { AdminBreadcrumbs } from "~/src/components/custom/admin-breadcrumbs"
import { AdminSidebar } from "~/src/components/custom/admin-sidebar"
import { Button } from "~/src/components/shadcn/button"
import { Input } from "~/src/components/shadcn/input"
import { Kbd, KbdGroup } from "~/src/components/shadcn/kbd"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/src/components/shadcn/sidebar"
import { Skeleton } from "~/src/components/shadcn/skeleton"

import { UserWidget } from "~/src/app/[locale]/(admin)/admin/_components/user-widget"

function AdminLayoutFallback(): JSX.Element {
  return (
    <div className="flex min-h-screen w-full">
      <Skeleton className="hidden h-screen w-64 shrink-0 md:block" />
      <div className="flex flex-1 flex-col">
        <Skeleton className="h-16 w-full shrink-0" />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
          <Skeleton className="min-h-96 w-full flex-1" />
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout(props: Readonly<LayoutProps<"/[locale]/admin">>): JSX.Element {
  return (
    <Suspense fallback={<AdminLayoutFallback />}>
      <AdminLayoutContent {...props} />
    </Suspense>
  )
}

async function AdminLayoutContent({ children }: Readonly<LayoutProps<"/[locale]/admin">>): Promise<JSX.Element> {
  await requireAdminPanel()

  return (
    <SidebarProvider>
      <AdminSidebar userWidget={<UserWidget />} />
      <SidebarInset className="relative">
        {/* Background Effects */}
        <div className="pointer-events-none fixed inset-0 z-[-1] bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-border/40 border-b px-4 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-2" />
            <AdminBreadcrumbs />
          </div>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="group relative hidden sm:block">
              <Search className="absolute top-1/2 left-3 size-[18px] -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
              <Input
                placeholder="Search global..."
                className="h-9 w-64 border-border/40 bg-secondary/20 pr-4 pl-10 text-foreground text-sm transition-all placeholder:text-muted-foreground focus:border-border/80 focus:bg-secondary/40"
              />
              <KbdGroup className="absolute top-1/2 right-2 hidden -translate-y-1/2 lg:inline-flex">
                <Kbd>{"⌘"}</Kbd>
                <Kbd>{"K"}</Kbd>
              </KbdGroup>
            </div>

            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Bell className="size-5" />
            </Button>
          </div>
        </header>
        <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto p-4 pt-4 md:p-6 md:pt-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
