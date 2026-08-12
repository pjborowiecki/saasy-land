import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/src/presentation/components/shadcn/accordion"

import { AccordionMarker } from "~/src/app/[locale]/(landing)/_components/accordion-marker"
import { ConceptLoop } from "~/src/app/[locale]/(landing)/_components/concept-loop"
import { Reveal } from "~/src/app/[locale]/(landing)/_components/reveal"

const MASTERCLASS_TOPICS = ["architecture", "auth", "billing", "testing", "i18n", "deployment"] as const

/** The first chapter is open on arrival, so the column never reads as an empty list of headings. */
const MASTERCLASS_DEFAULT_OPEN: string[] = ["architecture"]

const SECOND_CARD_DELAY_MS = 100

interface BuilderCardProps {
  readonly body: string
  readonly imageAlt: string
  readonly spec: string
  readonly title: string
}

/**
 * The page designer, being used rather than photographed: a section is selected, its padding and
 * alignment change, the canvas responds, and the page publishes. A screenshot can only show that
 * the editor exists; the claim this card makes is that a marketing team can drive it.
 */
function BuilderCard({ body, imageAlt, spec, title }: BuilderCardProps): JSX.Element {
  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card">
      <ConceptLoop className="border-b border-border" label={imageAlt} name="page-designer" />
      <div className="p-7 md:p-9">
        <h3 className="text-headline-support text-balance text-foreground">{title}</h3>
        <p className="mt-3 max-w-[52ch] text-body text-pretty text-muted-foreground">{body}</p>
        <p className="mt-7 flex items-center gap-2.5">
          <span aria-hidden className="size-1.25 shrink-0 rounded-xs bg-ring" />
          <span className="font-mono text-spec text-foreground">{spec}</span>
        </p>
      </div>
    </article>
  )
}

/**
 * The chapter list is an accordion, not a list of titles.
 *
 * Six one-line headings told the visitor the course has six chapters and nothing about what is in
 * them, which is the question someone deciding between the two tiers is actually asking. Each row
 * now opens onto what that chapter covers, in the same idiom the FAQ uses further down the page.
 *
 * The topics resolve their own copy rather than taking it as a prop: the array would otherwise be
 * rebuilt in the caller's scope on every render for a list that is fixed at build time. Both
 * components render on the server, so a second `getTranslations` costs nothing.
 */
async function MasterclassCard({ body, label, title }: Readonly<{ body: string; label: string; title: string }>): Promise<JSX.Element> {
  const t = await getTranslations("pages.landing.studio")

  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-7 md:p-9">
      <h3 className="text-headline-support text-balance text-foreground">{title}</h3>
      <p className="mt-3 text-body text-pretty text-muted-foreground">{body}</p>

      <p className="mt-8 font-mono text-label text-muted-foreground uppercase">{label}</p>
      <Accordion className="mt-4 border-t border-border" defaultExpandedKeys={MASTERCLASS_DEFAULT_OPEN}>
        {MASTERCLASS_TOPICS.map((topic) => (
          <AccordionItem id={topic} key={topic}>
            <AccordionTrigger className="gap-6 rounded-none py-4 text-body-sm font-medium text-foreground transition-colors duration-200 ease-exp hover:text-muted-foreground hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden">
              <span className="min-w-0 text-pretty">{t(`masterclass.topics.${topic}.title`)}</span>
              <AccordionMarker />
            </AccordionTrigger>
            <AccordionContent className="pr-6 pb-5 text-body-sm text-pretty text-muted-foreground">
              {t(`masterclass.topics.${topic}.body`)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </article>
  )
}

/**
 * The two things a starter kit almost never includes.
 *
 * Two cards of unequal weight rather than a symmetrical pair: the page designer is the surprising
 * claim and gets the real screenshot, the masterclass is the supporting one and gets a list. The
 * asymmetry is the argument.
 *
 * The screenshot is the actual page designer running inside the admin. There is no browser chrome
 * drawn around it and no laptop mock under it, because both would be decoration around an image
 * that is already the evidence.
 */
export async function StudioSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.landing.studio")

  return (
    <section className="relative border-t border-border" id="studio">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <Reveal variant="heading">
          <h2 className="max-w-[18ch] text-headline-peak text-balance text-foreground">{t("title")}</h2>
          <p className="mt-5 max-w-2xl text-lead text-pretty text-muted-foreground">{t("description")}</p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:mt-20 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <BuilderCard body={t("builder.body")} imageAlt={t("builder.imageAlt")} spec={t("builder.spec")} title={t("builder.title")} />
          </Reveal>

          <Reveal delay={SECOND_CARD_DELAY_MS}>
            <MasterclassCard body={t("masterclass.body")} label={t("masterclass.label")} title={t("masterclass.title")} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
