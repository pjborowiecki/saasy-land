import { type JSX, useState } from "react"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useTranslations } from "use-intl/react"

import { TWO_FACTOR_CODE_LENGTH } from "~/src/integrations/better-auth/auth.constraints"

import { SESSION_QUERY_KEYS } from "~/src/modules/session/session.constants"
import { createOtpSlotIndices, extractTotpSecret } from "~/src/modules/two-factor/two-factor.utils"
import { verifyTotpMutation } from "~/src/modules/two-factor/use-cases/verify-totp"

import { useActionError } from "~/src/hooks/use-action-error"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Field, FieldContent, FieldLabel } from "~/src/presentation/components/shadcn/field"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "~/src/presentation/components/shadcn/input-otp"

import { AUTH_FORM_IDS } from "~/src/presentation/components/custom/auth/constants/auth-form-ids"

interface SettingsTwoFactorVerifyStepProps {
  readonly onVerified: () => void
  readonly totpUri: string
}

export const SettingsTwoFactorVerifyStep = ({ onVerified, totpUri }: Readonly<SettingsTwoFactorVerifyStepProps>): JSX.Element => {
  const queryClient = useQueryClient()
  const t = useTranslations("pages.admin.settings")
  const actionError = useActionError()
  const [verificationCode, setVerificationCode] = useState("")
  const verifyTotpRequest = useMutation({
    ...verifyTotpMutation,
    onError: (error) => toast.error(actionError(error)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.ALL })
      toast.success(t("security.twoFactor.enabledSuccess"))
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{t("security.twoFactor.scanInstructions")}</p>
      <code className="block overflow-x-auto rounded-md bg-muted/60 p-3 text-xs text-foreground">{extractTotpSecret(totpUri)}</code>

      <Field>
        <FieldLabel htmlFor={`${AUTH_FORM_IDS.TWO_FACTOR}-setup-code`}>{t("security.twoFactor.verificationCode")}</FieldLabel>
        <FieldContent>
          <InputOTP
            id={`${AUTH_FORM_IDS.TWO_FACTOR}-setup-code`}
            maxLength={TWO_FACTOR_CODE_LENGTH}
            onChange={setVerificationCode}
            value={verificationCode}
          >
            <InputOTPGroup>
              {createOtpSlotIndices(TWO_FACTOR_CODE_LENGTH).map((index) => (
                <InputOTPSlot index={index} key={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </FieldContent>
      </Field>

      <Button
        isDisabled={verifyTotpRequest.isPending || verificationCode.length !== TWO_FACTOR_CODE_LENGTH}
        onPress={() => {
          verifyTotpRequest.mutate({ code: verificationCode }, { onSuccess: onVerified })
        }}
        type="button"
      >
        {t("security.twoFactor.verifyAndEnable")}
      </Button>
    </div>
  )
}
