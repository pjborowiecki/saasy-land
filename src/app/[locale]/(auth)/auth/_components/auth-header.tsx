import type { JSX } from "react"

import { Rocket } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { CONSTANTS } from "~/src/constants"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

export async function AuthHeader(): Promise<JSX.Element> {
  const t = await getTranslations("auth.layout")

  return (
    <header className="absolute top-0 right-0 left-0 z-50">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-linear-to-br from-secondary to-background transition-colors group-hover:border-border/80">
            <Rocket className="size-4 text-foreground" />
          </div>
          <span className="font-medium text-foreground text-lg tracking-tight">{CONSTANTS.APP_NAME}</span>
        </Link>

        <Link href="/" className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground">
          {t("backToHome")}
        </Link>
      </div>
    </header>
  )
}
