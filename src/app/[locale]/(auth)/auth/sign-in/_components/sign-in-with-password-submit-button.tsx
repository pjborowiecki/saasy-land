"use client"

import { type JSX } from "react"

import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useFormContext } from "react-hook-form"

import { Button } from "~/src/components/shadcn/button"

import { type SignInFormValues } from "~/src/app/[locale]/(auth)/auth/sign-in/_components/sign-in-with-password-form-fields"

export function SignInSubmitButton(): JSX.Element {
  const t = useTranslations("pages.auth.sign-in")
  const form = useFormContext<SignInFormValues>()

  return (
    <Button
      aria-label={t("form.submit")}
      className="h-11 gap-2 bg-foreground text-sm text-background transition-all hover:bg-foreground/80"
      data-testid="sign-in-form-submit-button"
      disabled={form.formState.isSubmitting}
      type="submit"
    >
      {form.formState.isSubmitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
      {form.formState.isSubmitting ? t("form.submitting") : t("form.submit")}
    </Button>
  )
}
