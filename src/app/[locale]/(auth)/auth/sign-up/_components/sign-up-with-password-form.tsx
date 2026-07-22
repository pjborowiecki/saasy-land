"use client"

import { type JSX, useCallback } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useLocale, useTranslations } from "next-intl"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"

import { signUp } from "~/src/modules/identity-access/infrastructure/auth/auth._client"
import { authErrorKey } from "~/src/modules/identity-access/infrastructure/auth/auth.errors"
import { signUpWithPasswordSchema } from "~/src/modules/identity-access/infrastructure/auth/auth.schemas"

import { getPathname, useRouter } from "~/src/integrations/next-intl/i18n.navigation"

import { useConfetti } from "~/src/hooks/use-confetti"

import { PasswordRequirements } from "~/src/app/[locale]/(auth)/auth/_components/password-requirements"
import { AUTH_FORM_IDS } from "~/src/app/[locale]/(auth)/auth/_constants/auth-form-ids"
import {
  SignUpFormFields,
  type SignUpFormValues,
} from "~/src/app/[locale]/(auth)/auth/sign-up/_components/sign-up-with-password-form-fields"
import { SignUpSubmitButton } from "~/src/app/[locale]/(auth)/auth/sign-up/_components/sign-up-with-password-submit-button"
import { ROUTES } from "~/src/routes"

export function SignUpWithPasswordForm(): JSX.Element {
  const { triggerConfetti } = useConfetti()

  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()

  const formSchema = signUpWithPasswordSchema((key, params) => t(`auth.validations.${key}`, params))
  const form = useForm<SignUpFormValues>({
    defaultValues: { confirmPassword: "", email: "", name: "", password: "" },
    mode: "onChange",
    resolver: zodResolver(formSchema),
  })

  const onSubmit = useCallback(
    async (data: SignUpFormValues) => {
      await signUp.email({
        email: data.email,
        fetchOptions: {
          onError: (ctx) => {
            toast.error(t(`auth.errors.${authErrorKey(ctx.error)}`))
          },
          onSuccess: () => {
            triggerConfetti()
            toast.success(t("pages.auth.sign-up.form.successCheckEmail"))
            router.push(
              getPathname({
                href: `${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(data.email)}`,
                locale,
              }),
            )
          },
        },
        name: data.name,
        password: data.password,
      })
    },
    [locale, router, t, triggerConfetti],
  )

  return (
    <FormProvider {...form}>
      <form className="flex flex-col gap-4" id={`${AUTH_FORM_IDS.SIGN_UP}-form`} onSubmit={form.handleSubmit(onSubmit)}>
        <SignUpFormFields />
        <PasswordRequirements />
        <SignUpSubmitButton />
      </form>
    </FormProvider>
  )
}
