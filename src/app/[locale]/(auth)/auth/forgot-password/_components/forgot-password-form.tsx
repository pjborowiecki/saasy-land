"use client"

import { type JSX, useCallback, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import type z from "zod/v4"

import { env } from "~/src/platform/env"

import { requestPasswordReset } from "~/src/modules/verification/use-cases/request-password-reset.use-case"
import { verificationZodSchemas } from "~/src/modules/verification/verification.zod"

import { getPathname } from "~/src/integrations/next-intl/i18n.navigation"

import { Button } from "~/src/presentation/components/shadcn/button"
import { FieldGroup } from "~/src/presentation/components/shadcn/field"

import { AuthTextField } from "~/src/app/[locale]/(auth)/auth/_components/auth-form-fields"
import { AUTH_FORM_IDS } from "~/src/app/[locale]/(auth)/auth/_constants/auth-form-ids"
import { ROUTES } from "~/src/routes"

const forgotPasswordSchema = verificationZodSchemas.forgotPassword

export function ForgotPasswordForm(): JSX.Element {
  const [submitted, setSubmitted] = useState<boolean>(false)

  const locale = useLocale()
  const t = useTranslations()

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    defaultValues: { email: "" },
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = useCallback(
    async (data: z.infer<typeof forgotPasswordSchema>) => {
      const redirectTo = `${env.NEXT_PUBLIC_APP_URL}${getPathname({
        href: ROUTES.RESET_PASSWORD,
        locale,
      })}`

      const result = await requestPasswordReset({
        email: data.email,
        redirectTo,
      })

      if (result.serverError) {
        toast.error(t("pages.auth.forgot-password.form.error"))
        return
      }

      setSubmitted(true)
      toast.success(t("pages.auth.forgot-password.form.success"))
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
