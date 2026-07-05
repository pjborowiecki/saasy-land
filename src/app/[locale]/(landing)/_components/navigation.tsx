import type { JSX } from "react"

import { Moon, Rocket } from "lucide-react"
import { useTranslations } from "next-intl"

import { CONSTANTS } from "~/src/constants"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { cn } from "~/src/lib/utils"

import { buttonVariants } from "~/src/components/shadcn/button"

export function Navigation(): JSX.Element {
  const t = useTranslations("navigation")

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-2xl">
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
          <button type="button" className="flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground">
            <Moon className="size-5" />
          </button>

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
