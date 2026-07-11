"use client"

import { type JSX, useCallback } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import type z from "zod/v4"

import { twoFactor } from "~/src/integrations/better-auth/auth._client"
import { authErrorKey } from "~/src/integrations/better-auth/auth.errors"
import { twoFactorTotpSchema } from "~/src/integrations/better-auth/auth.schemas"

import { Button } from "~/src/components/shadcn/button"

import { AuthOtpField } from "~/src/app/[locale]/(auth)/auth/_components/auth-otp-field"
import { AUTH_FORM_IDS } from "~/src/app/[locale]/(auth)/auth/_constants/auth-form-ids"
import { useTwoFactorRedirect } from "~/src/app/[locale]/(auth)/auth/two-factor/_components/use-two-factor-redirect"

const TOTP_CODE_LENGTH = 6

interface TwoFactorTotpFormProps {
  readonly onToggleMode: () => void
}

export function TwoFactorTotpForm({ onToggleMode }: Readonly<TwoFactorTotpFormProps>): JSX.Element {
  const t = useTranslations()
  const redirectAfterVerification = useTwoFactorRedirect()

  const totpSchema = twoFactorTotpSchema((key, params) => t(`auth.validations.${key}`, params))
  const totpForm = useForm<z.infer<typeof totpSchema>>({
    defaultValues: { code: "" },
    resolver: zodResolver(totpSchema),
  })

  const onSubmitTotp = useCallback(
    async (data: z.infer<typeof totpSchema>) => {
      await twoFactor.verifyTotp({
        code: data.code,
        fetchOptions: {
          onError: (ctx) => {
            toast.error(t(`auth.errors.${authErrorKey(ctx.error)}`))
          },
          onSuccess: async () => {
            await redirectAfterVerification()
          },
        },
        trustDevice: true,
      })
    },
    [redirectAfterVerification, t],
  )

  return (
    <FormProvider {...totpForm}>
      <form className="flex flex-col gap-6" id={`${AUTH_FORM_IDS.TWO_FACTOR}-form`} onSubmit={totpForm.handleSubmit(onSubmitTotp)}>
        <AuthOtpField
          formId={AUTH_FORM_IDS.TWO_FACTOR}
          label={t("pages.auth.two-factor.form.code")}
          maxLength={TOTP_CODE_LENGTH}
          name="code"
        />

        <Button
          className="h-11 gap-2 bg-foreground text-background hover:bg-foreground/80"
          data-testid="two-factor-form-submit-button"
          disabled={totpForm.formState.isSubmitting}
          type="submit"
        >
          {totpForm.formState.isSubmitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
          {totpForm.formState.isSubmitting ? t("pages.auth.two-factor.form.submitting") : t("pages.auth.two-factor.form.submit")}
        </Button>

        <Button className="h-11" onClick={onToggleMode} type="button" variant="outline">
          {t("pages.auth.two-factor.form.useBackupCode")}
        </Button>
      </form>
    </FormProvider>
  )
}
