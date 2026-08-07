import { Suspense, type JSX } from "react"

import { Background } from "~/src/presentation/components/custom/background"

import { AuthHeader, AuthHeaderFallback } from "~/src/app/[locale]/(auth)/auth/_components/auth-header"
import { AuthPageFallback } from "~/src/app/[locale]/(auth)/auth/_components/auth-page-fallback"

const authHeaderFallback = <AuthHeaderFallback />
const authPageFallback = <AuthPageFallback />

export default function AuthLayout({ children }: Readonly<LayoutProps<"/[locale]/auth">>): JSX.Element {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background text-muted-foreground antialiased selection:bg-primary/30 selection:text-primary-foreground">
      <Background />
      <Suspense fallback={authHeaderFallback}>
        <AuthHeader />
      </Suspense>
      <main className="relative flex flex-1 flex-col items-center justify-center">
        <Suspense fallback={authPageFallback}>{children}</Suspense>
      </main>
    </div>
  )
}
