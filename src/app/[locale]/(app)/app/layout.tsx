import type { JSX } from "react"

export default function AppLayout({ children }: Readonly<LayoutProps<"/[locale]/app">>): JSX.Element {
  return <>{children}</>
}
