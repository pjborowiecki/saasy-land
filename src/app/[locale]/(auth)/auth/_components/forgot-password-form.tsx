"use client"

import { type JSX, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import type z from "zod/v4"

import { env } from "~/src/environment"

import { CONSTANTS } from "~/src/constants"

import { requestPasswordReset } from "~/src/integrations/better-auth/auth._client"
import { forgotPasswordSchema } from "~/src/integrations/better-auth/auth.schemas"
import { getPathname } from "~/src/integrations/next-intl/i18n.navigation"

import { Button } from "~/src/components/shadcn/button"
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "~/src/components/shadcn/field"
import { Input } from "~/src/components/shadcn/input"

export function ForgotPasswordForm(): JSX.Element {
  const [submitted, setSubmitted] = useState<boolean>(false)

  const locale = useLocale()
  const t = useTranslations()

  const formSchema = forgotPasswordSchema(t)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const redirectTo = `${env.NEXT_PUBLIC_APP_URL}${getPathname({
      href: CONSTANTS.ROUTES.RESET_PASSWORD,
      locale,
    })}`

    await requestPasswordReset({
      email: data.email,
      redirectTo,
      fetchOptions: {
        onError: () => {
          toast.error(t("auth.forgotPasswordPage.form.error"))
        },
        onSuccess: () => {
          setSubmitted(true)
          toast.success(t("auth.forgotPasswordPage.form.success"))
        },
      },
    })
  }

  return (
    <form id="forgot-password-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FieldGroup className="flex flex-col gap-6">
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="forgot-password-email">{t("auth.forgotPasswordPage.form.email")}</FieldLabel>
              <FieldContent>
                <Input
                  {...field}
                  type="email"
                  id="forgot-password-email"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                  disabled={form.formState.isSubmitting || submitted}
                  className="h-11 w-full border border-white/10 bg-transparent px-4 text-foreground text-sm shadow-inner transition-all placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
                  placeholder="john@example.com"
                />
                {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
              </FieldContent>
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        aria-label={t("auth.forgotPasswordPage.form.submit")}
        data-testid="forgot-password-form-submit-button"
        disabled={form.formState.isSubmitting || submitted}
        className="h-11 gap-2 bg-foreground text-background text-sm transition-all hover:bg-foreground/80"
      >
        {form.formState.isSubmitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
        {form.formState.isSubmitting ? t("auth.forgotPasswordPage.form.submitting") : t("auth.forgotPasswordPage.form.submit")}
      </Button>
    </form>
  )
}
