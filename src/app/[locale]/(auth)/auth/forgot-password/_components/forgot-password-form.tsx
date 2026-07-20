"use client"

import { type JSX, useCallback, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import type z from "zod/v4"

import { env } from "~/src/environment"

import { CONSTANTS } from "~/src/constants"

import { requestPasswordReset } from "~/src/integrations/better-auth/auth._client"
import { forgotPasswordSchema } from "~/src/integrations/better-auth/auth.schemas"
import { getPathname } from "~/src/integrations/next-intl/i18n.navigation"

import { Button } from "~/src/components/shadcn/button"
import { FieldGroup } from "~/src/components/shadcn/field"

import { AuthTextField } from "~/src/app/[locale]/(auth)/auth/_components/auth-form-fields"
import { AUTH_FORM_IDS } from "~/src/app/[locale]/(auth)/auth/_constants/auth-form-ids"

export function ForgotPasswordForm(): JSX.Element {
  const [submitted, setSubmitted] = useState<boolean>(false)

  const locale = useLocale()
  const t = useTranslations()

  const formSchema = forgotPasswordSchema((key, params) => t(`auth.validations.${key}`, params))
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { email: "" },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = useCallback(
    async (data: z.infer<typeof formSchema>) => {
      const redirectTo = `${env.NEXT_PUBLIC_APP_URL}${getPathname({
        href: CONSTANTS.ROUTES.RESET_PASSWORD,
        locale,
      })}`

      await requestPasswordReset({
        email: data.email,
        fetchOptions: {
          onError: () => {
            toast.error(t("pages.auth.forgot-password.form.error"))
          },
          onSuccess: () => {
            setSubmitted(true)
            toast.success(t("pages.auth.forgot-password.form.success"))
          },
        },
        redirectTo,
      })
    },
    [locale, t],
  )

  return (
    <FormProvider {...form}>
      <form className="flex flex-col gap-4" id={`${AUTH_FORM_IDS.FORGOT_PASSWORD}-form`} onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="flex flex-col gap-6">
          <AuthTextField
            disabled={submitted}
            formId={AUTH_FORM_IDS.FORGOT_PASSWORD}
            label={t("pages.auth.forgot-password.form.email")}
            name="email"
          />
        </FieldGroup>

        <Button
          aria-label={t("pages.auth.forgot-password.form.submit")}
          className="h-11 gap-2 bg-foreground text-sm text-background transition-all hover:bg-foreground/80"
          data-testid="forgot-password-form-submit-button"
          isDisabled={form.formState.isSubmitting || submitted}
          type="submit"
        >
          {form.formState.isSubmitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
          {form.formState.isSubmitting ? t("pages.auth.forgot-password.form.submitting") : t("pages.auth.forgot-password.form.submit")}
        </Button>
      </form>
    </FormProvider>
  )
}
