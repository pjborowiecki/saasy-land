"use client"

import { type JSX, useCallback, useState, useTransition } from "react"

import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { createOtpSlotIndices, extractTotpSecret } from "~/src/modules/two-factor/two-factor.utils"
import { verifyTotp } from "~/src/modules/two-factor/use-cases/verify-totp.use-case"

import { useActionError } from "~/src/hooks/use-action-error"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Field, FieldContent, FieldLabel } from "~/src/presentation/components/shadcn/field"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "~/src/presentation/components/shadcn/input-otp"

import { AUTH_FORM_IDS } from "~/src/app/[locale]/(auth)/auth/_constants/auth-form-ids"

const TOTP_CODE_LENGTH = 6

interface SettingsTwoFactorVerifyStepProps {
  readonly onVerified: () => void
  readonly totpUri: string
}

export function SettingsTwoFactorVerifyStep({ onVerified, totpUri }: Readonly<SettingsTwoFactorVerifyStepProps>): JSX.Element {
  const t = useTranslations("pages.admin.settings")
  const actionError = useActionError()
  const [isPending, startTransition] = useTransition()
  const [verificationCode, setVerificationCode] = useState("")

  const handleVerificationCodeChange = useCallback((value: string) => {
    setVerificationCode(value)
  }, [])

  const onVerifySetup = useCallback(() => {
    startTransition(async () => {
      const result = await verifyTotp({ code: verificationCode })

      const error = actionError(result)

      if (error) {
        toast.error(error)
        return
      }

      onVerified()
      toast.success(t("security.twoFactor.enabledSuccess"))
    })
  }, [actionError, onVerified, t, verificationCode])

  const handleVerifyClick = useCallback(() => {
    onVerifySetup()
  }, [onVerifySetup])

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{t("security.twoFactor.scanInstructions")}</p>
      <code className="block overflow-x-auto rounded-md bg-secondary/40 p-3 text-xs text-foreground">{extractTotpSecret(totpUri)}</code>

      <Field>
        <FieldLabel htmlFor={`${AUTH_FORM_IDS.TWO_FACTOR}-setup-code`}>{t("security.twoFactor.verificationCode")}</FieldLabel>
        <FieldContent>
          <InputOTP
            id={`${AUTH_FORM_IDS.TWO_FACTOR}-setup-code`}
            maxLength={TOTP_CODE_LENGTH}
            onChange={handleVerificationCodeChange}
            value={verificationCode}
          >
            <InputOTPGroup>
              {createOtpSlotIndices(TOTP_CODE_LENGTH).map((index) => (
                <InputOTPSlot index={index} key={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </FieldContent>
      </Field>

      <Button isDisabled={isPending || verificationCode.length !== TOTP_CODE_LENGTH} onPress={handleVerifyClick} type="button">
        {t("security.twoFactor.verifyAndEnable")}
      </Button>
    </div>
  )
}
