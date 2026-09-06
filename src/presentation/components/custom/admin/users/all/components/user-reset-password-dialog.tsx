import { type JSX, useCallback } from "react"

import { useForm, useSelector } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "use-intl/react"

import { fieldErrorMessage } from "~/src/integrations/tanstack-form/form.fields"

import { setUserPasswordMutation } from "~/src/modules/user/use-cases/set-user-password"
import { userZodSchemas } from "~/src/modules/user/user.zod"

import { useActionError } from "~/src/hooks/use-action-error"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/src/presentation/components/shadcn/dialog"
import { Field, FieldContent, FieldLabel } from "~/src/presentation/components/shadcn/field"
import { Input } from "~/src/presentation/components/shadcn/input"

import { AuthFieldError } from "~/src/presentation/components/custom/auth/components/auth-field-error"

export const UserResetPasswordDialog = ({
  isOpen,
  onOpenChange,
  userId,
  userName,
}: {
  readonly isOpen: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly userId: string
  readonly userName: string
}): JSX.Element => {
  const queryClient = useQueryClient()
  const setUserPasswordRequest = useMutation({
    ...setUserPasswordMutation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
  })
  const t = useTranslations("pages.admin.users")
  const actionError = useActionError()

  const router = useRouter()

  const schema = userZodSchemas.setUserPasswordForm
  const form = useForm({
    defaultValues: { newPassword: "" },
    onSubmit: async ({ value }): Promise<void> => {
      try {
        const data = value
        await setUserPasswordRequest.mutateAsync({ newPassword: data.newPassword, userId })
        toast.success(t("actions.feedback.resetPasswordSuccess"))
        form.reset()
        onOpenChange(false)
        void router.invalidate()
      } catch (error) {
        toast.error(actionError(error))
      }
    },
    validators: { onChange: schema, onSubmit: schema },
  })
  const isPending = useSelector(form.store, (state) => state.isSubmitting)

  const handleCancel = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{t("actions.resetPasswordDialog.title")}</DialogTitle>
        <DialogDescription>{t("actions.resetPasswordDialog.description", { name: userName })}</DialogDescription>
      </DialogHeader>

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <form.Field name="newPassword">
          {(field) => (
            <Field>
              <FieldLabel>{t("actions.resetPasswordDialog.password")}</FieldLabel>
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
        <DialogFooter>
          <Button type="button" variant="outline" onPress={handleCancel}>
            {t("actions.resetPasswordDialog.cancel")}
          </Button>
          <Button type="submit" isDisabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : t("actions.resetPasswordDialog.confirm")}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
