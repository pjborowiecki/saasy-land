import type { JSX } from "react"

import { Rocket } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { CONSTANTS } from "~/src/constants"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { cn } from "~/src/lib/utils"

import { buttonVariants } from "~/src/components/shadcn/_lib/button-variants"

import { ThemeSwitchClient } from "~/src/components/custom/theme-switch"

export async function Navigation(): Promise<JSX.Element> {
  const [t, themeT] = await Promise.all([
    getTranslations("pages.landing.components.navigation"),
    getTranslations("components.custom.theme-switch"),
  ])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg border border-border/50 bg-linear-to-br from-muted to-muted/50 transition-colors group-hover:border-border">
            <Rocket className="size-4 text-foreground" />
          </div>
          <span className="text-lg font-medium tracking-tight text-foreground">{CONSTANTS.APP_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {(["about", "features", "pricing", "faq", "docs", "blog"] as const).map((item) => (
            <Link
              key={item}
              href={`#${item}`}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(`items.${item}`)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <div className="hidden w-28 sm:block">
            <ThemeSwitchClient
              darkLabel={themeT("dark")}
              label={themeT("label")}
              lightLabel={themeT("light")}
              placeholder={themeT("placeholder")}
              systemLabel={themeT("system")}
            />
          </div>

          <Link
            href={CONSTANTS.ROUTES.SIGN_UP}
            className={cn(
              buttonVariants(),
              "h-9 rounded-lg bg-linear-to-b from-primary to-primary/80 px-4 text-primary-foreground shadow-[0_0_20px_-5px_var(--color-primary)] transition-all hover:opacity-90",
            )}
          >
            {t("getStarted")}
          </Link>
        </div>
      </div>
    </header>
  )
}
