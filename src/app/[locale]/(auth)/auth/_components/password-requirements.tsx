"use client"

import type { JSX } from "react"

import { BadgeCheck } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "~/src/lib/utils"

import { usePasswordRules } from "~/src/hooks/use-password-rules"

export function PasswordRequirements(): JSX.Element {
  const t = useTranslations("auth.validations")
  const { isMinLength, hasUppercase, hasSpecialChar } = usePasswordRules()

  return (
    <ul className="flex list-none flex-col gap-1.5 py-2 text-xs text-muted-foreground" aria-label={t("requirementsListLabel")}>
      <li className="flex items-center gap-2">
        <BadgeCheck aria-hidden="true" className={cn("size-4", isMinLength ? "text-primary" : "text-destructive-foreground")} />
        <span>{t("atLeastMinCharactersLong", { min: 8 })}</span>
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
