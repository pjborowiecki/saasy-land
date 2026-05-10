import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/src/components/shadcn/accordion"

export async function FaqSection(): Promise<JSX.Element> {
  const t = await getTranslations("landingPage.faq")

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-24">
      <h2 className="mb-16 text-center font-medium text-4xl text-foreground tracking-tight md:text-5xl">
        {t("titlePart1")}
        <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">{t("titlePart2")}</span>
      </h2>
      <div className="mx-auto max-w-[1100px]">
        <Accordion className="w-full space-y-4" defaultValue={["item-1"]}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-2xl border border-border/50 bg-background/80 px-6 backdrop-blur-md transition-colors hover:bg-muted/80 data-[state=open]:bg-muted/80"
            >
              <AccordionTrigger className="font-medium text-base hover:no-underline">{t(`q${i}`)}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed">{t(`a${i}`)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
