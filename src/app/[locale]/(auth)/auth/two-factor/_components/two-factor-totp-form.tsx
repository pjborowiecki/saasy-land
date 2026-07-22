"use client"

import { type JSX, useCallback, useTransition } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import type z from "zod/v4"

import { twoFactorZodSchemas } from "~/src/modules/two-factor/two-factor.zod"
import { verifyTotp } from "~/src/modules/two-factor/use-cases/verify-totp.use-case"

import { Button } from "~/src/presentation/components/shadcn/button"

import { AuthOtpField } from "~/src/app/[locale]/(auth)/auth/_components/auth-otp-field"
import { AUTH_FORM_IDS } from "~/src/app/[locale]/(auth)/auth/_constants/auth-form-ids"
import { useTwoFactorRedirect } from "~/src/app/[locale]/(auth)/auth/two-factor/_components/use-two-factor-redirect"

const verifyTotpInputSchema = twoFactorZodSchemas.verifyTotp

const TOTP_CODE_LENGTH = 6

interface TwoFactorTotpFormProps {
  readonly onToggleMode: () => void
}

export function TwoFactorTotpForm({ onToggleMode }: Readonly<TwoFactorTotpFormProps>): JSX.Element {
  const t = useTranslations()
  const [isPending, startTransition] = useTransition()
  const redirectAfterVerification = useTwoFactorRedirect()

  const totpFormMethods = useForm<z.infer<typeof verifyTotpInputSchema>>({
    defaultValues: { code: "", trustDevice: true },
    resolver: zodResolver(verifyTotpInputSchema),
  })

  const onSubmitTotp = useCallback(
    (data: z.infer<typeof verifyTotpInputSchema>) => {
      startTransition(async () => {
        const result = await verifyTotp(data)

        if (result.serverError) {
          toast.error(t("auth.errors.unexpectedError"))
          return
        }

        await redirectAfterVerification()
      })
    },
    [redirectAfterVerification, t],
  )

  return (
    <FormProvider {...totpFormMethods}>
      <form className="flex flex-col gap-6" id={`${AUTH_FORM_IDS.TWO_FACTOR}-form`} onSubmit={totpFormMethods.handleSubmit(onSubmitTotp)}>
        <AuthOtpField
          formId={AUTH_FORM_IDS.TWO_FACTOR}
          label={t("pages.auth.two-factor.form.code")}
          maxLength={TOTP_CODE_LENGTH}
          name="code"
        />

        <Button
          className="h-11 gap-2 bg-foreground text-background hover:bg-foreground/80"
          data-testid="two-factor-form-submit-button"
          isDisabled={isPending || totpFormMethods.formState.isSubmitting}
          type="submit"
        >
          {(isPending || totpFormMethods.formState.isSubmitting) && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
          {isPending || totpFormMethods.formState.isSubmitting
            ? t("pages.auth.two-factor.form.submitting")
            : t("pages.auth.two-factor.form.submit")}
        </Button>

        <Button className="h-11" onPress={onToggleMode} type="button" variant="outline">
          {t("pages.auth.two-factor.form.useBackupCode")}
        </Button>
      </form>
    </FormProvider>
  )
}
