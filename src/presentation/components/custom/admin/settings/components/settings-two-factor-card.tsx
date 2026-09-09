import { type JSX, useState } from "react"

import { useIsMutating } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "use-intl/react"

import { TWO_FACTOR_MUTATION_KEYS } from "~/src/modules/two-factor/two-factor.constants"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/src/presentation/components/shadcn/card"
import { Dialog, DialogDescription, DialogHeader, DialogTitle } from "~/src/presentation/components/shadcn/dialog"

import { SettingsTwoFactorConfirmStep } from "~/src/presentation/components/custom/admin/settings/components/settings-two-factor-confirm-step"
import { SettingsTwoFactorDisableStep } from "~/src/presentation/components/custom/admin/settings/components/settings-two-factor-disable-step"
import { SettingsTwoFactorPasswordStep } from "~/src/presentation/components/custom/admin/settings/components/settings-two-factor-password-step"
import { SettingsTwoFactorVerifyStep } from "~/src/presentation/components/custom/admin/settings/components/settings-two-factor-verify-step"

type TwoFactorDialog =
  | { step: "disable" | "password" }
  | { step: "verify"; totpUri: string; backupCodes: readonly string[] }
  | { step: "confirm"; backupCodes: readonly string[] }

interface SettingsTwoFactorCardProps {
  readonly twoFactorEnabled: boolean
}

export const SettingsTwoFactorCard = ({ twoFactorEnabled }: Readonly<SettingsTwoFactorCardProps>): JSX.Element => {
  const t = useTranslations("pages.admin.settings")
  const router = useRouter()
  const [dialog, setDialog] = useState<TwoFactorDialog>()
  const isPending = useIsMutating({ mutationKey: TWO_FACTOR_MUTATION_KEYS.ALL }) > 0

  const closeDialog = () => {
    setDialog(undefined)
    void router.invalidate()
  }

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
            <Button
              className="h-8 shrink-0 px-4 text-xs"
              isDisabled={isPending}
              onPress={() => {
                setDialog({ step: twoFactorEnabled ? "disable" : "password" })
              }}
              size="sm"
              variant="outline"
            >
              {isPending && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
              {twoFactorEnabled ? t("security.twoFactor.disable") : t("security.twoFactor.enable")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog
        className="max-w-md"
        isOpen={Boolean(dialog)}
        onOpenChange={(open) => {
          if (!open) {
            setDialog(undefined)
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {dialog?.step === "disable" ? t("security.twoFactor.disableDialogTitle") : t("security.twoFactor.dialogTitle")}
          </DialogTitle>
          <DialogDescription>
            {dialog?.step === "disable" ? t("security.twoFactor.disableDialogDescription") : t("security.twoFactor.dialogDescription")}
          </DialogDescription>
        </DialogHeader>

        {dialog?.step === "password" ? (
          <SettingsTwoFactorPasswordStep
            onEnabled={(totpUri, backupCodes) => {
              setDialog({ backupCodes, step: "verify", totpUri })
            }}
          />
        ) : undefined}
        {dialog?.step === "verify" ? (
          <SettingsTwoFactorVerifyStep
            onVerified={() => {
              setDialog({ backupCodes: dialog.backupCodes, step: "confirm" })
            }}
            totpUri={dialog.totpUri}
          />
        ) : undefined}
        {dialog?.step === "confirm" ? <SettingsTwoFactorConfirmStep backupCodes={dialog.backupCodes} onDone={closeDialog} /> : undefined}
        {dialog?.step === "disable" ? (
          <SettingsTwoFactorDisableStep
            onDisabled={() => {
              closeDialog()
              toast.success(t("security.twoFactor.disabledSuccess"))
            }}
          />
        ) : undefined}
      </Dialog>
    </>
  )
}
