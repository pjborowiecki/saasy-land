import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { CLI_CHOICES } from "~/src/app/[locale]/(landing)/_components/cli-choices"
import { CliChoiceOption, CliChoiceRow, CliConfigurator } from "~/src/app/[locale]/(landing)/_components/cli-configurator"
import { Reveal } from "~/src/app/[locale]/(landing)/_components/reveal"

const FRAME_DELAY_MS = 100

/**
 * THE CLI.
 *
 * Sits between the manifesto and the line for a reason. The manifesto has just argued that the
 * first three months are wasted; the line is about to list what already runs. Between the two, the
 * visitor needs to know how they get from one to the other, and the honest answer is one command
 * and five questions.
 *
 * One frame with two halves that do different jobs. The matrix is a working control: it is the
 * option space, it is what a buyer uses to decide whether their project is one this tool can make,
 * and every answer rewrites the command in the frame's header so the thing they copy is the thing
 * they configured. The run beside it is the consequence of having chosen, which is the part that
 * carries the speed. Neither would be convincing alone, and either one repeating the other would
 * be worse than either alone.
 *
 * The flags, the defaults and the state belong to the client component; this one only translates.
 * `pages.landing` is withheld from the client provider, so the rows are composed here with the
 * labels already resolved and handed across as children rather than shipping the whole landing
 * catalogue to the browser for ten nouns.
 */
export async function CliSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.landing.cli")

  return (
    <section className="relative border-t border-border" id="cli">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <Reveal variant="heading">
          <h2 className="max-w-[18ch] text-headline-peak text-balance text-foreground">{t("title")}</h2>
          <p className="mt-5 max-w-2xl text-lead text-pretty text-muted-foreground">{t("lead")}</p>
        </Reveal>

        <Reveal className="mt-14 md:mt-20" delay={FRAME_DELAY_MS}>
          <CliConfigurator
            copiedLabel={t("copied")}
            copyLabel={t("copy")}
            footnote={t("choicesLabel")}
            greenLabel={t("run.green")}
            moduleLabel={t("run.modules")}
          >
            {CLI_CHOICES.map((choice) => (
              <CliChoiceRow key={choice.id} label={t(`choices.${choice.id}.label`)}>
                {choice.options.map((option) => (
                  <CliChoiceOption
                    choiceId={choice.id}
                    key={option.id}
                    label={t(`choices.${choice.id}.options.${option.id}`)}
                    optionId={option.id}
                  />
                ))}
              </CliChoiceRow>
            ))}
          </CliConfigurator>
        </Reveal>

        <Reveal className="mt-8 flex max-w-3xl items-start gap-3" delay={FRAME_DELAY_MS} variant="quiet">
          <span aria-hidden className="mt-2 size-1.25 shrink-0 rounded-xs bg-ring" />
          <span className="text-body-sm text-pretty text-muted-foreground">{t("reuse")}</span>
        </Reveal>
      </div>
    </section>
  )
}
