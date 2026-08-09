"use client"

import { type JSX, useCallback, useTransition } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useLocale, useTranslations } from "next-intl"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"

import { env } from "~/src/platform/env"

import { signUpWithPassword } from "~/src/modules/account/use-cases/sign-up-with-password.use-case"

import { signUpWithPasswordSchema } from "~/src/integrations/better-auth/auth.zod"
import { getPathname, useRouter } from "~/src/integrations/next-intl/i18n.navigation"

import { useActionError } from "~/src/hooks/use-action-error"
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
  const [isPending, startTransition] = useTransition()
  const { triggerConfetti } = useConfetti()

  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()
  const actionError = useActionError()

  const form = useForm<SignUpFormValues>({
    defaultValues: { confirmPassword: "", email: "", name: "", password: "" },
    mode: "onBlur",
    resolver: zodResolver(signUpWithPasswordSchema),
  })

  const onSubmit = useCallback(
    (data: SignUpFormValues) => {
      startTransition(async () => {
        const callbackURL = `${env.NEXT_PUBLIC_APP_URL}${getPathname({ href: ROUTES.APP, locale })}`
        const result = await signUpWithPassword({ ...data, callbackURL })

        const error = actionError(result)

        if (error) {
          toast.error(error)
          return
        }

        triggerConfetti()
        toast.success(t("pages.auth.sign-up.form.successCheckEmail"))

        router.push(
          getPathname({
            href: `${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(data.email)}`,
            locale,
          }),
        )
      })
    },
    [actionError, locale, router, t, triggerConfetti],
  )

  return (
    <FormProvider {...form}>
      <form className="flex flex-col gap-4" id={`${AUTH_FORM_IDS.SIGN_UP}-form`} onSubmit={form.handleSubmit(onSubmit)}>
        <SignUpFormFields />
        <PasswordRequirements />
        <SignUpSubmitButton isPending={isPending} />
      </form>
    </FormProvider>
  )
}
