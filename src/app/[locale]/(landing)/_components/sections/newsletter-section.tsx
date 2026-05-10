import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Button } from "~/src/components/shadcn/button"
import { Input } from "~/src/components/shadcn/input"

export async function NewsletterSection(): Promise<JSX.Element> {
  const t = await getTranslations("landingPage.newsletter")

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-24">
      <div className="relative flex flex-col items-center overflow-hidden rounded-[3rem] border border-border/50 bg-background/80 p-10 text-center backdrop-blur-md md:p-20">
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />

        <h2 className="relative z-10 mb-4 font-medium text-3xl text-foreground tracking-tight md:text-5xl">{t("title")}</h2>
        <p className="relative z-10 mb-10 max-w-lg text-base text-muted-foreground">{t("description")}</p>

        <form className="relative z-10 flex w-full max-w-md flex-col gap-4 sm:flex-row">
          <Input type="email" placeholder={t("placeholder")} className="h-12 flex-1 rounded-xl bg-background/50 px-4" />
          <Button
            type="button"
            className="h-12 whitespace-nowrap rounded-xl bg-linear-to-b from-primary to-primary/80 px-6 text-primary-foreground shadow-[0_0_15px_-3px_var(--color-primary)] transition-all hover:opacity-90"
          >
            {t("button")}
          </Button>
        </form>
      </div>
    </section>
  )
}
