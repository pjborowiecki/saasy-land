import type { JSX } from "react"

import { Background } from "~/src/presentation/components/custom/background"

import { Footer } from "~/src/app/[locale]/(landing)/_components/footer"
import { Navigation } from "~/src/app/[locale]/(landing)/_components/navigation"

export default function LandingPageLayout({ children }: Readonly<LayoutProps<"/[locale]">>): JSX.Element {
  return (
    <>
      <Background />
      <Navigation />
      <main>{children}</main>
      <Footer />
    </>
  )
}
