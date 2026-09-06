import type { JSX, ReactNode } from "react"

import { useTranslations } from "use-intl/react"

import { CLI_CHOICES, CLI_EXTRAS, CLI_GROUPS } from "~/src/data/cli"

import {
  CliChoiceOption,
  CliChoiceRow,
  CliConfigurator,
  CliExtraOption,
  CliGroupHeading,
} from "~/src/presentation/components/custom/landing-page/components/cli-configurator"
import { Reveal } from "~/src/presentation/components/custom/landing-page/components/reveal"

const FRAME_DELAY_MS = 100

const EXTRAS_GROUP = "extras"

/** One band of questions. Its own component so the matrix's nesting does not stack on the frame's. */
const CliGroup = ({ group }: Readonly<{ group: string }>): JSX.Element => {
  const t = useTranslations("pages.landing.cli")

  return (
    <>
      <CliGroupHeading label={t(`groups.${group}`)} />
      {CLI_CHOICES.filter((choice) => choice.group === group).map((choice) => (
        <CliChoiceRow choiceId={choice.id} key={choice.id} label={t(`choices.${choice.id}.label`)}>
          {choice.options.map((option) => (
            <CliChoiceOption
              choiceId={choice.id}
              key={option.id}
              label={t(`choices.${choice.id}.options.${option.id}`)}
              optionId={option.id}
              unavailableReason={"unavailableWhen" in option ? t(`choices.${choice.id}.unavailable.${option.id}`) : undefined}
            />
          ))}
        </CliChoiceRow>
      ))}
      {group === EXTRAS_GROUP && (
        <CliChoiceRow choiceId={group} label={t("choices.extras.label")}>
          {CLI_EXTRAS.map((extra) => (
            <CliExtraOption
              extraId={extra.id}
              key={extra.id}
              label={t(`choices.extras.options.${extra.id}`)}
              unavailableReason={"unavailableWhen" in extra ? t(`choices.extras.unavailable.${extra.id}`) : undefined}
            />
          ))}
        </CliChoiceRow>
      )}
    </>
  )
}

const REUSE_TAGS = { accent: (chunks: ReactNode) => <strong className="font-medium text-foreground">{chunks}</strong> }

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
export const CliSection = (): JSX.Element => {
  const t = useTranslations("pages.landing.cli")

  return (
    <section className="relative border-t border-border" id="cli">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <Reveal variant="heading">
          <h2 className="max-w-[18ch] text-headline-peak text-balance text-foreground">{t("title")}</h2>
          <p className="mt-5 max-w-2xl text-lead text-pretty text-muted-foreground">{t("lead")}</p>
        </Reveal>

        <Reveal className="mt-14 md:mt-20" delay={FRAME_DELAY_MS}>
          <CliConfigurator
            commandLabel={t("commandLabel")}
            copiedLabel={t("copied")}
            copyLabel={t("copy")}
            footnote={t("choicesLabel")}
            greenLabel={t("run.green")}
            moduleLabel={t("run.modules")}
            nextLabel={t("nextLabel")}
            outputLabel={t("run.label")}
            runnerLabel={t("runner")}
          >
            {CLI_GROUPS.map((group) => (
              <CliGroup group={group} key={group} />
            ))}
          </CliConfigurator>
        </Reveal>

        <Reveal className="mt-14 md:mt-16" delay={FRAME_DELAY_MS} variant="quiet">
          <h3 className="max-w-[34ch] text-headline-support text-balance text-foreground">{t("reuse.title")}</h3>
          <p className="mt-5 max-w-2xl text-lead text-pretty text-muted-foreground">{t.rich("reuse.body", REUSE_TAGS)}</p>
        </Reveal>
      </div>
    </section>
  )
}
