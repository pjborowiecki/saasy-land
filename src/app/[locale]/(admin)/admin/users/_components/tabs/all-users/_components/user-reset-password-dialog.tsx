"use client"

import { type JSX, useCallback } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { FormProvider, useForm } from "react-hook-form"
import type z from "zod/v4"

import { setUserPassword } from "~/src/modules/user/use-cases/set-user-password.use-case"
import { userZodSchemas } from "~/src/modules/user/user.zod"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/src/presentation/components/shadcn/dialog"
import { Field, FieldContent, FieldLabel } from "~/src/presentation/components/shadcn/field"
import { Input } from "~/src/presentation/components/shadcn/input"

import { useUserActionFeedback } from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/all-users/_lib/use-user-action-feedback"
import { AuthFieldError } from "~/src/app/[locale]/(auth)/auth/_components/auth-field-error"

export function UserResetPasswordDialog({
  isOpen,
  onOpenChange,
  userId,
  userName,
}: {
  readonly isOpen: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly userId: string
  readonly userName: string
}): JSX.Element {
  const t = useTranslations("pages.admin.users")
  const { isPending, runUserAction } = useUserActionFeedback()

  const schema = userZodSchemas.setUserPasswordForm
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: { newPassword: "" },
    resolver: zodResolver(schema),
  })

  const handleSubmit = form.handleSubmit((data) => {
    runUserAction(() => setUserPassword({ newPassword: data.newPassword, userId }), {
      errorMessage: t("actions.feedback.error"),
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
      successMessage: t("actions.feedback.resetPasswordSuccess"),
    })
  })

  const handleCancel = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{t("actions.resetPasswordDialog.title")}</DialogTitle>
        <DialogDescription>{t("actions.resetPasswordDialog.description", { name: userName })}</DialogDescription>
      </DialogHeader>
      <FormProvider {...form}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Field>
            <FieldLabel>{t("actions.resetPasswordDialog.password")}</FieldLabel>
            <FieldContent>
              <Input type="password" autoComplete="new-password" {...form.register("newPassword")} />
            </FieldContent>
            <AuthFieldError message={form.formState.errors.newPassword?.message} />
          </Field>
          <DialogFooter>
            <Button type="button" variant="outline" onPress={handleCancel}>
              {t("actions.resetPasswordDialog.cancel")}
            </Button>
            <Button type="submit" isDisabled={isPending}>
              {isPending ? <Loader2 className="size-4 animate-spin" /> : t("actions.resetPasswordDialog.confirm")}
            </Button>
          </DialogFooter>
        </form>
      </FormProvider>
    </Dialog>
  )
}
