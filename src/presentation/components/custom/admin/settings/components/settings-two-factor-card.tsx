import { type JSX, useCallback, useState } from "react"

import { useRouter } from "@tanstack/react-router"
import { toast } from "sonner"
import { useTranslations } from "use-intl/react"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/src/presentation/components/shadcn/card"
import { Dialog, DialogDescription, DialogHeader, DialogTitle } from "~/src/presentation/components/shadcn/dialog"

import { SettingsTwoFactorConfirmStep } from "~/src/presentation/components/custom/admin/settings/components/settings-two-factor-confirm-step"
import { SettingsTwoFactorDisableStep } from "~/src/presentation/components/custom/admin/settings/components/settings-two-factor-disable-step"
import { SettingsTwoFactorPasswordStep } from "~/src/presentation/components/custom/admin/settings/components/settings-two-factor-password-step"
import { SettingsTwoFactorVerifyStep } from "~/src/presentation/components/custom/admin/settings/components/settings-two-factor-verify-step"

type DialogStep = "confirm" | "disable" | "password" | "verify"

interface SettingsTwoFactorCardProps {
  readonly twoFactorEnabled: boolean
}

export const SettingsTwoFactorCard = ({ twoFactorEnabled }: Readonly<SettingsTwoFactorCardProps>): JSX.Element => {
  const t = useTranslations("pages.admin.settings")
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<DialogStep>("password")
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
    setStep(twoFactorEnabled ? "disable" : "password")
    setOpen(true)
  }, [twoFactorEnabled])

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
    void router.invalidate()
  }, [handleOpenChange, router])

  const handleDisabled = useCallback(() => {
    handleOpenChange(false)
    toast.success(t("security.twoFactor.disabledSuccess"))
    void router.invalidate()
  }, [handleOpenChange, router, t])

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border p-5">
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
              {twoFactorEnabled ? t("security.twoFactor.disable") : t("security.twoFactor.enable")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog className="max-w-md" isOpen={open} onOpenChange={handleOpenChange}>
        <DialogHeader>
          <DialogTitle>{step === "disable" ? t("security.twoFactor.disableDialogTitle") : t("security.twoFactor.dialogTitle")}</DialogTitle>
          <DialogDescription>
            {step === "disable" ? t("security.twoFactor.disableDialogDescription") : t("security.twoFactor.dialogDescription")}
          </DialogDescription>
        </DialogHeader>

        {step === "password" ? <SettingsTwoFactorPasswordStep onEnabled={handleEnabled} /> : undefined}
        {step === "verify" ? <SettingsTwoFactorVerifyStep onVerified={handleVerified} totpUri={totpUri} /> : undefined}
        {step === "confirm" ? <SettingsTwoFactorConfirmStep backupCodes={backupCodes} onDone={handleDone} /> : undefined}
        {step === "disable" ? <SettingsTwoFactorDisableStep onDisabled={handleDisabled} /> : undefined}
      </Dialog>
    </>
  )
}
