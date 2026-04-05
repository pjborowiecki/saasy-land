import type { Metadata } from "next"
import type { JSX } from "react"

import { CONSTANTS } from "~/src/constants"
import { geistMono, geistSans } from "~/src/lib/fonts"
import { cn } from "~/src/lib/ui"

import "~/src/styles/globals.css"

export const metadata: Metadata = {
  title: CONSTANTS.APP_NAME,
  description: CONSTANTS.APP_DESCRIPTION,
}

export default function RootLayout({ children }: Readonly<LayoutProps<"/">>): JSX.Element {
  return (
    <html lang="en" className={cn(geistSans.variable, geistMono.variable, "h-full antialiased")}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}
