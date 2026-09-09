import { type JSX, Suspense } from "react"

import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router"

import { preloadNamespaces } from "~/src/integrations/use-intl/i18n.messages"
import { deLocalizePathname } from "~/src/integrations/use-intl/i18n.paths"
import { getCurrentLocale } from "~/src/integrations/use-intl/i18n.utils"

import { AuthGateFrame } from "~/src/presentation/components/custom/auth/components/auth-gate-frame"
import { AuthHeader, AuthHeaderFallback } from "~/src/presentation/components/custom/auth/components/auth-header"

import { ROUTES } from "~/src/routes"

const authHeaderFallback = <AuthHeaderFallback />

const AuthLayout = (): JSX.Element => {
  const isSignUp = useRouterState({ select: (state) => deLocalizePathname(state.location.pathname) === ROUTES.SIGN_UP })

  return (
    <div className="dark relative grid min-h-svh grid-cols-1 bg-background text-foreground antialiased lg:grid-cols-2">
      <Suspense fallback={authHeaderFallback}>
        <AuthHeader />
      </Suspense>

      <AuthGateFrame isSignUp={isSignUp} />

      <main className="relative flex flex-col items-center justify-center px-6 py-28 md:px-10 lg:py-32">
        <Outlet />
      </main>
    </div>
  )
}

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
  loader: ({ context }) =>
    preloadNamespaces({
      locale: getCurrentLocale(),
      namespaces: ["auth.errors", "auth.form", "auth.gate", "auth.layout", "auth.oauth", "auth.validations", "verification.validations"],
      queryClient: context.queryClient,
    }),
  staticData: {
    namespaces: ["auth.errors", "auth.form", "auth.gate", "auth.layout", "auth.oauth", "auth.validations", "verification.validations"],
  },
})
