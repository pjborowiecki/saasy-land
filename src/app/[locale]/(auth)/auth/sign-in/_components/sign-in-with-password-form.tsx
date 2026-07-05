"use client"

import { type JSX, useCallback } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"

import { getSession, signIn } from "~/src/integrations/better-auth/auth._client"
import { getPostAuthRedirect } from "~/src/integrations/better-auth/auth.access"
import { authErrorKey } from "~/src/integrations/better-auth/auth.errors"
import { signInWithPasswordSchema } from "~/src/integrations/better-auth/auth.schemas"
import { useRouter } from "~/src/integrations/next-intl/i18n.navigation"

import { AUTH_FORM_IDS, authFormElementId } from "~/src/app/[locale]/(auth)/auth/_constants/auth-form-ids"
import { useFormSubmitHandler } from "~/src/app/[locale]/(auth)/auth/_utils/use-form-submit-handler"
import {
  SignInFormFields,
  type SignInFormValues,
} from "~/src/app/[locale]/(auth)/auth/sign-in/_components/sign-in-with-password-form-fields"
import { SignInSubmitButton } from "~/src/app/[locale]/(auth)/auth/sign-in/_components/sign-in-with-password-submit-button"

export function SignInWithPasswordForm(): JSX.Element {
  const router = useRouter()
  const t = useTranslations()

  const formSchema = signInWithPasswordSchema(t)
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
            toast.error(t(`auth.errors.${authErrorKey(ctx.error)}`))
          },
          onSuccess: async () => {
            toast.success(t("auth.signInPage.form.success"))
            const { data: session } = await getSession()
            router.push(getPostAuthRedirect(session?.user.role))
          },
        },
        password: data.password,
      })
    },
    [router, t],
  )

  const handleFormSubmit = useFormSubmitHandler(form, onSubmit)

  return (
    <FormProvider {...form}>
      <form className="flex flex-col gap-4" id={authFormElementId(AUTH_FORM_IDS.SIGN_IN)} onSubmit={handleFormSubmit}>
        <SignInFormFields />
        <SignInSubmitButton />
      </form>
    </FormProvider>
  )
}
