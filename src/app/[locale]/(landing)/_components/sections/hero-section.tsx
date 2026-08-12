import type { JSX } from "react"

import { ArrowRight } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { ConceptLoop } from "~/src/app/[locale]/(landing)/_components/concept-loop"
import { InstallCommand } from "~/src/app/[locale]/(landing)/_components/install-command"

/**
 * THE HERO
 *
 * A server component with no client JavaScript in it at all, and that is a design decision as
 * much as a performance one. The headline is the LCP element; animating it from a GSAP timeline
 * would hide it until hydration and push the largest paint past the point where the visitor has
 * already decided. The entrance is four `tw-animate-css` enter animations with staggered delays,
 * which the compositor starts at first paint and finishes before hydration lands.
 *
 * Left-aligned, not centred. A centred hero is the default the eye has stopped reading; anchoring
 * the block to the measure the rest of the page is drawn on says the page has a grid.
 */
export async function HeroSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.landing.hero")

  return (
    <section className="relative overflow-hidden" id="floor">
      {/* The field and the signal, on one fixed-size layer each: masked gradients are cheap to
          paint once and ruinous to repaint, so neither is ever attached to a scrolling box. */}
      <div aria-hidden className="field-grid pointer-events-none absolute inset-0" />
      <div aria-hidden className="field-signal pointer-events-none absolute inset-0" />

      <div className="relative mx-auto w-full max-w-7xl px-6 pt-32 pb-16 md:px-10 md:pt-40 md:pb-20">
        {/* 20ch, not 13: the headline names the cost and the cure in one sentence now, and at the
            old measure a 53-character line broke into five. Three lines is the rhythm the section
            is composed around — `text-balance` evens them, the measure decides how many. */}
        <h1 className="max-w-[20ch] animate-in text-display-hero text-balance text-foreground duration-700 ease-exp fade-in-0 fill-mode-both slide-in-from-bottom-3 motion-reduce:animate-none">
          {t("title")}
        </h1>

        <p className="mt-6 max-w-2xl animate-in text-lead text-pretty text-muted-foreground delay-100 duration-700 ease-exp fade-in-0 fill-mode-both slide-in-from-bottom-3 motion-reduce:animate-none">
          {t("description")}
        </p>

        <div className="mt-9 flex animate-in flex-wrap items-center gap-x-3 gap-y-4 delay-200 duration-700 ease-exp fade-in-0 fill-mode-both slide-in-from-bottom-3 motion-reduce:animate-none">
          <a
            className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-body-sm font-semibold text-primary-foreground transition-[background-color,transform] duration-200 ease-exp hover:bg-primary/88 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring active:translate-y-px"
            href="#pricing"
          >
            {t("ctaPrimary")}
          </a>
          <a
            className="group inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-card/60 px-5 text-body-sm font-medium text-foreground transition-[background-color,border-color,transform] duration-200 ease-exp hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring active:translate-y-px"
            href="#line"
          >
            {t("ctaSecondary")}
            <ArrowRight
              aria-hidden
              className="size-3.5 text-muted-foreground transition-transform duration-200 ease-exp group-hover:translate-x-0.5 motion-reduce:transition-none"
              strokeWidth={2}
            />
          </a>
        </div>

        {/*
         * The product, not a drawing of the product, and not a still of it either: the console
         * assembles itself, rail then header then figures then chart then table, in the order an
         * operator's eye builds it. It is deliberately allowed to run past the fold, so the
         * visitor has to scroll to finish watching.
         *
         * The poster is the resolved frame, which means the largest paint is the same picture it
         * was when this was a screenshot; the video only takes over once it can play, and under
         * reduced motion it never does.
         *
         * The frame is a real bezel with a real control in its title bar rather than three
         * decorative window dots. A page selling a codebase should let you start it.
         */}
        <div className="mt-16 animate-in overflow-hidden rounded-xl border border-border bg-card delay-300 duration-1000 ease-exp fade-in-0 fill-mode-both slide-in-from-bottom-4 motion-reduce:animate-none md:mt-20">
          <InstallCommand copiedLabel={t("surface.copied")} copyLabel={t("surface.copy")} />
          {/* Scaled into a 340px column the whole console is a grey smudge, so on a phone the
              frame is enlarged and clipped to its left third, where the rail, the figures and the
              chart are still legible. Full width from `md` up. */}
          <ConceptLoop
            className="w-[190%] max-w-none border-t border-border sm:w-[135%] md:w-full"
            label={t("surface.imageAlt")}
            name="app-tour"
          />
        </div>
      </div>
    </section>
  )
}
