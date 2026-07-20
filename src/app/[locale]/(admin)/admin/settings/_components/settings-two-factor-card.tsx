"use client"

import { type JSX, useCallback, useState } from "react"

import { useTranslations } from "next-intl"

import { Button } from "~/src/components/shadcn/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/src/components/shadcn/card"
import { Dialog, DialogDescription, DialogHeader, DialogTitle } from "~/src/components/shadcn/dialog"

import { SettingsTwoFactorConfirmStep } from "~/src/app/[locale]/(admin)/admin/settings/_components/settings-two-factor-confirm-step"
import { SettingsTwoFactorPasswordStep } from "~/src/app/[locale]/(admin)/admin/settings/_components/settings-two-factor-password-step"
import { SettingsTwoFactorVerifyStep } from "~/src/app/[locale]/(admin)/admin/settings/_components/settings-two-factor-verify-step"

type EnableStep = "confirm" | "password" | "verify"

export function SettingsTwoFactorCard(): JSX.Element {
  const t = useTranslations("pages.admin.settings")
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<EnableStep>("password")
  const [totpUri, setTotpUri] = useState<string>("")
  const [backupCodes, setBackupCodes] = useState<readonly string[]>([])

  const resetDialog = useCallback(() => {
    setStep("password")
    setTotpUri("")
    setBackupCodes([])
  }, [])

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen)
      if (!nextOpen) {
        resetDialog()
      }
    },
    [resetDialog],
  )

  const handleEnableOpen = useCallback(() => {
    setOpen(true)
  }, [])

  const handleEnabled = useCallback((nextTotpUri: string, codes: readonly string[]) => {
    setTotpUri(nextTotpUri)
    setBackupCodes(codes)
    setStep("verify")
  }, [])

  const handleVerified = useCallback(() => {
    setStep("confirm")
  }, [])

  const handleDone = useCallback(() => {
    handleOpenChange(false)
  }, [handleOpenChange])

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border/40 p-5">
          <CardTitle className="mb-1 text-base font-medium text-foreground">{t("security.twoFactor.title")}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">{t("security.twoFactor.description")}</CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{t("security.twoFactor.app")}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("security.twoFactor.appDescription")}</p>
            </div>
            <Button className="h-8 shrink-0 px-4 text-xs" onPress={handleEnableOpen} size="sm" variant="outline">
              {t("security.twoFactor.enable")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog className="max-w-md" isOpen={open} onOpenChange={handleOpenChange}>
        <DialogHeader>
          <DialogTitle>{t("security.twoFactor.dialogTitle")}</DialogTitle>
          <DialogDescription>{t("security.twoFactor.dialogDescription")}</DialogDescription>
        </DialogHeader>

        {step === "password" ? <SettingsTwoFactorPasswordStep onEnabled={handleEnabled} /> : undefined}
        {step === "verify" ? <SettingsTwoFactorVerifyStep onVerified={handleVerified} totpUri={totpUri} /> : undefined}
        {step === "confirm" ? <SettingsTwoFactorConfirmStep backupCodes={backupCodes} onDone={handleDone} /> : undefined}
      </Dialog>
    </>
  )
}
