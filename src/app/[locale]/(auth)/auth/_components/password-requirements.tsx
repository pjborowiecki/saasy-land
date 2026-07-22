"use client"

import type { JSX } from "react"

import { BadgeCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import { useFormContext, useWatch } from "react-hook-form"

import { getPasswordRuleState, PASSWORD_MIN_LENGTH } from "~/src/integrations/better-auth/auth.constraints"

import { cn } from "~/src/utils"

interface PasswordRequirementsProps {
  readonly fieldName?: string
}

export function PasswordRequirements({ fieldName = "password" }: PasswordRequirementsProps): JSX.Element {
  const t = useTranslations("auth.validations")
  const { control } = useFormContext<Record<string, string>>()
  const password = useWatch({ control, name: fieldName }) ?? ""
  const { isMinLength, hasUppercase, hasSpecialChar } = getPasswordRuleState(password)

  return (
    <ul className="flex list-none flex-col gap-1.5 py-2 text-xs text-muted-foreground" aria-label={t("requirementsListLabel")}>
      <li className="flex items-center gap-2">
        <BadgeCheck aria-hidden="true" className={cn("size-4", isMinLength ? "text-primary" : "text-destructive-foreground")} />
        <span>{t("atLeastMinCharactersLong", { min: PASSWORD_MIN_LENGTH })}</span>
      </li>
      <li className="flex items-center gap-2">
        <BadgeCheck aria-hidden="true" className={cn("size-4", hasSpecialChar ? "text-primary" : "text-destructive-foreground")} />
        <span>{t("atLeastOneSpecialCharacter")}</span>
      </li>
      <li className="flex items-center gap-2">
        <BadgeCheck aria-hidden="true" className={cn("size-4", hasUppercase ? "text-primary" : "text-destructive-foreground")} />
        <span>{t("atLeastOneUppercase")}</span>
      </li>
    </ul>
  )
}
