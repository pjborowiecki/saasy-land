import type { JSX } from "react"

import { Outlet, createFileRoute } from "@tanstack/react-router"

import { requireSignedIn } from "~/src/integrations/better-auth/auth.routes"
import { preloadNamespaces } from "~/src/integrations/use-intl/i18n.messages"
import { getCurrentLocale } from "~/src/integrations/use-intl/i18n.utils"

import { SidebarInset, SidebarProvider } from "~/src/presentation/components/shadcn/sidebar"

import { AppAccount } from "~/src/presentation/components/custom/app/components/app-account"
import { AppLayoutHeader } from "~/src/presentation/components/custom/app/components/app-layout-header"
import { AppSidebar } from "~/src/presentation/components/custom/app/components/app-sidebar"
import { Background } from "~/src/presentation/components/custom/background"

const AppLayout = (): JSX.Element => {
  const { session } = Route.useRouteContext()

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar>
        <AppAccount email={session.user.email} name={session.user.name || session.user.email} />
      </AppSidebar>
      <SidebarInset className="relative min-h-0 min-w-0 overflow-hidden">
        <Background className="z-[-1]" glow={false} />
        <AppLayoutHeader />
        <div className="custom-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-5 pb-6 md:px-6 md:pt-7 md:pb-8">
          <div className="mx-auto w-full max-w-5xl">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export const Route = createFileRoute("/app")({
  beforeLoad: requireSignedIn,
  component: AppLayout,
  loader: ({ context }) =>
    preloadNamespaces({
      locale: getCurrentLocale(),
      namespaces: ["auth.errors", "pages.app"],
      queryClient: context.queryClient,
    }),
  staticData: { namespaces: ["auth.errors", "pages.app"] },
})
