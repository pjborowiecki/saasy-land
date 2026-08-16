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

import { cn } from "~/src/utils"

import { useActionError } from "~/src/hooks/use-action-error"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Field, FieldContent, FieldLabel } from "~/src/presentation/components/shadcn/field"
import { Input } from "~/src/presentation/components/shadcn/input"

import { AuthFieldError } from "~/src/app/[locale]/(auth)/auth/_components/auth-field-error"
import { AUTH_FORM_IDS } from "~/src/app/[locale]/(auth)/auth/_constants/auth-form-ids"
import {
  AUTH_FIELD_CONTENT_CLASS,
  AUTH_INPUT_CLASS,
  AUTH_LABEL_CLASS,
  AUTH_PRIMARY_BUTTON_CLASS,
  AUTH_SECONDARY_BUTTON_CLASS,
} from "~/src/app/[locale]/(auth)/auth/_constants/auth-styles"
import { useTwoFactorRedirect } from "~/src/app/[locale]/(auth)/auth/two-factor/_lib/use-two-factor-redirect"

/** A backup code is a code, so it is set in mono like the OTP it stands in for. */
const BACKUP_CODE_INPUT_CLASS = "font-mono tracking-wider"

const BACKUP_CODE_ERROR_ID = `${AUTH_FORM_IDS.TWO_FACTOR}-backup-code-error`
const BACKUP_CODE_FIELD_ID = `${AUTH_FORM_IDS.TWO_FACTOR}-backup-code`

const verifyBackupCodeInputSchema = twoFactorZodSchemas.verifyBackupCode

interface TwoFactorBackupFormProps {
  readonly onToggleMode: () => void
}

export function TwoFactorBackupForm({ onToggleMode }: Readonly<TwoFactorBackupFormProps>): JSX.Element {
  const t = useTranslations()
  const actionError = useActionError()
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

        const error = actionError(result)

        if (error) {
          toast.error(error)
          return
        }

        await redirectAfterVerification()
      })
    },
    [actionError, redirectAfterVerification],
  )

  return (
    <FormProvider {...backupForm}>
      <form
        className="flex flex-col gap-6"
        id={`${AUTH_FORM_IDS.TWO_FACTOR}-backup-form`}
        onSubmit={backupForm.handleSubmit(onSubmitBackup)}
      >
        <Field>
          <FieldLabel className={AUTH_LABEL_CLASS} htmlFor={BACKUP_CODE_FIELD_ID}>
            {t("pages.auth.two-factor.form.backupCode")}
          </FieldLabel>
          <FieldContent className={AUTH_FIELD_CONTENT_CLASS}>
            <Input
              {...backupForm.register("code")}
              aria-describedby={backupForm.formState.errors.code === undefined ? undefined : BACKUP_CODE_ERROR_ID}
              aria-invalid={backupForm.formState.errors.code !== undefined}
              autoComplete="one-time-code"
              className={cn(AUTH_INPUT_CLASS, BACKUP_CODE_INPUT_CLASS)}
              id={BACKUP_CODE_FIELD_ID}
            />
            <AuthFieldError id={BACKUP_CODE_ERROR_ID} message={backupForm.formState.errors.code?.message} />
          </FieldContent>
        </Field>

        <Button
          className={AUTH_PRIMARY_BUTTON_CLASS}
          data-testid="two-factor-backup-submit-button"
          isDisabled={isPending || backupForm.formState.isSubmitting}
          type="submit"
        >
          {(isPending || backupForm.formState.isSubmitting) && (
            <Loader2 aria-hidden="true" className="size-4 animate-spin" strokeWidth={1.5} />
          )}
          {isPending || backupForm.formState.isSubmitting
            ? t("pages.auth.two-factor.form.submitting")
            : t("pages.auth.two-factor.form.submit")}
        </Button>

        <Button className={AUTH_SECONDARY_BUTTON_CLASS} onPress={onToggleMode} type="button" variant="outline">
          {t("pages.auth.two-factor.form.useAuthenticator")}
        </Button>
      </form>
    </FormProvider>
  )
}
