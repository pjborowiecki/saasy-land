import type { JSX } from "react"

import { ArrowRight, ArrowUpRight } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { HighlightGroup, HighlightItem } from "~/src/app/[locale]/(landing)/_components/shared/hover-highlight"
import { Reveal } from "~/src/app/[locale]/(landing)/_components/shared/reveal"

const GRID_DELAY_MS = 100

/** Until there is a submission form, the invitation is an email the author actually reads. */
const FEATURE_HREF = "mailto:hello@saasyland.com?subject=Built%20on%20SaaSy%20Land"

/**
 * The two products, and whether each one is reachable yet.
 *
 * `href` is `undefined` until a domain actually answers. A case study linking to a site that does
 * not resolve is worse than no case study, because the one thing this section is selling is that
 * every claim on the page can be checked by clicking it.
 */
const CASES = [
  { href: "https://reactprojects.com", id: "reactprojects", isLive: true },
  { href: undefined, id: "marte", isLive: false },
] as const

/** Plain text until the domain answers, a link the moment it does. Two shapes, so two returns. */
function CaseName({ href, name }: Readonly<{ href: string | undefined; name: string }>): JSX.Element | string {
  if (href === undefined) {
    return name
  }

  return (
    <a
      className="inline-flex items-center gap-1.5 after:absolute after:inset-0 hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {name}
      <ArrowUpRight
        aria-hidden
        className="size-4 text-muted-foreground transition-transform duration-200 ease-exp group-hover:-translate-y-0.5"
        strokeWidth={2}
      />
    </a>
  )
}

interface CaseProps {
  readonly body: string
  readonly href: string | undefined
  readonly isLive: boolean
  readonly kind: string
  readonly modules: string
  readonly modulesLabel: string
  readonly name: string
  readonly status: string
}

function CaseCard({ body, href, isLive, kind, modules, modulesLabel, name, status }: CaseProps): JSX.Element {
  return (
    <HighlightItem className="group bg-background" contentClassName="flex h-full flex-col px-6 py-8 md:px-8 md:py-10" id={name}>
      <p className="flex items-center gap-2.5 font-mono text-label text-muted-foreground uppercase">
        <span
          aria-hidden
          className={isLive ? "size-1.25 shrink-0 rounded-xs bg-ring" : "size-1.25 shrink-0 rounded-xs bg-muted-foreground/40"}
        />
        {status}
        <span aria-hidden className="text-border">
          ·
        </span>
        {kind}
      </p>

      <h3 className="mt-5 text-title text-foreground">
        <CaseName href={href} name={name} />
      </h3>

      <p className="mt-3 max-w-[54ch] text-body-sm text-pretty text-muted-foreground">{body}</p>

      <div className="mt-auto pt-8">
        <p className="font-mono text-label text-muted-foreground/70 uppercase">{modulesLabel}</p>
        <p className="mt-2 font-mono text-spec text-pretty text-muted-foreground">{modules}</p>
      </div>
    </HighlightItem>
  )
}

/**
 * WHAT IT HAS ACTUALLY BUILT.
 *
 * Placed after the claim audit and before the market comparison, which is the one slot where it
 * carries weight: the section above has just told you how to verify every number, so the natural
 * next question is whether anything real has been built with it. Answering that immediately before
 * the comparison means the reader arrives at the alternatives already holding evidence.
 *
 * Deliberately not testimonials. A quote is unfalsifiable and every competitor has a wall of them,
 * which is precisely why nobody reads them. Two URLs, the modules each one uses, and a link are
 * worth more than twenty five-star cards, because a visitor can disagree with them.
 */
export async function CasesSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.landing.cases")

  return (
    <section className="relative border-t border-border">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <Reveal variant="heading">
          <h2 className="max-w-[18ch] text-headline-peak text-balance text-foreground">{t("title")}</h2>
          <p className="mt-5 max-w-2xl text-lead text-pretty text-muted-foreground">{t("description")}</p>
        </Reveal>

        <Reveal className="mt-14 md:mt-20" delay={GRID_DELAY_MS}>
          <HighlightGroup className="grid gap-px border-y border-border bg-border md:grid-cols-2" name="cases-highlight">
            {CASES.map((entry) => (
              <CaseCard
                body={t(`items.${entry.id}.body`)}
                href={entry.href}
                isLive={entry.isLive}
                key={entry.id}
                kind={t(`items.${entry.id}.kind`)}
                modules={t(`items.${entry.id}.modules`)}
                modulesLabel={t("modulesLabel")}
                name={t(`items.${entry.id}.name`)}
                status={entry.isLive ? t("statusLive") : t("statusSoon")}
              />
            ))}
          </HighlightGroup>

          <div className="mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <p className="text-body-sm text-muted-foreground">{t("invite")}</p>
            <a
              className="group inline-flex items-center gap-2 rounded-sm text-body-sm font-medium text-foreground transition-colors duration-200 ease-exp hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              href={FEATURE_HREF}
            >
              {t("inviteCta")}
              <ArrowRight
                aria-hidden
                className="size-3.5 transition-transform duration-200 ease-exp group-hover:translate-x-0.5 motion-reduce:transition-none"
                strokeWidth={2}
              />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
