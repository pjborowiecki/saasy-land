"use client"

import { type JSX, useCallback } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import type z from "zod/v4"

import { twoFactor } from "~/src/modules/identity-access/infrastructure/auth/auth._client"
import { authErrorKey } from "~/src/modules/identity-access/infrastructure/auth/auth.errors"
import { twoFactorBackupCodeSchema } from "~/src/modules/identity-access/infrastructure/auth/auth.schemas"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Field, FieldContent, FieldError, FieldLabel } from "~/src/presentation/components/shadcn/field"
import { Input } from "~/src/presentation/components/shadcn/input"

import { AUTH_FORM_IDS } from "~/src/app/[locale]/(auth)/auth/_constants/auth-form-ids"
import { useTwoFactorRedirect } from "~/src/app/[locale]/(auth)/auth/two-factor/_components/use-two-factor-redirect"

interface TwoFactorBackupFormProps {
  readonly onToggleMode: () => void
}

export function TwoFactorBackupForm({ onToggleMode }: Readonly<TwoFactorBackupFormProps>): JSX.Element {
  const t = useTranslations()
  const redirectAfterVerification = useTwoFactorRedirect()

  const backupSchema = twoFactorBackupCodeSchema((key, params) => t(`auth.validations.${key}`, params))
  const backupForm = useForm<z.infer<typeof backupSchema>>({
    defaultValues: { code: "" },
    resolver: zodResolver(backupSchema),
  })

  const onSubmitBackup = useCallback(
    async (data: z.infer<typeof backupSchema>) => {
      await twoFactor.verifyBackupCode({
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
    <FormProvider {...backupForm}>
      <form
        className="flex flex-col gap-6"
        id={`${AUTH_FORM_IDS.TWO_FACTOR}-backup-form`}
        onSubmit={backupForm.handleSubmit(onSubmitBackup)}
      >
        <Field>
          <FieldLabel htmlFor={`${AUTH_FORM_IDS.TWO_FACTOR}-backup-code`}>{t("pages.auth.two-factor.form.backupCode")}</FieldLabel>
          <FieldContent>
            <Input
              {...backupForm.register("code")}
              autoComplete="one-time-code"
              className="h-11 rounded-xl border border-white/10 bg-transparent px-4 text-sm"
              id={`${AUTH_FORM_IDS.TWO_FACTOR}-backup-code`}
            />
            {backupForm.formState.errors.code && <FieldError>{backupForm.formState.errors.code.message}</FieldError>}
          </FieldContent>
        </Field>

        <Button
          className="h-11 gap-2 bg-foreground text-background hover:bg-foreground/80"
          data-testid="two-factor-backup-submit-button"
          isDisabled={backupForm.formState.isSubmitting}
          type="submit"
        >
          {backupForm.formState.isSubmitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
          {backupForm.formState.isSubmitting ? t("pages.auth.two-factor.form.submitting") : t("pages.auth.two-factor.form.submit")}
        </Button>

        <Button className="h-11" onPress={onToggleMode} type="button" variant="outline">
          {t("pages.auth.two-factor.form.useAuthenticator")}
        </Button>
      </form>
    </FormProvider>
  )
}
