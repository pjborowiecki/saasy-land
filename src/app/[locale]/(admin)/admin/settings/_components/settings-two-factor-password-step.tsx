"use client"

import { type JSX, useCallback, useTransition } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import type z from "zod/v4"

import { parseTwoFactorEnableData } from "~/src/modules/two-factor/two-factor.utils"
import { twoFactorZodSchemas } from "~/src/modules/two-factor/two-factor.zod"
import { enableTwoFactor } from "~/src/modules/two-factor/use-cases/enable-two-factor.use-case"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Field, FieldContent, FieldLabel } from "~/src/presentation/components/shadcn/field"
import { Input } from "~/src/presentation/components/shadcn/input"

import { AuthFieldError } from "~/src/app/[locale]/(auth)/auth/_components/auth-field-error"
import { AUTH_FORM_IDS } from "~/src/app/[locale]/(auth)/auth/_constants/auth-form-ids"

const enableTwoFactorSchema = twoFactorZodSchemas.enableTwoFactor

interface SettingsTwoFactorPasswordStepProps {
  readonly onEnabled: (totpUri: string, backupCodes: readonly string[]) => void
}

export function SettingsTwoFactorPasswordStep({ onEnabled }: Readonly<SettingsTwoFactorPasswordStepProps>): JSX.Element {
  const t = useTranslations("pages.admin.settings")
  const [isPending, startTransition] = useTransition()

  const passwordForm = useForm<z.infer<typeof enableTwoFactorSchema>>({
    defaultValues: { password: "" },
    resolver: zodResolver(enableTwoFactorSchema),
  })

  const onEnable = useCallback(
    (data: z.infer<typeof enableTwoFactorSchema>) => {
      startTransition(async () => {
        const result = await enableTwoFactor({ password: data.password })

        if (result.serverError) {
          toast.error(result.serverError.message)
          return
        }

        const enableData = parseTwoFactorEnableData(result.data)

        if (enableData === undefined) {
          toast.error(t("security.twoFactor.setupError"))
          return
        }

        onEnabled(enableData.totpURI, enableData.backupCodes)
      })
    },
    [onEnabled, t],
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
            <AuthFieldError message={passwordForm.formState.errors.password?.message} />
          </FieldContent>
        </Field>

        <Button className="gap-2" isDisabled={isPending || passwordForm.formState.isSubmitting} type="submit">
          {(isPending || passwordForm.formState.isSubmitting) && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
          {t("security.twoFactor.continue")}
        </Button>
      </form>
    </FormProvider>
  )
}
