import type { JSX } from "react"

import { Rocket } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { APP_NAME } from "~/src/presentation/branding"

export function AuthHeaderFallback(): JSX.Element {
  return (
    <header className="absolute top-0 right-0 left-0 z-50">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-linear-to-br from-secondary to-background">
            <Rocket className="size-4 text-foreground" />
          </div>
          <span className="text-lg font-medium tracking-tight text-foreground">{APP_NAME}</span>
        </div>
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      </div>
    </header>
  )
}

export async function AuthHeader(): Promise<JSX.Element> {
  const t = await getTranslations("auth.layout")

  return (
    <header className="absolute top-0 right-0 left-0 z-50">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-linear-to-br from-secondary to-background transition-colors group-hover:border-border/80">
            <Rocket className="size-4 text-foreground" />
          </div>
          <span className="text-lg font-medium tracking-tight text-foreground">{APP_NAME}</span>
        </Link>

        <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          {t("backToHome")}
        </Link>
      </div>
    </header>
  )
}
