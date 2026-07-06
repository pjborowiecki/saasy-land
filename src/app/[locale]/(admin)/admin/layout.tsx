import { type JSX, Suspense } from "react"

import { SidebarInset, SidebarProvider } from "~/src/components/shadcn/sidebar"

import { Background } from "~/src/components/custom/background"

import { AdminLayoutHeader } from "~/src/app/[locale]/(admin)/admin/_components/admin-layout-header"
import { AdminSidebar } from "~/src/app/[locale]/(admin)/admin/_components/admin-sidebar"
import { UserWidget } from "~/src/app/[locale]/(admin)/admin/_components/user-widget"

const SIDEBAR_USER_WIDGET_FALLBACK = <div className="h-10 animate-pulse rounded-lg bg-sidebar-accent/50" />

export default function AdminLayout({ children }: Readonly<LayoutProps<"/[locale]/admin">>): JSX.Element {
  return (
    <SidebarProvider>
      <AdminSidebar>
        <Suspense fallback={SIDEBAR_USER_WIDGET_FALLBACK}>
          <UserWidget />
        </Suspense>
      </AdminSidebar>

      <SidebarInset className="relative">
        <Background className="z-[-1]" glow={false} />
        <AdminLayoutHeader />
        <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto p-4 pt-4 md:p-6 md:pt-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
