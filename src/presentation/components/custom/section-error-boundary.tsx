import { type JSX, type ReactNode, createContext, use, useCallback } from "react"

import { useQueryErrorResetBoundary } from "@tanstack/react-query"
import { CatchBoundary, type ErrorComponentProps, useRouterState } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { Button } from "~/src/presentation/components/shadcn/button"

interface SectionErrorBoundaryProps {
  readonly children: ReactNode
  /** Overrides the default heading when a section deserves a more specific one. */
  readonly title?: string
}

const SectionTitleContext = createContext<string | undefined>(undefined)

const SectionErrorFallback = ({ error, reset }: ErrorComponentProps): JSX.Element => {
  const title = use(SectionTitleContext)
  const { reset: resetQueries } = useQueryErrorResetBoundary()
  const t = useTranslations("errors.boundary")

  const handleRetry = useCallback(() => {
    resetQueries()
    reset()
  }, [reset, resetQueries])

  return (
    <div role="alert" className="flex flex-col items-start gap-3 rounded-lg border border-border bg-secondary/20 p-6">
      <div>
        <p className="text-sm font-medium text-foreground">{title ?? t("title")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>
        {import.meta.env.DEV && error instanceof Error ? (
          <p className="mt-2 font-mono text-xs text-muted-foreground">{error.message}</p>
        ) : undefined}
      </div>
      <Button variant="outline" size="sm" onPress={handleRetry}>
        {t("retry")}
      </Button>
    </div>
  )
}

export const SectionErrorBoundary = ({ children, title }: SectionErrorBoundaryProps): JSX.Element => {
  const href = useRouterState({ select: (state) => state.location.href })
  return (
    <SectionTitleContext value={title}>
      <CatchBoundary getResetKey={() => href} errorComponent={SectionErrorFallback}>
        {children}
      </CatchBoundary>
    </SectionTitleContext>
  )
}
