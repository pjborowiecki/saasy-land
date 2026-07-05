import type { JSX } from "react"

import { Background } from "~/src/components/custom/background"

import { AuthHeader } from "~/src/app/[locale]/(auth)/auth/_components/auth-header"

export default function AuthLayout({ children }: Readonly<LayoutProps<"/[locale]/auth">>): JSX.Element {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background text-muted-foreground antialiased selection:bg-primary/30 selection:text-primary-foreground">
      <Background />
      <AuthHeader />
      <main className="relative flex flex-1 flex-col items-center justify-center">{children}</main>
    </div>
  )
}
