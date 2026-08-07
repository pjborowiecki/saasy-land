"use client"

import { type JSX, useCallback, useEffect } from "react"

import { cn } from "~/src/utils"

import "~/src/presentation/styles/globals.css"

import { geistMono, geistSans } from "~/src/presentation/fonts"

interface GlobalErrorProps {
  readonly error: Error & { digest?: string }
  readonly retry: () => void
}

/**
 * Last-resort boundary: it replaces the root layout, so `NextIntlClientProvider` is not
 * mounted and translated copy is unavailable here by construction. The strings stay in
 * English on purpose — a failure this deep means the locale machinery may be what broke.
 */
export default function GlobalError({ error, retry }: GlobalErrorProps): JSX.Element {
  const handleRetry = useCallback(() => {
    retry()
  }, [retry])

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en" className={cn(geistSans.variable, geistMono.variable, "h-full bg-background text-foreground antialiased")}>
      <body className="flex min-h-full flex-col">
        <main role="alert" className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-medium tracking-tight text-foreground">Something went wrong</h1>
            <p className="max-w-prose text-sm text-muted-foreground">The application ran into an unexpected error.</p>
            {error.digest === undefined ? undefined : <p className="font-mono text-xs text-muted-foreground">{error.digest}</p>}
          </div>
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex h-9 items-center rounded-md border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Reload
          </button>
        </main>
      </body>
    </html>
  )
}
