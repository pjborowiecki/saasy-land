import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/src/presentation/components/shadcn/accordion"

const FAQ_DEFAULT_OPEN: string[] = ["item-1"]
const FAQ_ITEMS = ["1", "2", "3", "4", "5", "6"] as const

export async function FaqSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.landing.faq")

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-24">
      <h2 className="mb-16 text-center text-4xl font-medium tracking-tight text-foreground md:text-5xl">
        {t("titlePart1")}
        <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">{t("titlePart2")}</span>
      </h2>
      <div className="mx-auto max-w-[1100px]">
        <Accordion className="w-full space-y-4" defaultExpandedKeys={FAQ_DEFAULT_OPEN}>
          {FAQ_ITEMS.map((i) => (
            <AccordionItem
              key={i}
              id={`item-${i}`}
              className="rounded-2xl border border-border/50 bg-background/80 px-6 backdrop-blur-md transition-colors hover:bg-muted/80 data-expanded:bg-muted/80"
            >
              <AccordionTrigger className="text-base font-medium hover:no-underline">{t(`q${i}`)}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{t(`a${i}`)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
