"use client"

import { type JSX, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import type z from "zod/v4"

import { CONSTANTS } from "~/src/constants"

import { signUp } from "~/src/integrations/better-auth/auth.client"
import { AUTH_ERRORS } from "~/src/integrations/better-auth/auth.errors"
import { signUpWithPasswordSchema } from "~/src/integrations/better-auth/auth.schemas"
import { useRouter } from "~/src/integrations/next-intl/i18n.navigation"

import { Button } from "~/src/components/shadcn/button"
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "~/src/components/shadcn/field"
import { Input } from "~/src/components/shadcn/input"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "~/src/components/shadcn/input-group"

import { PasswordRequirements } from "~/src/app/[locale]/(auth)/auth/_components/password-requirements"
import { useConfetti } from "~/src/hooks/use-confetti"

export function SignUpWithPasswordForm(): JSX.Element {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const { triggerConfetti } = useConfetti()

  const router = useRouter()
  const t = useTranslations()

  const formSchema = signUpWithPasswordSchema(t)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      fetchOptions: {
        onError: (ctx) => {
          const errorCode = (ctx.error.code as keyof typeof AUTH_ERRORS) ?? "UNKNOWN_ERROR"
          const key = AUTH_ERRORS[errorCode] ?? AUTH_ERRORS.UNKNOWN_ERROR
          toast.error(t(`auth.errors.${key}`))
        },
        onSuccess: () => {
          triggerConfetti()
          toast.success(t("auth.signUpPage.form.success"))
          router.push(CONSTANTS.ROUTES.APP)
        },
      },
    })
  }

  return (
    <FormProvider {...form}>
      <form id="sign-up-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FieldGroup className="flex flex-col gap-4">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="sign-up-name">{t("auth.signUpPage.form.name")}</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    type="text"
                    id="sign-up-name"
                    autoComplete="name"
                    aria-invalid={fieldState.invalid}
                    disabled={form.formState.isSubmitting}
                    className="h-11 w-full rounded-xl border border-white/10 bg-transparent px-4 text-foreground text-sm shadow-inner transition-all placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
                    placeholder="John Doe"
                  />
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="sign-up-email">{t("auth.signUpPage.form.email")}</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    type="email"
                    id="sign-up-email"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                    disabled={form.formState.isSubmitting}
                    className="h-11 w-full rounded-xl border border-white/10 bg-transparent px-4 text-foreground text-sm shadow-inner transition-all placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
                    placeholder="john@example.com"
                  />
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="sign-up-password">{t("auth.signUpPage.form.password")}</FieldLabel>
                <FieldContent>
                  <InputGroup className="h-11 rounded-xl border border-white/10 bg-transparent shadow-inner transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50">
                    <InputGroupInput
                      {...field}
                      type={showPassword ? "text" : "password"}
                      id="sign-up-password"
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
                <FieldLabel htmlFor="sign-up-confirm-password">{t("auth.signUpPage.form.confirmPassword")}</FieldLabel>
                <FieldContent>
                  <InputGroup className="h-11 rounded-xl border border-white/10 bg-transparent shadow-inner transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50">
                    <InputGroupInput
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      id="sign-up-confirm-password"
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
          id="sign-up-form-submit-button"
          aria-label={t("auth.signUpPage.form.submit")}
          disabled={form.formState.isSubmitting}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-foreground px-8 font-medium text-background text-sm shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all hover:bg-foreground/90 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)]"
        >
          {form.formState.isSubmitting && <Loader2 aria-hidden="true" className="mr-2 size-4 animate-spin" />}
          {form.formState.isSubmitting ? t("auth.signUpPage.form.submitting") : t("auth.signUpPage.form.submit")}
        </Button>
      </form>
    </FormProvider>
  )
}
