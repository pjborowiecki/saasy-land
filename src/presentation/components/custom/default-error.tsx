import { useEffect } from "react"

import { type ErrorComponentProps, useRouter } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { getGlobalErrorMessages } from "~/src/integrations/use-intl/i18n.errors"
import { getCurrentLocale } from "~/src/integrations/use-intl/i18n.utils"

import { Button } from "~/src/presentation/components/shadcn/button"

const ErrorContent = ({
  error,
  retry,
  title,
  description,
  retryLabel,
}: Readonly<{
  error: unknown
  retry: () => void
  title: string
  description: string
  retryLabel: string
}>) => {
  useEffect(() => {
    console.error(error)
  }, [error])
  return (
    <main role="alert" className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-medium tracking-tight text-foreground">{title}</h1>
        <p className="max-w-prose text-sm text-muted-foreground">{description}</p>
      </div>
      <Button variant="outline" onPress={retry}>
        {retryLabel}
      </Button>
    </main>
  )
}

export const DefaultError = ({ error, reset }: ErrorComponentProps) => {
  const t = useTranslations("errors.boundary")
  const router = useRouter()
  const retry = () => {
    void router.invalidate().then(reset)
  }
  return <ErrorContent error={error} retry={retry} title={t("title")} description={t("description")} retryLabel={t("retry")} />
}

// The root boundary also handles failures before translations and providers are available.
export const GlobalError = ({ error, reset }: ErrorComponentProps) => {
  const messages = getGlobalErrorMessages(getCurrentLocale())
  return <ErrorContent error={error} retry={reset} title={messages.title} description={messages.description} retryLabel={messages.retry} />
}
