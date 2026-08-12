import { type JSX, Suspense } from "react"

import { SidebarInset, SidebarProvider } from "~/src/presentation/components/shadcn/sidebar"

import { Background } from "~/src/presentation/components/custom/background"

import { AdminAccessGate } from "~/src/app/[locale]/(admin)/admin/_components/admin-access-gate"
import { AdminLayoutHeader } from "~/src/app/[locale]/(admin)/admin/_components/admin-layout-header"
import { AdminSidebar } from "~/src/app/[locale]/(admin)/admin/_components/admin-sidebar"
import { UserWidget } from "~/src/app/[locale]/(admin)/admin/_components/user-widget"

/*
 * The console shares the marketing site's palette, type ramp and radius scale, and differs only
 * in density: the same tokens at tighter spacing, because this is a surface people work in for
 * an hour rather than read for ninety seconds.
 *
 * The ambient grid runs behind the content pane, tapered before it reaches the fold, so the
 * working area has a floor without any page needing to draw one.
 */
const SIDEBAR_USER_WIDGET_FALLBACK = <div className="h-11 animate-pulse rounded-lg bg-sidebar-accent/60" />

export default function AdminLayout({ children }: Readonly<LayoutProps<"/[locale]/admin">>): JSX.Element {
  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <Suspense>
        <AdminAccessGate />
      </Suspense>

      <AdminSidebar>
        <Suspense fallback={SIDEBAR_USER_WIDGET_FALLBACK}>
          <UserWidget />
        </Suspense>
      </AdminSidebar>

      <SidebarInset className="relative min-h-0 overflow-hidden">
        <Background className="z-[-1]" glow={false} />
        <AdminLayoutHeader />
        {/*
         * Full-bleed pages (the users console) break out of this padding with matching negative
         * margins, so the two must be changed together: `admin/users/layout.tsx` mirrors these
         * exact values.
         */}
        <div className="custom-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-5 pb-6 md:px-6 md:pt-7 md:pb-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
