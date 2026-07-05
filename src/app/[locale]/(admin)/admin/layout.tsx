import { type JSX, Suspense } from "react"

import { requireAdminPanel } from "~/src/integrations/better-auth/auth.guards"

import { SidebarInset, SidebarProvider } from "~/src/components/shadcn/sidebar"
import { Skeleton } from "~/src/components/shadcn/skeleton"

import { AdminSidebar } from "~/src/components/custom/admin-sidebar"

import { AdminLayoutHeader } from "~/src/app/[locale]/(admin)/admin/_components/admin-layout-header"
import { UserWidget } from "~/src/app/[locale]/(admin)/admin/_components/user-widget"

const ADMIN_LAYOUT_FALLBACK = (
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

const SIDEBAR_USER_WIDGET_FALLBACK = <div className="h-10 animate-pulse rounded-lg bg-sidebar-accent/50" />

export default function AdminLayout(props: Readonly<LayoutProps<"/[locale]/admin">>): JSX.Element {
  return (
    <Suspense fallback={ADMIN_LAYOUT_FALLBACK}>
      <AdminLayoutContent {...props} />
    </Suspense>
  )
}

async function AdminLayoutContent({ children }: Readonly<LayoutProps<"/[locale]/admin">>): Promise<JSX.Element> {
  await requireAdminPanel()

  return (
    <SidebarProvider>
      <AdminSidebar>
        <Suspense fallback={SIDEBAR_USER_WIDGET_FALLBACK}>
          <UserWidget />
        </Suspense>
      </AdminSidebar>
      <SidebarInset className="relative">
        <div className="pointer-events-none fixed inset-0 z-[-1] bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <AdminLayoutHeader />
        <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto p-4 pt-4 md:p-6 md:pt-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
