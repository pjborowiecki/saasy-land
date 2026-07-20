"use client"

import { type JSX, useCallback, useState } from "react"

import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { twoFactor } from "~/src/integrations/better-auth/auth._client"
import { authErrorKey } from "~/src/integrations/better-auth/auth.errors"
import { extractTotpSecret, createOtpSlotIndices } from "~/src/integrations/better-auth/auth.two-factor"

import { Button } from "~/src/components/shadcn/button"
import { Field, FieldContent, FieldLabel } from "~/src/components/shadcn/field"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "~/src/components/shadcn/input-otp"

import { AUTH_FORM_IDS } from "~/src/app/[locale]/(auth)/auth/_constants/auth-form-ids"

const TOTP_CODE_LENGTH = 6

interface SettingsTwoFactorVerifyStepProps {
  readonly onVerified: () => void
  readonly totpUri: string
}

export function SettingsTwoFactorVerifyStep({ onVerified, totpUri }: Readonly<SettingsTwoFactorVerifyStepProps>): JSX.Element {
  const t = useTranslations("pages.admin.settings")
  const tErrors = useTranslations("auth.errors")
  const [verificationCode, setVerificationCode] = useState("")

  const handleVerificationCodeChange = useCallback((value: string) => {
    setVerificationCode(value)
  }, [])

  const onVerifySetup = useCallback(async () => {
    await twoFactor.verifyTotp({
      code: verificationCode,
      fetchOptions: {
        onError: (ctx) => {
          toast.error(tErrors(authErrorKey(ctx.error)))
        },
        onSuccess: () => {
          onVerified()
          toast.success(t("security.twoFactor.enabledSuccess"))
        },
      },
    })
  }, [onVerified, t, tErrors, verificationCode])

  const handleVerifyClick = useCallback(() => {
    void onVerifySetup()
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

      <Button isDisabled={verificationCode.length !== TOTP_CODE_LENGTH} onPress={handleVerifyClick} type="button">
        {t("security.twoFactor.verifyAndEnable")}
      </Button>
    </div>
  )
}
