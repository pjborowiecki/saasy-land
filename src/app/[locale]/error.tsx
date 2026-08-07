"use client"

import { type JSX, useCallback, useEffect } from "react"

import { useTranslations } from "next-intl"

import { Button } from "~/src/presentation/components/shadcn/button"

interface ErrorPageProps {
  readonly error: Error & { digest?: string }
  readonly retry: () => void
}

export default function ErrorPage({ error, retry }: ErrorPageProps): JSX.Element {
  const t = useTranslations("errors.boundary")

  const handleRetry = useCallback(() => {
    retry()
  }, [retry])

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main role="alert" className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-medium tracking-tight text-foreground">{t("title")}</h1>
        <p className="max-w-prose text-sm text-muted-foreground">{t("description")}</p>
        {error.digest === undefined ? undefined : <p className="font-mono text-xs text-muted-foreground">{error.digest}</p>}
      </div>
      <Button variant="outline" onPress={handleRetry}>
        {t("retry")}
      </Button>
    </main>
  )
}
