import { type JSX, useCallback, useState, useTransition } from "react"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useTranslations } from "use-intl/react"

import { SESSION_QUERY_KEYS } from "~/src/modules/session/session.constants"
import { createOtpSlotIndices, extractTotpSecret } from "~/src/modules/two-factor/two-factor.utils"
import { verifyTotpMutation } from "~/src/modules/two-factor/use-cases/verify-totp"

import { useActionError } from "~/src/hooks/use-action-error"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Field, FieldContent, FieldLabel } from "~/src/presentation/components/shadcn/field"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "~/src/presentation/components/shadcn/input-otp"

import { AUTH_FORM_IDS } from "~/src/presentation/components/custom/auth/constants/auth-form-ids"

const TOTP_CODE_LENGTH = 6

interface SettingsTwoFactorVerifyStepProps {
  readonly onVerified: () => void
  readonly totpUri: string
}

export const SettingsTwoFactorVerifyStep = ({ onVerified, totpUri }: Readonly<SettingsTwoFactorVerifyStepProps>): JSX.Element => {
  const queryClient = useQueryClient()
  const verifyTotpRequest = useMutation({
    ...verifyTotpMutation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.ALL }),
  })
  const t = useTranslations("pages.admin.settings")
  const actionError = useActionError()
  const [isPending, startTransition] = useTransition()
  const [verificationCode, setVerificationCode] = useState("")

  const handleVerificationCodeChange = useCallback((value: string) => {
    setVerificationCode(value)
  }, [])

  const onVerifySetup = useCallback(() => {
    startTransition(async () => {
      try {
        await verifyTotpRequest.mutateAsync({ code: verificationCode })
        onVerified()
        toast.success(t("security.twoFactor.enabledSuccess"))
      } catch (error) {
        toast.error(actionError(error))
      }
    })
  }, [actionError, onVerified, t, verificationCode])

  const handleVerifyClick = useCallback(() => {
    onVerifySetup()
  }, [onVerifySetup])

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{t("security.twoFactor.scanInstructions")}</p>
      <code className="block overflow-x-auto rounded-md bg-muted/60 p-3 text-xs text-foreground">{extractTotpSecret(totpUri)}</code>

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
