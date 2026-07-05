import type { JSX } from "react"

import { ArrowRight, Code2, Star } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { CONSTANTS } from "~/src/constants"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { cn } from "~/src/lib/utils"

import { buttonVariants } from "~/src/components/shadcn/button"

export async function HeroSection(): Promise<JSX.Element> {
  const t = await getTranslations("landingPage.hero")

  return (
    <section className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pt-48 pb-24 text-center">
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href={CONSTANTS.APP_GITHUB_URL}
        className="mb-10 inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md transition-colors hover:bg-white/5"
      >
        <Star className="size-4 text-primary" />
        {t("badge")}
        <ArrowRight className="size-3 text-muted-foreground" />
      </Link>

      <h1 className="mb-8 max-w-4xl text-6xl leading-[1.05] font-bold tracking-tighter text-foreground sm:text-7xl lg:text-8xl">
        {t("titlePart1")}
        <span className="bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">{t("titlePart2")}</span>
      </h1>

      <p className="mb-12 max-w-2xl text-lg leading-relaxed font-normal text-muted-foreground md:text-xl">{t("description")}</p>

      <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
        <Link
          href={CONSTANTS.ROUTES.SIGN_UP}
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-12 w-full rounded-xl bg-linear-to-b from-primary to-primary/80 px-8 text-primary-foreground shadow-[0_0_15px_-3px_var(--color-primary)] transition-all hover:opacity-90 sm:w-auto",
          )}
        >
          {t("startBuilding")}
          <ArrowRight className="ml-2 size-4" />
        </Link>

        <Link
          href={CONSTANTS.APP_GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ size: "lg", variant: "outline" }),
            "h-12 w-full rounded-xl bg-background/50 px-8 backdrop-blur-md transition-all hover:bg-white/5 sm:w-auto",
          )}
        >
          <Code2 className="mr-2 size-4" />
          {t("viewRecipes")}
        </Link>
      </div>
    </section>
  )
}
