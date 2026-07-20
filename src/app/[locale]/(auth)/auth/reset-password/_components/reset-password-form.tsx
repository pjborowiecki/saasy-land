"use client"

import { type JSX, useCallback } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import type z from "zod/v4"

import { CONSTANTS } from "~/src/constants"

import { resetPassword } from "~/src/integrations/better-auth/auth._client"
import { authErrorKey } from "~/src/integrations/better-auth/auth.errors"
import { resetPasswordSchema } from "~/src/integrations/better-auth/auth.schemas"
import { useRouter } from "~/src/integrations/next-intl/i18n.navigation"

import { Button } from "~/src/components/shadcn/button"
import { FieldGroup } from "~/src/components/shadcn/field"

import { AuthPasswordField } from "~/src/app/[locale]/(auth)/auth/_components/auth-form-fields"
import { PasswordRequirements } from "~/src/app/[locale]/(auth)/auth/_components/password-requirements"
import { AUTH_FORM_IDS } from "~/src/app/[locale]/(auth)/auth/_constants/auth-form-ids"

interface ResetPasswordFormProps {
  readonly token: string
}

export function ResetPasswordForm({ token }: Readonly<ResetPasswordFormProps>): JSX.Element {
  const router = useRouter()
  const t = useTranslations()

  const formSchema = resetPasswordSchema((key, params) => t(`auth.validations.${key}`, params))
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { confirmPassword: "", password: "" },
    mode: "onChange",
    resolver: zodResolver(formSchema),
  })

  const onSubmit = useCallback(
    async (data: z.infer<typeof formSchema>) => {
      await resetPassword({
        fetchOptions: {
          onError: (ctx) => {
            toast.error(t(`auth.errors.${authErrorKey(ctx.error)}`))
          },
          onSuccess: () => {
            toast.success(t("pages.auth.reset-password.form.success"))
            router.push(CONSTANTS.ROUTES.SIGN_IN)
          },
        },
        newPassword: data.password,
        token,
      })
    },
    [router, t, token],
  )

  return (
    <FormProvider {...form}>
      <form className="flex flex-col gap-4" id={`${AUTH_FORM_IDS.RESET_PASSWORD}-form`} onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="flex flex-col gap-4">
          <AuthPasswordField formId={AUTH_FORM_IDS.RESET_PASSWORD} label={t("pages.auth.reset-password.form.password")} name="password" />
          <AuthPasswordField
            formId={AUTH_FORM_IDS.RESET_PASSWORD}
            label={t("pages.auth.reset-password.form.confirmPassword")}
            name="confirmPassword"
          />
        </FieldGroup>

        <PasswordRequirements />

        <Button
          aria-label={t("pages.auth.reset-password.form.submit")}
          className="h-11 gap-2 bg-foreground text-sm text-background transition-all hover:bg-foreground/80"
          data-testid="reset-password-form-submit-button"
          isDisabled={form.formState.isSubmitting}
          type="submit"
        >
          {form.formState.isSubmitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
          {form.formState.isSubmitting ? t("pages.auth.reset-password.form.submitting") : t("pages.auth.reset-password.form.submit")}
        </Button>
      </form>
    </FormProvider>
  )
}
