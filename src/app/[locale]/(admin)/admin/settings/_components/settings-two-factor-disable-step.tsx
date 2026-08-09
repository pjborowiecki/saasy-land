"use client"

import { type JSX, useCallback, useTransition } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import type z from "zod/v4"

import { twoFactorZodSchemas } from "~/src/modules/two-factor/two-factor.zod"
import { disableTwoFactor } from "~/src/modules/two-factor/use-cases/disable-two-factor.use-case"

import { useActionError } from "~/src/hooks/use-action-error"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Field, FieldContent, FieldLabel } from "~/src/presentation/components/shadcn/field"
import { Input } from "~/src/presentation/components/shadcn/input"

import { AuthFieldError } from "~/src/app/[locale]/(auth)/auth/_components/auth-field-error"
import { AUTH_FORM_IDS } from "~/src/app/[locale]/(auth)/auth/_constants/auth-form-ids"

const disableTwoFactorSchema = twoFactorZodSchemas.disableTwoFactor

interface SettingsTwoFactorDisableStepProps {
  readonly onDisabled: () => void
}

export function SettingsTwoFactorDisableStep({ onDisabled }: Readonly<SettingsTwoFactorDisableStepProps>): JSX.Element {
  const t = useTranslations("pages.admin.settings")
  const actionError = useActionError()
  const [isPending, startTransition] = useTransition()

  const passwordForm = useForm<z.infer<typeof disableTwoFactorSchema>>({
    defaultValues: { password: "" },
    resolver: zodResolver(disableTwoFactorSchema),
  })

  const onDisable = useCallback(
    (data: z.infer<typeof disableTwoFactorSchema>) => {
      startTransition(async () => {
        const result = await disableTwoFactor({ password: data.password })

        const error = actionError(result)

        if (error) {
          toast.error(error)
          return
        }

        onDisabled()
      })
    },
    [actionError, onDisabled],
  )

  return (
    <FormProvider {...passwordForm}>
      <form className="flex flex-col gap-4" onSubmit={passwordForm.handleSubmit(onDisable)}>
        <Field>
          <FieldLabel htmlFor={`${AUTH_FORM_IDS.TWO_FACTOR}-disable-password`}>{t("security.twoFactor.password")}</FieldLabel>
          <FieldContent>
            <Input
              {...passwordForm.register("password")}
              autoComplete="current-password"
              id={`${AUTH_FORM_IDS.TWO_FACTOR}-disable-password`}
              type="password"
            />
            <AuthFieldError message={passwordForm.formState.errors.password?.message} />
          </FieldContent>
        </Field>

        <Button className="gap-2" isDisabled={isPending || passwordForm.formState.isSubmitting} type="submit" variant="destructive">
          {(isPending || passwordForm.formState.isSubmitting) && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
          {t("security.twoFactor.disableConfirm")}
        </Button>
      </form>
    </FormProvider>
  )
}
