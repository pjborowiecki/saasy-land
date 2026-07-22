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
import { enableTwoFactorSchema } from "~/src/modules/identity-access/infrastructure/auth/auth.schemas"
import { parseTwoFactorEnableData } from "~/src/modules/identity-access/infrastructure/auth/auth.two-factor"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Field, FieldContent, FieldError, FieldLabel } from "~/src/presentation/components/shadcn/field"
import { Input } from "~/src/presentation/components/shadcn/input"

import { AUTH_FORM_IDS } from "~/src/app/[locale]/(auth)/auth/_constants/auth-form-ids"

interface SettingsTwoFactorPasswordStepProps {
  readonly onEnabled: (totpUri: string, backupCodes: readonly string[]) => void
}

export function SettingsTwoFactorPasswordStep({ onEnabled }: Readonly<SettingsTwoFactorPasswordStepProps>): JSX.Element {
  const t = useTranslations("pages.admin.settings")
  const tErrors = useTranslations("auth.errors")
  const tValidations = useTranslations("auth.validations")

  const passwordSchema = enableTwoFactorSchema((key, params) => tValidations(key, params))
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    defaultValues: { password: "" },
    resolver: zodResolver(passwordSchema),
  })

  const onEnable = useCallback(
    async (data: z.infer<typeof passwordSchema>) => {
      await twoFactor.enable({
        fetchOptions: {
          onError: (ctx) => {
            toast.error(tErrors(authErrorKey(ctx.error)))
          },
          onSuccess: (ctx) => {
            const enableData = parseTwoFactorEnableData(ctx.data)

            if (enableData === undefined) {
              toast.error(t("security.twoFactor.setupError"))
              return
            }

            onEnabled(enableData.totpURI, enableData.backupCodes)
          },
        },
        password: data.password,
      })
    },
    [onEnabled, t, tErrors],
  )

  return (
    <FormProvider {...passwordForm}>
      <form className="flex flex-col gap-4" onSubmit={passwordForm.handleSubmit(onEnable)}>
        <Field>
          <FieldLabel htmlFor={`${AUTH_FORM_IDS.TWO_FACTOR}-enable-password`}>{t("security.twoFactor.password")}</FieldLabel>
          <FieldContent>
            <Input
              {...passwordForm.register("password")}
              autoComplete="current-password"
              id={`${AUTH_FORM_IDS.TWO_FACTOR}-enable-password`}
              type="password"
            />
            {passwordForm.formState.errors.password && <FieldError>{passwordForm.formState.errors.password.message}</FieldError>}
          </FieldContent>
        </Field>

        <Button className="gap-2" isDisabled={passwordForm.formState.isSubmitting} type="submit">
          {passwordForm.formState.isSubmitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
          {t("security.twoFactor.continue")}
        </Button>
      </form>
    </FormProvider>
  )
}
