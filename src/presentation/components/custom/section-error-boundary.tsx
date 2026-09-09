import type { JSX, ReactNode } from "react"

import { useQueryErrorResetBoundary } from "@tanstack/react-query"
import { CatchBoundary, type ErrorComponentProps, useRouterState } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { Button } from "~/src/presentation/components/shadcn/button"

const SectionErrorFallback = ({ error, reset }: ErrorComponentProps): JSX.Element => {
  const { reset: resetQueries } = useQueryErrorResetBoundary()
  const t = useTranslations("errors.boundary")

  return (
    <div role="alert" className="flex flex-col items-start gap-3 rounded-lg border border-border bg-secondary/20 p-6">
      <div>
        <p className="text-sm font-medium text-foreground">{t("title")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>
        {import.meta.env.DEV && error instanceof Error ? (
          <p className="mt-2 font-mono text-xs text-muted-foreground">{error.message}</p>
        ) : undefined}
      </div>
      <Button
        variant="outline"
        size="sm"
        onPress={() => {
          resetQueries()
          reset()
        }}
      >
        {t("retry")}
      </Button>
    </div>
  )
}

export const SectionErrorBoundary = ({ children }: { readonly children: ReactNode }): JSX.Element => {
  const href = useRouterState({ select: (state) => state.location.href })
  return (
    <CatchBoundary getResetKey={() => href} errorComponent={SectionErrorFallback}>
      {children}
    </CatchBoundary>
  )
}
