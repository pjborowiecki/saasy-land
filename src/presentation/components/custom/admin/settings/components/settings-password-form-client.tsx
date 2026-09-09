import { type JSX } from "react"

import { useForm, useSelector } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "use-intl/react"

import { fieldErrorMessage } from "~/src/integrations/tanstack-form/form.fields"

import { accountZodSchemas } from "~/src/modules/account/account.zod"
import { settingsChangePasswordMutation } from "~/src/modules/account/use-cases/change-password"
import { SESSION_QUERY_KEYS } from "~/src/modules/session/session.constants"

import { useActionError } from "~/src/hooks/use-action-error"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/src/presentation/components/shadcn/card"
import { Field, FieldContent, FieldLabel } from "~/src/presentation/components/shadcn/field"
import { Input } from "~/src/presentation/components/shadcn/input"

import { AuthFieldError } from "~/src/presentation/components/custom/auth/components/auth-field-error"
import { PasswordRequirements } from "~/src/presentation/components/custom/auth/components/password-requirements"

const changePasswordSchema = accountZodSchemas.changePasswordForm

export const SettingsPasswordFormClient = (): JSX.Element => {
  const queryClient = useQueryClient()
  const settingsChangePasswordRequest = useMutation({
    ...settingsChangePasswordMutation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEYS.ALL }),
  })

  const router = useRouter()
  const t = useTranslations("pages.admin.settings")
  const actionError = useActionError()

  const form = useForm({
    defaultValues: { confirmNewPassword: "", currentPassword: "", newPassword: "" },
    onSubmit: async ({ value }): Promise<void> => {
      try {
        await settingsChangePasswordRequest.mutateAsync({
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
        })
        toast.success(t("security.password.feedback.updateSuccess"))
        form.reset()
        void router.invalidate()
      } catch (error) {
        toast.error(actionError(error))
      }
    },
    validators: { onChange: changePasswordSchema, onSubmit: changePasswordSchema },
  })
  const isPending = useSelector(form.store, (state) => state.isSubmitting)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border p-5">
        <CardTitle className="mb-1 text-base font-medium text-foreground">{t("security.password.title")}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">{t("security.password.description")}</CardDescription>
      </CardHeader>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <CardContent className="p-0">
          <div className="grid grid-cols-1 items-start gap-8 p-5 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
            <div className="space-y-4">
              <form.Field name="currentPassword">
                {(field) => (
                  <Field>
                    <FieldLabel className="text-xs">{t("security.password.current")}</FieldLabel>
                    <FieldContent>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => {
                          field.handleChange(event.target.value)
                        }}
                      />
                    </FieldContent>
                    <AuthFieldError message={fieldErrorMessage(field.state.meta.errors)} />
                  </Field>
                )}
              </form.Field>
              <form.Field name="newPassword">
                {(field) => (
                  <Field>
                    <FieldLabel className="text-xs">{t("security.password.new")}</FieldLabel>
                    <FieldContent>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => {
                          field.handleChange(event.target.value)
                        }}
                      />
                    </FieldContent>
                    <AuthFieldError message={fieldErrorMessage(field.state.meta.errors)} />
                  </Field>
                )}
              </form.Field>
              <form.Field name="confirmNewPassword">
                {(field) => (
                  <Field>
                    <FieldLabel className="text-xs">{t("security.password.confirm")}</FieldLabel>
                    <FieldContent>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => {
                          field.handleChange(event.target.value)
                        }}
                      />
                    </FieldContent>
                    <AuthFieldError message={fieldErrorMessage(field.state.meta.errors)} />
                  </Field>
                )}
              </form.Field>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-5">
              <h3 className="mb-4 text-xs font-medium text-foreground">{t("security.password.requirements.title")}</h3>
              <form.Subscribe selector={(state) => state.values}>
                {({ confirmNewPassword, newPassword }) => (
                  <PasswordRequirements confirmPassword={confirmNewPassword} password={newPassword} />
                )}
              </form.Subscribe>
            </div>
          </div>
        </CardContent>
        <div className="flex justify-end border-t border-border bg-muted/40 p-4">
          <Button type="submit" size="sm" className="h-8 px-4 text-xs shadow-sm" isDisabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : t("security.password.update")}
          </Button>
        </div>
      </form>
    </Card>
  )
}
