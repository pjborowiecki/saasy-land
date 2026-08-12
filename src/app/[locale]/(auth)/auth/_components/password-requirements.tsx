"use client"

import type { JSX } from "react"

import { useTranslations } from "next-intl"
import { useFormContext, useWatch } from "react-hook-form"

import { getPasswordRuleState, PASSWORD_MIN_LENGTH } from "~/src/integrations/better-auth/auth.constraints"

import { cn } from "~/src/utils"

/**
 * The checklist is built from the system's own marks: the spec-chip square, which takes
 * the accent once the rule is satisfied and sits muted until then, with the label
 * stepping up to the foreground alongside it. Colour is never the only cue, so each row
 * also carries its state as text for assistive technology.
 */
interface PasswordRuleProps {
  readonly label: string
  readonly satisfied: boolean
  readonly stateLabel: string
}

function PasswordRule({ label, satisfied, stateLabel }: Readonly<PasswordRuleProps>): JSX.Element {
  return (
    <li className="flex items-start gap-2.5">
      <span
        aria-hidden
        className={cn(
          "mt-2 size-1.25 shrink-0 rounded-xs transition-colors duration-200 ease-exp",
          satisfied ? "bg-ring" : "bg-muted-foreground/40",
        )}
      />
      <span className={cn("text-body-sm transition-colors duration-200 ease-exp", satisfied ? "text-foreground" : "text-muted-foreground")}>
        {label}
      </span>
      <span className="sr-only">{stateLabel}</span>
    </li>
  )
}

interface PasswordRequirementsProps {
  readonly fieldName?: string
}

export function PasswordRequirements({ fieldName = "password" }: PasswordRequirementsProps): JSX.Element {
  const t = useTranslations("auth.validations")
  const { control } = useFormContext<Record<string, string>>()
  const password = useWatch({ control, name: fieldName }) ?? ""
  const { isMinLength, hasUppercase, hasSpecialChar } = getPasswordRuleState(password)

  const metLabel = t("requirementMet")
  const unmetLabel = t("requirementNotMet")

  return (
    <ul aria-label={t("requirementsListLabel")} className="flex list-none flex-col gap-2">
      <PasswordRule
        label={t("atLeastMinCharactersLong", { min: PASSWORD_MIN_LENGTH })}
        satisfied={isMinLength}
        stateLabel={isMinLength ? metLabel : unmetLabel}
      />
      <PasswordRule
        label={t("atLeastOneSpecialCharacter")}
        satisfied={hasSpecialChar}
        stateLabel={hasSpecialChar ? metLabel : unmetLabel}
      />
      <PasswordRule label={t("atLeastOneUppercase")} satisfied={hasUppercase} stateLabel={hasUppercase ? metLabel : unmetLabel} />
    </ul>
  )
}
