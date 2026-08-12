"use client"

import { type JSX } from "react"

import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useFormContext } from "react-hook-form"

import { Button } from "~/src/presentation/components/shadcn/button"

import { AUTH_PRIMARY_BUTTON_CLASS } from "~/src/app/[locale]/(auth)/auth/_constants/auth-styles"
import { type SignInFormValues } from "~/src/app/[locale]/(auth)/auth/sign-in/_components/sign-in-with-password-form-fields"

export function SignInSubmitButton({ isPending = false }: Readonly<{ isPending?: boolean }>): JSX.Element {
  const t = useTranslations("pages.auth.sign-in")
  const form = useFormContext<SignInFormValues>()
  const isLoading = form.formState.isSubmitting || isPending

  return (
    <Button
      aria-label={t("form.submit")}
      className={AUTH_PRIMARY_BUTTON_CLASS}
      data-testid="sign-in-form-submit-button"
      isDisabled={isLoading}
      type="submit"
    >
      {isLoading && <Loader2 aria-hidden="true" className="size-4 animate-spin" strokeWidth={1.5} />}
      {isLoading ? t("form.submitting") : t("form.submit")}
    </Button>
  )
}
