"use client"

import { type JSX, useCallback } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useLocale, useTranslations } from "next-intl"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"

import { signIn } from "~/src/integrations/better-auth/auth.client"
import { AUTH_ERRORS, authErrorKey } from "~/src/integrations/better-auth/auth.errors"
import { signInWithPasswordSchema } from "~/src/integrations/better-auth/auth.zod"
import { getPathname, useRouter } from "~/src/integrations/next-intl/i18n.navigation"

import { usePostAuthRedirect } from "~/src/hooks/use-post-auth-redirect"

import { AUTH_FORM_IDS } from "~/src/app/[locale]/(auth)/auth/_constants/auth-form-ids"
import {
  SignInFormFields,
  type SignInFormValues,
} from "~/src/app/[locale]/(auth)/auth/sign-in/_components/sign-in-with-password-form-fields"
import { SignInSubmitButton } from "~/src/app/[locale]/(auth)/auth/sign-in/_components/sign-in-with-password-submit-button"
import { ROUTES } from "~/src/routes"

export function SignInWithPasswordForm(): JSX.Element {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()
  const redirectAfterAuth = usePostAuthRedirect()

  const form = useForm<SignInFormValues>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(signInWithPasswordSchema),
  })

  const onSubmit = useCallback(
    async (data: SignInFormValues) => {
      await signIn.email({
        email: data.email,
        fetchOptions: {
          onError: (ctx) => {
            const errorKey = authErrorKey(ctx.error)

            if (errorKey === AUTH_ERRORS.EMAIL_NOT_VERIFIED) {
              toast.error(t(`auth.errors.${errorKey}`))
              router.push(
                getPathname({
                  href: `${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(data.email)}`,
                  locale,
                }),
              )
              return
            }

            toast.error(t(`auth.errors.${errorKey}`))
          },
          onSuccess: async () => {
            toast.success(t("pages.auth.sign-in.form.success"))
            await redirectAfterAuth()
          },
        },
        password: data.password,
      })
    },
    [locale, redirectAfterAuth, router, t],
  )

  return (
    <FormProvider {...form}>
      <form className="flex flex-col gap-4" id={`${AUTH_FORM_IDS.SIGN_IN}-form`} onSubmit={form.handleSubmit(onSubmit)}>
        <SignInFormFields />
        <SignInSubmitButton />
      </form>
    </FormProvider>
  )
}
