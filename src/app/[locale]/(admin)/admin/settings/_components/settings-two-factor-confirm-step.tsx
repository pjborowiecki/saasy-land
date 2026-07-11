"use client"

import { type JSX, useCallback } from "react"

import { useTranslations } from "next-intl"

import { Button } from "~/src/components/shadcn/button"

interface SettingsTwoFactorConfirmStepProps {
  readonly backupCodes: readonly string[]
  readonly onDone: () => void
}

export function SettingsTwoFactorConfirmStep({ backupCodes, onDone }: Readonly<SettingsTwoFactorConfirmStepProps>): JSX.Element {
  const t = useTranslations("pages.admin.settings")

  const handleDone = useCallback(() => {
    onDone()
  }, [onDone])

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{t("security.twoFactor.backupCodesDescription")}</p>
      <ul className="grid grid-cols-2 gap-2 rounded-md bg-secondary/40 p-3 font-mono text-xs text-foreground">
        {backupCodes.map((code) => (
          <li key={code}>{code}</li>
        ))}
      </ul>
      <Button onClick={handleDone} type="button">
        {t("security.twoFactor.done")}
      </Button>
    </div>
  )
}
