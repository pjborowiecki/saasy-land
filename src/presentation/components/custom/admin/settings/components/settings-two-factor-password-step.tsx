import { type JSX } from "react"

import { useForm, useSelector } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "use-intl/react"

import { fieldErrorMessage } from "~/src/integrations/tanstack-form/form.fields"

import { SESSION_QUERY_KEYS } from "~/src/modules/session/session.constants"
import { parseTwoFactorEnableData } from "~/src/modules/two-factor/two-factor.utils"
import { twoFactorZodSchemas } from "~/src/modules/two-factor/two-factor.zod"
import { enableTwoFactorMutation } from "~/src/modules/two-factor/use-cases/enable-two-factor"

import { useActionError } from "~/src/hooks/use-action-error"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Field, FieldContent, FieldLabel } from "~/src/presentation/components/shadcn/field"
import { Input } from "~/src/presentation/components/shadcn/input"

import { AuthFieldError } from "~/src/presentation/components/custom/auth/components/auth-field-error"
import { AUTH_FORM_IDS } from "~/src/presentation/components/custom/auth/constants/auth-form-ids"

const enableTwoFactorSchema = twoFactorZodSchemas.enableTwoFactor

interface SettingsTwoFactorPasswordStepProps {
  readonly onEnabled: (totpUri: string, backupCodes: readonly string[]) => void
}

export const SettingsTwoFactorPasswordStep = ({ onEnabled }: Readonly<SettingsTwoFactorPasswordStepProps>): JSX.Element => {
  const queryClient = useQueryClient()
  const enableTwoFactorRequest = useMutation({
    ...enableTwoFactorMutation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.ALL }),
  })
  const t = useTranslations("pages.admin.settings")
  const actionError = useActionError()

  const passwordForm = useForm({
    defaultValues: { password: "" },
    onSubmit: async ({ value }): Promise<void> => {
      try {
        const data = value
        const result = await enableTwoFactorRequest.mutateAsync({ password: data.password })
        const enableData = parseTwoFactorEnableData(result)
        if (enableData === undefined) {
          toast.error(t("security.twoFactor.setupError"))
          return
        }
        onEnabled(enableData.totpURI, enableData.backupCodes)
      } catch (error) {
        toast.error(actionError(error))
      }
    },
    validators: { onChange: enableTwoFactorSchema, onSubmit: enableTwoFactorSchema },
  })
  const isPending = useSelector(passwordForm.store, (state) => state.isSubmitting)

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void passwordForm.handleSubmit()
      }}
    >
      <passwordForm.Field name="password">
        {(field) => (
          <Field>
            <FieldLabel htmlFor={`${AUTH_FORM_IDS.TWO_FACTOR}-enable-password`}>{t("security.twoFactor.password")}</FieldLabel>
            <FieldContent>
              <Input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => {
                  field.handleChange(event.target.value)
                }}
                autoComplete="current-password"
                id={`${AUTH_FORM_IDS.TWO_FACTOR}-enable-password`}
                type="password"
              />
              <AuthFieldError message={fieldErrorMessage(field.state.meta.errors)} />
            </FieldContent>
          </Field>
        )}
      </passwordForm.Field>

      <Button className="gap-2" isDisabled={isPending} type="submit">
        {isPending && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
        {t("security.twoFactor.continue")}
      </Button>
    </form>
  )
}
