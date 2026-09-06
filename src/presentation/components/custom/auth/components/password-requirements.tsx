import type { JSX } from "react"

import { Check, Minus } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { PASSWORD_MIN_LENGTH, getPasswordRuleState } from "~/src/integrations/better-auth/auth.constraints"

import { cn } from "~/src/lib/cn"

interface PasswordRuleProps {
  readonly label: string
  readonly satisfied: boolean
  readonly stateLabel: string
}

const PasswordRule = ({ label, satisfied, stateLabel }: Readonly<PasswordRuleProps>): JSX.Element => (
  <li className="flex items-start gap-2.5">
    <span
      aria-hidden
      className={cn(
        "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-xs border transition-colors duration-200 ease-exp",
        satisfied ? "border-foreground bg-foreground text-background" : "border-muted-foreground text-muted-foreground",
      )}
    >
      {satisfied ? <Check className="size-3" strokeWidth={2} /> : <Minus className="size-3" strokeWidth={2} />}
    </span>
    <span className="text-body-sm text-foreground">{label}</span>
    <span className="sr-only">{stateLabel}</span>
  </li>
)

interface PasswordRequirementsProps {
  readonly confirmPassword: string
  readonly password: string
}

export const PasswordRequirements = ({ confirmPassword, password }: PasswordRequirementsProps): JSX.Element => {
  const t = useTranslations("auth.validations")
  const { isMinLength, hasUppercase, hasSpecialChar } = getPasswordRuleState(password)
  const passwordsMatch = password.length > 0 && password === confirmPassword

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
      <PasswordRule label={t("passwordsMatch")} satisfied={passwordsMatch} stateLabel={passwordsMatch ? metLabel : unmetLabel} />
    </ul>
  )
}
