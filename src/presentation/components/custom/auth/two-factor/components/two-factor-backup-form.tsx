import { type JSX } from "react"

import { useForm, useSelector } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "use-intl/react"

import { fieldErrorMessage } from "~/src/integrations/tanstack-form/form.fields"

import { twoFactorZodSchemas } from "~/src/modules/two-factor/two-factor.zod"
import { verifyBackupCodeMutation } from "~/src/modules/two-factor/use-cases/verify-backup-code"

import { useActionError } from "~/src/hooks/use-action-error"

import { cn } from "~/src/lib/cn"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Field, FieldContent, FieldLabel } from "~/src/presentation/components/shadcn/field"
import { Input } from "~/src/presentation/components/shadcn/input"

import { AuthFieldError } from "~/src/presentation/components/custom/auth/components/auth-field-error"
import { AUTH_FORM_IDS } from "~/src/presentation/components/custom/auth/constants/auth-form-ids"
import {
  AUTH_FIELD_CONTENT_CLASS,
  AUTH_INPUT_CLASS,
  AUTH_LABEL_CLASS,
  AUTH_PRIMARY_BUTTON_CLASS,
  AUTH_SECONDARY_BUTTON_CLASS,
} from "~/src/presentation/components/custom/auth/constants/auth-styles"
import { useTwoFactorRedirect } from "~/src/presentation/components/custom/auth/two-factor/hooks/use-two-factor-redirect"

/** A backup code is a code, so it is set in mono like the OTP it stands in for. */
const BACKUP_CODE_INPUT_CLASS = "font-mono tracking-wider"

const BACKUP_CODE_ERROR_ID = `${AUTH_FORM_IDS.TWO_FACTOR}-backup-code-error`
const BACKUP_CODE_FIELD_ID = `${AUTH_FORM_IDS.TWO_FACTOR}-backup-code`

const verifyBackupCodeInputSchema = twoFactorZodSchemas.verifyBackupCode.required({ trustDevice: true })

interface TwoFactorBackupFormProps {
  readonly onToggleMode: () => void
}

export const TwoFactorBackupForm = ({ onToggleMode }: Readonly<TwoFactorBackupFormProps>): JSX.Element => {
  const queryClient = useQueryClient()
  const verifyBackupCodeRequest = useMutation({
    ...verifyBackupCodeMutation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["session"] }),
  })
  const t = useTranslations()
  const actionError = useActionError()

  const redirectAfterVerification = useTwoFactorRedirect()

  const backupForm = useForm({
    defaultValues: { code: "", trustDevice: true },
    onSubmit: async ({ value }): Promise<void> => {
      try {
        const data = value
        await verifyBackupCodeRequest.mutateAsync(data)
        await redirectAfterVerification()
      } catch (error) {
        toast.error(actionError(error))
      }
    },
    validators: { onChange: verifyBackupCodeInputSchema, onSubmit: verifyBackupCodeInputSchema },
  })
  const isPending = useSelector(backupForm.store, (state) => state.isSubmitting)

  return (
    <form
      className="flex flex-col gap-6"
      id={`${AUTH_FORM_IDS.TWO_FACTOR}-backup-form`}
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void backupForm.handleSubmit()
      }}
    >
      <backupForm.Field name="code">
        {(field) => (
          <Field>
            <FieldLabel className={AUTH_LABEL_CLASS} htmlFor={BACKUP_CODE_FIELD_ID}>
              {t("pages.auth.two-factor.form.backupCode")}
            </FieldLabel>
            <FieldContent className={AUTH_FIELD_CONTENT_CLASS}>
              <Input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => {
                  field.handleChange(event.target.value)
                }}
                aria-describedby={field.state.meta.errors.length === 0 ? undefined : BACKUP_CODE_ERROR_ID}
                aria-invalid={field.state.meta.errors.length > 0}
                autoComplete="one-time-code"
                className={cn(AUTH_INPUT_CLASS, BACKUP_CODE_INPUT_CLASS)}
                id={BACKUP_CODE_FIELD_ID}
              />
              <AuthFieldError id={BACKUP_CODE_ERROR_ID} message={fieldErrorMessage(field.state.meta.errors)} />
            </FieldContent>
          </Field>
        )}
      </backupForm.Field>

      <Button className={AUTH_PRIMARY_BUTTON_CLASS} data-testid="two-factor-backup-submit-button" isDisabled={isPending} type="submit">
        {isPending && <Loader2 aria-hidden="true" className="size-4 animate-spin" strokeWidth={1.5} />}
        {isPending ? t("pages.auth.two-factor.form.submitting") : t("pages.auth.two-factor.form.submit")}
      </Button>

      <Button className={AUTH_SECONDARY_BUTTON_CLASS} onPress={onToggleMode} type="button" variant="outline">
        {t("pages.auth.two-factor.form.useAuthenticator")}
      </Button>
    </form>
  )
}
