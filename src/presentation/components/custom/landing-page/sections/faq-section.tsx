import type { JSX } from "react"

import { ArrowRight } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/src/presentation/components/shadcn/accordion"

import { AccordionMarker } from "~/src/presentation/components/custom/landing-page/components/accordion-marker"
import { Reveal } from "~/src/presentation/components/custom/landing-page/components/reveal"

import { CONTACT_EMAIL } from "~/src/presentation/branding"

const FAQ_ITEM_IDS = ["q1", "q5", "q3", "q2", "q4", "q11", "q6", "q7", "q8", "q9", "q10"] as const

const FAQ_DEFAULT_OPEN: string[] = ["q1"]

const ACCORDION_DELAY_MS = 100

const FaqRow = ({ answer, id, question }: Readonly<{ answer: string; id: string; question: string }>): JSX.Element => (
  <AccordionItem id={id}>
    <AccordionTrigger className="gap-8 rounded-none py-5 text-body-sm font-medium text-foreground transition-colors duration-200 ease-exp hover:text-muted-foreground hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden">
      <span className="min-w-0 text-pretty">{question}</span>
      <AccordionMarker />
    </AccordionTrigger>
    <AccordionContent className="max-w-[68ch] pr-8 pb-6 text-body text-pretty text-muted-foreground">{answer}</AccordionContent>
  </AccordionItem>
)

export const FaqSection = (): JSX.Element => {
  const t = useTranslations("pages.landing.faq")

  return (
    <section className="relative border-t border-border" id="faq">
      <div className="mx-auto grid w-full max-w-7xl gap-x-16 gap-y-12 px-6 py-24 md:px-10 md:py-32 lg:grid-cols-[1fr_1.5fr] lg:items-start">
        <Reveal variant="heading" className="lg:sticky lg:top-24">
          <h2 className="max-w-[14ch] text-headline-peak text-balance text-foreground">{t("title")}</h2>
          <p className="mt-5 max-w-md text-lead text-pretty text-muted-foreground">{t("lead")}</p>
          <a
            className="group mt-10 inline-flex items-center gap-2 rounded-sm text-body-sm font-medium text-foreground transition-colors duration-200 ease-exp hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            {t("contact")}
            <ArrowRight
              aria-hidden
              className="size-3.5 transition-transform duration-200 ease-exp group-hover:translate-x-0.5 motion-reduce:transition-none"
              strokeWidth={2}
            />
          </a>
          <p className="mt-3 font-mono text-spec text-pretty text-muted-foreground">{t("contactNote")}</p>
        </Reveal>

        <Reveal className="min-w-0" delay={ACCORDION_DELAY_MS}>
          <Accordion className="border-t border-border" defaultExpandedKeys={FAQ_DEFAULT_OPEN}>
            {FAQ_ITEM_IDS.map((id) => (
              <FaqRow answer={t(`items.${id}.answer`)} id={id} key={id} question={t(`items.${id}.question`)} />
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
