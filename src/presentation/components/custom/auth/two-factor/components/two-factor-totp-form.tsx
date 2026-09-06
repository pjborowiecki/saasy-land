import { type JSX } from "react"

import { useForm, useSelector } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "use-intl/react"

import { twoFactorZodSchemas } from "~/src/modules/two-factor/two-factor.zod"
import { verifyTotpMutation } from "~/src/modules/two-factor/use-cases/verify-totp"

import { useActionError } from "~/src/hooks/use-action-error"

import { Button } from "~/src/presentation/components/shadcn/button"

import { AuthOtpField } from "~/src/presentation/components/custom/auth/components/auth-otp-field"
import { AUTH_FORM_IDS } from "~/src/presentation/components/custom/auth/constants/auth-form-ids"
import { AUTH_PRIMARY_BUTTON_CLASS, AUTH_SECONDARY_BUTTON_CLASS } from "~/src/presentation/components/custom/auth/constants/auth-styles"
import { useTwoFactorRedirect } from "~/src/presentation/components/custom/auth/two-factor/hooks/use-two-factor-redirect"

const verifyTotpInputSchema = twoFactorZodSchemas.verifyTotp.required({ trustDevice: true })

const TOTP_CODE_LENGTH = 6

interface TwoFactorTotpFormProps {
  readonly onToggleMode: () => void
}

export const TwoFactorTotpForm = ({ onToggleMode }: Readonly<TwoFactorTotpFormProps>): JSX.Element => {
  const queryClient = useQueryClient()
  const verifyTotpRequest = useMutation({
    ...verifyTotpMutation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["session"] }),
  })
  const t = useTranslations()
  const actionError = useActionError()

  const redirectAfterVerification = useTwoFactorRedirect()

  const totpFormMethods = useForm({
    defaultValues: { code: "", trustDevice: true },
    onSubmit: async ({ value }): Promise<void> => {
      try {
        const data = value
        await verifyTotpRequest.mutateAsync(data)
        await redirectAfterVerification()
      } catch (error) {
        toast.error(actionError(error))
      }
    },
    validators: { onChange: verifyTotpInputSchema, onSubmit: verifyTotpInputSchema },
  })
  const isPending = useSelector(totpFormMethods.store, (state) => state.isSubmitting)

  return (
    <form
      className="flex flex-col gap-6"
      id={`${AUTH_FORM_IDS.TWO_FACTOR}-form`}
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void totpFormMethods.handleSubmit()
      }}
    >
      <totpFormMethods.Field name="code">
        {(field) => (
          <AuthOtpField
            formId={AUTH_FORM_IDS.TWO_FACTOR}
            label={t("pages.auth.two-factor.form.code")}
            maxLength={TOTP_CODE_LENGTH}
            name="code"
            field={field}
          />
        )}
      </totpFormMethods.Field>

      <Button className={AUTH_PRIMARY_BUTTON_CLASS} data-testid="two-factor-form-submit-button" isDisabled={isPending} type="submit">
        {isPending && <Loader2 aria-hidden="true" className="size-4 animate-spin" strokeWidth={1.5} />}
        {isPending ? t("pages.auth.two-factor.form.submitting") : t("pages.auth.two-factor.form.submit")}
      </Button>

      <Button className={AUTH_SECONDARY_BUTTON_CLASS} onPress={onToggleMode} type="button" variant="outline">
        {t("pages.auth.two-factor.form.useBackupCode")}
      </Button>
    </form>
  )
}
