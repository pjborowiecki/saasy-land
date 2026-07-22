"use client"

import { type JSX, useCallback } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useLocale, useTranslations } from "next-intl"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"

import { getSession, signIn } from "~/src/modules/identity-access/infrastructure/auth/auth._client"
import { hasAdminAccess } from "~/src/modules/identity-access/infrastructure/auth/auth.access"
import { AUTH_ERRORS, authErrorKey } from "~/src/modules/identity-access/infrastructure/auth/auth.errors"
import { signInWithPasswordSchema } from "~/src/modules/identity-access/infrastructure/auth/auth.schemas"

import { getPathname, useRouter } from "~/src/integrations/next-intl/i18n.navigation"

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

  const formSchema = signInWithPasswordSchema((key, params) => t(`auth.validations.${key}`, params))
  const form = useForm<SignInFormValues>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(formSchema),
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
            const { data: session } = await getSession()
            let href: string = ROUTES.APP

            if (hasAdminAccess(session?.user.role)) {
              href = ROUTES.ADMIN
            }

            router.push(getPathname({ href, locale }))
          },
        },
        password: data.password,
      })
    },
    [locale, router, t],
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
