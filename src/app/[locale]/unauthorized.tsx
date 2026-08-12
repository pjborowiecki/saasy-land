import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { cn } from "~/src/utils"

import { buttonVariants } from "~/src/presentation/components/shadcn/_lib/button-variants"

import { ROUTES } from "~/src/routes"

/*
 * The 401 lands in the same steel world as the gate it bounced you from: committed
 * dark, condensed caps, one hairline control. The status code is the one measured
 * fact on the page, so it is the one thing set in mono.
 */
const SIGN_IN_LINK_CLASS =
  "mt-10 h-11 gap-2 rounded-lg border-border bg-transparent px-8 text-body-sm font-medium text-foreground transition-[background-color,border-color,color,transform] duration-200 ease-exp hover:bg-muted dark:border-border dark:bg-transparent dark:hover:bg-muted"

export default async function Unauthorized(): Promise<JSX.Element> {
  const t = await getTranslations("errors.unauthorized")

  return (
    <main className="dark flex min-h-svh flex-1 flex-col items-center justify-center bg-background px-6 py-24 text-foreground md:px-10">
      <div className="flex w-full max-w-105 flex-col items-start">
        <p className="font-mono text-spec text-primary uppercase tabular-nums">401</p>
        <h1 className="mt-4 text-headline-support text-balance text-foreground">{t("title")}</h1>
        <p className="mt-4 text-body text-pretty text-muted-foreground">{t("description")}</p>

        <Link className={cn(buttonVariants({ variant: "outline" }), SIGN_IN_LINK_CLASS)} href={ROUTES.SIGN_IN}>
          {t("signIn")}
        </Link>
      </div>
    </main>
  )
}
