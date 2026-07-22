"use client"

import { type JSX, useCallback, useTransition } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import type z from "zod/v4"

import { twoFactorZodSchemas } from "~/src/modules/two-factor/two-factor.zod"
import { verifyBackupCode } from "~/src/modules/two-factor/use-cases/verify-backup-code.use-case"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Field, FieldContent, FieldLabel } from "~/src/presentation/components/shadcn/field"
import { Input } from "~/src/presentation/components/shadcn/input"

import { AuthFieldError } from "~/src/app/[locale]/(auth)/auth/_components/auth-field-error"
import { AUTH_FORM_IDS } from "~/src/app/[locale]/(auth)/auth/_constants/auth-form-ids"
import { useTwoFactorRedirect } from "~/src/app/[locale]/(auth)/auth/two-factor/_components/use-two-factor-redirect"

const verifyBackupCodeInputSchema = twoFactorZodSchemas.verifyBackupCode

interface TwoFactorBackupFormProps {
  readonly onToggleMode: () => void
}

export function TwoFactorBackupForm({ onToggleMode }: Readonly<TwoFactorBackupFormProps>): JSX.Element {
  const t = useTranslations()
  const [isPending, startTransition] = useTransition()
  const redirectAfterVerification = useTwoFactorRedirect()

  const backupForm = useForm<z.infer<typeof verifyBackupCodeInputSchema>>({
    defaultValues: { code: "", trustDevice: true },
    resolver: zodResolver(verifyBackupCodeInputSchema),
  })

  const onSubmitBackup = useCallback(
    (data: z.infer<typeof verifyBackupCodeInputSchema>) => {
      startTransition(async () => {
        const result = await verifyBackupCode(data)

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
            <AuthFieldError message={backupForm.formState.errors.code?.message} />
          </FieldContent>
        </Field>

        <Button
          className="h-11 gap-2 bg-foreground text-background hover:bg-foreground/80"
          data-testid="two-factor-backup-submit-button"
          isDisabled={isPending || backupForm.formState.isSubmitting}
          type="submit"
        >
          {(isPending || backupForm.formState.isSubmitting) && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
          {isPending || backupForm.formState.isSubmitting
            ? t("pages.auth.two-factor.form.submitting")
            : t("pages.auth.two-factor.form.submit")}
        </Button>

        <Button className="h-11" onPress={onToggleMode} type="button" variant="outline">
          {t("pages.auth.two-factor.form.useAuthenticator")}
        </Button>
      </form>
    </FormProvider>
  )
}
