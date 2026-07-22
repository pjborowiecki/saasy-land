"use client"

import { type JSX } from "react"

import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useFormContext } from "react-hook-form"

import { Button } from "~/src/presentation/components/shadcn/button"

import { type SignUpFormValues } from "~/src/app/[locale]/(auth)/auth/sign-up/_components/sign-up-with-password-form-fields"

export function SignUpSubmitButton(): JSX.Element {
  const t = useTranslations("pages.auth.sign-up")
  const form = useFormContext<SignUpFormValues>()

  return (
    <Button
      aria-label={t("form.submit")}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-foreground px-8 text-sm font-medium text-background shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all hover:bg-foreground/90 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)]"
      isDisabled={form.formState.isSubmitting}
      id="sign-up-form-submit-button"
      type="submit"
    >
      {form.formState.isSubmitting && <Loader2 aria-hidden="true" className="mr-2 size-4 animate-spin" />}
      {form.formState.isSubmitting ? t("form.submitting") : t("form.submit")}
    </Button>
  )
}
