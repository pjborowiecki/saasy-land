import { type JSX, Suspense } from "react"

import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router"

import { preloadNamespaces } from "~/src/integrations/use-intl/i18n.messages"
import { deLocalizePathname } from "~/src/integrations/use-intl/i18n.paths"
import { getCurrentLocale } from "~/src/integrations/use-intl/i18n.utils"

import { AuthGateFrame } from "~/src/presentation/components/custom/auth/components/auth-gate-frame"
import { AuthHeader, AuthHeaderFallback } from "~/src/presentation/components/custom/auth/components/auth-header"

import { ROUTES } from "~/src/routes"

/*
 * AUTH SHELL — the seam between the marketing site and the console.
 *
 * The landing commits to dark inside a `.dark` wrapper; so does this, for the same
 * reason: the visitor clicked a CTA on the dark ground and must not land somewhere
 * else. The composition is a split. One half restates why they are here, drawn on the
 * same measured field as the marketing hero; the other is the form; a single hairline
 * states the seam. Below `lg` the left half drops out entirely and the form takes the
 * full width, because a 390px sliver of it is decoration, not context.
 *
 * The form column owns the vertical centering, so the short pages (two-factor,
 * verify-email) and the tall ones (sign-up) share one shell rather than two.
 * `py-28` clears the 5rem chrome row on both edges when the content is short and
 * simply grows into a scroll when it is not.
 */
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
