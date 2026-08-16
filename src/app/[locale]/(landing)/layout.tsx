import type { JSX } from "react"

import { Footer } from "~/src/app/[locale]/(landing)/_components/footer/footer"
import { Navigation } from "~/src/app/[locale]/(landing)/_components/navigation/navigation"
import { MotionProvider } from "~/src/app/[locale]/(landing)/_components/shared/motion-provider"
import { PageFrame } from "~/src/app/[locale]/(landing)/_components/shared/page-frame"

export default function LandingPageLayout({ children }: Readonly<LayoutProps<"/[locale]">>): JSX.Element {
  return (
    <div className="dark relative isolate min-h-svh bg-background text-foreground">
      <PageFrame />
      <MotionProvider>
        <Navigation />
        <main className="relative z-10">{children}</main>
        <Footer />
      </MotionProvider>
    </div>
  )
}
