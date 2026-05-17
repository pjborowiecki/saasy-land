"use client"

import { type JSX, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import type z from "zod/v4"

import { CONSTANTS } from "~/src/constants"

import { signIn } from "~/src/integrations/better-auth/auth.client"
import { AUTH_ERRORS } from "~/src/integrations/better-auth/auth.errors"
import { signInWithPasswordSchema } from "~/src/integrations/better-auth/auth.schemas"
import { Link, useRouter } from "~/src/integrations/next-intl/i18n.navigation"

import { Button } from "~/src/components/shadcn/button"
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "~/src/components/shadcn/field"
import { Input } from "~/src/components/shadcn/input"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "~/src/components/shadcn/input-group"

export function SignInWithPasswordForm(): JSX.Element {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const router = useRouter()
  const t = useTranslations()

  const formSchema = signInWithPasswordSchema(t)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await signIn.email({
      email: data.email,
      password: data.password,
      fetchOptions: {
        onError: (ctx) => {
          const errorCode = (ctx.error.code as keyof typeof AUTH_ERRORS) ?? "UNKNOWN_ERROR"
          const key = AUTH_ERRORS[errorCode] ?? AUTH_ERRORS.UNKNOWN_ERROR
          toast.error(t(`auth.errors.${key}`))
        },
        onSuccess: () => {
          toast.success(t("auth.signInPage.form.success"))
          router.push(CONSTANTS.ROUTES.ADMIN)
        },
      },
    })
  }

  return (
    <form id="sign-in-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FieldGroup className="flex flex-col gap-6">
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="sign-in-email">{t("auth.signInPage.form.email")}</FieldLabel>
              <FieldContent>
                <Input
                  {...field}
                  type="email"
                  id="sign-in-email"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                  disabled={form.formState.isSubmitting}
                  className="h-11 w-full border border-white/10 bg-transparent px-4 text-foreground text-sm shadow-inner transition-all placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
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
              <FieldLabel htmlFor="sign-in-password" className="flex items-center justify-between">
                <span>{t("auth.signInPage.form.password")}</span>
                <Link href={CONSTANTS.ROUTES.FORGOT_PASSWORD} className="text-muted-foreground transition-colors hover:text-foreground">
                  {t("auth.signInPage.form.forgotPassword")}
                </Link>
              </FieldLabel>
              <FieldContent>
                <InputGroup className="h-11 rounded-xl border border-white/10 bg-transparent shadow-inner transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50">
                  <InputGroupInput
                    {...field}
                    type={showPassword ? "text" : "password"}
                    id="sign-in-password"
                    autoComplete="current-password"
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
      </FieldGroup>

      <Button
        type="submit"
        aria-label={t("auth.signInPage.form.submit")}
        data-testid="sign-in-form-submit-button"
        disabled={form.formState.isSubmitting}
        className="h-11 gap-2 bg-foreground text-background text-sm transition-all hover:bg-foreground/80"
      >
        {form.formState.isSubmitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
        {form.formState.isSubmitting ? t("auth.signInPage.form.submitting") : t("auth.signInPage.form.submit")}
      </Button>
    </form>
  )
}
