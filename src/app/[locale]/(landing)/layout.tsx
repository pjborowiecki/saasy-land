import type { JSX } from "react"

export default function LandingPageLayout({ children }: Readonly<LayoutProps<"/[locale]">>): JSX.Element {
  return <>{children}</>
}
