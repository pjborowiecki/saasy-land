import type { JSX } from "react"

import { Outlet, createFileRoute } from "@tanstack/react-router"

import { preloadNamespaces } from "~/src/integrations/use-intl/i18n.messages"
import { getCurrentLocale } from "~/src/integrations/use-intl/i18n.utils"

import { Footer } from "~/src/presentation/components/custom/landing-page/components/footer"
import { MotionProvider } from "~/src/presentation/components/custom/landing-page/components/motion-provider"
import { Navigation } from "~/src/presentation/components/custom/landing-page/components/navigation"
import { PageFrame } from "~/src/presentation/components/custom/landing-page/components/page-frame"

const LandingPageLayout = (): JSX.Element => (
  <div className="dark relative isolate min-h-svh bg-background text-foreground">
    <PageFrame />
    <MotionProvider>
      <Navigation />
      <main className="relative z-10">
        <Outlet />
      </main>
      <Footer />
    </MotionProvider>
  </div>
)

export const Route = createFileRoute("/_landing")({
  component: LandingPageLayout,
  loader: ({ context }) =>
    preloadNamespaces({
      locale: getCurrentLocale(),
      namespaces: ["auth.validations", "pages.landing", "pages.newsletter", "product.errors", "product.validations", "user.validations"],
      queryClient: context.queryClient,
    }),
  staticData: {
    namespaces: ["auth.validations", "pages.landing", "pages.newsletter", "product.errors", "product.validations", "user.validations"],
  },
})
