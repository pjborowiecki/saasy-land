"use client"

import { type JSX, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import type z from "zod/v4"

import { CONSTANTS } from "~/src/constants"

import { resetPassword } from "~/src/integrations/better-auth/auth._client"
import { AUTH_ERRORS } from "~/src/integrations/better-auth/auth.errors"
import { resetPasswordSchema } from "~/src/integrations/better-auth/auth.schemas"
import { useRouter } from "~/src/integrations/next-intl/i18n.navigation"

import { Button } from "~/src/components/shadcn/button"
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "~/src/components/shadcn/field"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "~/src/components/shadcn/input-group"

import { PasswordRequirements } from "~/src/app/[locale]/(auth)/auth/_components/password-requirements"

interface ResetPasswordFormProps {
  readonly token: string
}

export function ResetPasswordForm({ token }: Readonly<ResetPasswordFormProps>): JSX.Element {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const router = useRouter()
  const t = useTranslations()

  const formSchema = resetPasswordSchema(t)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: { password: "", confirmPassword: "" },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await resetPassword({
      newPassword: data.password,
      token,
      fetchOptions: {
        onError: (ctx) => {
          const key = AUTH_ERRORS[ctx.error.code as keyof typeof AUTH_ERRORS] ?? AUTH_ERRORS.UNKNOWN_ERROR
          toast.error(t(`auth.errors.${key}`))
        },
        onSuccess: () => {
          toast.success(t("auth.resetPasswordPage.form.success"))
          router.push(CONSTANTS.ROUTES.SIGN_IN)
        },
      },
    })
  }

  return (
    <FormProvider {...form}>
      <form id="reset-password-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FieldGroup className="flex flex-col gap-4">
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="reset-password">{t("auth.resetPasswordPage.form.password")}</FieldLabel>
                <FieldContent>
                  <InputGroup className="h-11 rounded-xl border border-white/10 bg-transparent shadow-inner transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50">
                    <InputGroupInput
                      {...field}
                      type={showPassword ? "text" : "password"}
                      id="reset-password"
                      autoComplete="new-password"
                      aria-invalid={fieldState.invalid}
                      disabled={form.formState.isSubmitting}
                      className="px-4 text-foreground text-sm placeholder:text-muted-foreground"
                      placeholder="••••••••"
                    />
                    <InputGroupAddon align="inline-end" className="pr-1.5">
                      <InputGroupButton
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="reset-password-confirm">{t("auth.resetPasswordPage.form.confirmPassword")}</FieldLabel>
                <FieldContent>
                  <InputGroup className="h-11 rounded-xl border border-white/10 bg-transparent shadow-inner transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50">
                    <InputGroupInput
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      id="reset-password-confirm"
                      autoComplete="new-password"
                      aria-invalid={fieldState.invalid}
                      disabled={form.formState.isSubmitting}
                      className="px-4 text-foreground text-sm placeholder:text-muted-foreground"
                      placeholder="••••••••"
                    />
                    <InputGroupAddon align="inline-end" className="pr-1.5">
                      <InputGroupButton
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        className="text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </FieldContent>
              </Field>
            )}
          />
        </FieldGroup>

        <PasswordRequirements />

        <Button
          type="submit"
          aria-label={t("auth.resetPasswordPage.form.submit")}
          data-testid="reset-password-form-submit-button"
          disabled={form.formState.isSubmitting}
          className="h-11 gap-2 bg-foreground text-background text-sm transition-all hover:bg-foreground/80"
        >
          {form.formState.isSubmitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
          {form.formState.isSubmitting ? t("auth.resetPasswordPage.form.submitting") : t("auth.resetPasswordPage.form.submit")}
        </Button>
      </form>
    </FormProvider>
  )
}
