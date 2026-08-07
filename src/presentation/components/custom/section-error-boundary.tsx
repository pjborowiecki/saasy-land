"use client"

import { catchError, type ErrorInfo } from "next/error"
import { useCallback, type JSX, type ReactNode } from "react"

import { useTranslations } from "next-intl"

import { Button } from "~/src/presentation/components/shadcn/button"

interface SectionErrorBoundaryProps {
  readonly children: ReactNode
  /** Overrides the default heading when a section deserves a more specific one. */
  readonly title?: string
}

/**
 * Component-level error boundary for a subtree that may fail while rendering.
 *
 * Unlike an `error.tsx` route boundary this can wrap any part of the tree, and unlike a
 * hand-rolled React boundary it does not swallow `notFound()` or `redirect()`. `retry()`
 * re-runs the failed Server Components rather than only resetting client state.
 */
function SectionErrorFallback({ title }: SectionErrorBoundaryProps, { error, retry }: ErrorInfo): JSX.Element {
  const t = useTranslations("errors.boundary")

  const handleRetry = useCallback(() => {
    retry()
  }, [retry])

  return (
    <div role="alert" className="flex flex-col items-start gap-3 rounded-lg border border-border bg-secondary/20 p-6">
      <div>
        <p className="text-sm font-medium text-foreground">{title ?? t("title")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>
        {process.env.NODE_ENV === "development" && error instanceof Error ? (
          <p className="mt-2 font-mono text-xs text-muted-foreground">{error.message}</p>
        ) : undefined}
      </div>
      <Button variant="outline" size="sm" onPress={handleRetry}>
        {t("retry")}
      </Button>
    </div>
  )
}

export const SectionErrorBoundary = catchError(SectionErrorFallback)
