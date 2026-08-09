"use client"

import { type JSX, useCallback, useTransition } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Check, Loader2, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { FormProvider, useForm, useWatch, type UseFormReturn } from "react-hook-form"
import { toast } from "sonner"
import type z from "zod/v4"

import { accountZodSchemas } from "~/src/modules/account/account.zod"
import { settingsChangePassword } from "~/src/modules/account/use-cases/change-password.use-case"

import { getPasswordRuleState } from "~/src/integrations/better-auth/auth.constraints"
import { useRouter } from "~/src/integrations/next-intl/i18n.navigation"

import { useActionError } from "~/src/hooks/use-action-error"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/src/presentation/components/shadcn/card"
import { Field, FieldContent, FieldLabel } from "~/src/presentation/components/shadcn/field"
import { Input } from "~/src/presentation/components/shadcn/input"
import { Label } from "~/src/presentation/components/shadcn/label"

import { AuthFieldError } from "~/src/app/[locale]/(auth)/auth/_components/auth-field-error"

const changePasswordSchema = accountZodSchemas.changePasswordForm

type ChangePasswordForm = z.infer<typeof changePasswordSchema>

export function SettingsPasswordFormClient(): JSX.Element {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const t = useTranslations("pages.admin.settings")
  const actionError = useActionError()

  const form = useForm<ChangePasswordForm>({
    defaultValues: { confirmNewPassword: "", currentPassword: "", newPassword: "" },
    resolver: zodResolver(changePasswordSchema),
  })

  const newPassword = useWatch({ control: form.control, name: "newPassword" }) ?? ""

  const onSubmit = useCallback(
    (data: ChangePasswordForm) => {
      startTransition(async () => {
        const result = await settingsChangePassword({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        })

        const error = actionError(result)

        if (error) {
          toast.error(error)
          return
        }

        toast.success(t("security.password.feedback.updateSuccess"))
        form.reset()
        router.refresh()
      })
    },
    [actionError, form, router, t],
  )

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border/40 p-5">
        <CardTitle className="mb-1 text-base font-medium text-foreground">{t("security.password.title")}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">{t("security.password.description")}</CardDescription>
      </CardHeader>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 items-start gap-8 p-5 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
              <SettingsPasswordFields form={form} t={t} />
              <SettingsPasswordRequirementsPanel password={newPassword} t={t} />
            </div>
          </CardContent>
          <div className="flex justify-end border-t border-border/40 bg-secondary/20 p-4">
            <Button type="submit" size="sm" className="h-8 px-4 text-xs shadow-sm" isDisabled={isPending}>
              {isPending ? <Loader2 className="size-4 animate-spin" /> : t("security.password.update")}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Card>
  )
}

function SettingsPasswordFields({
  form,
  t,
}: {
  readonly form: UseFormReturn<ChangePasswordForm>
  readonly t: ReturnType<typeof useTranslations<"pages.admin.settings">>
}): JSX.Element {
  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel className="text-xs">{t("security.password.current")}</FieldLabel>
        <FieldContent>
          <Input type="password" autoComplete="current-password" {...form.register("currentPassword")} />
        </FieldContent>
        <AuthFieldError message={form.formState.errors.currentPassword?.message} />
      </Field>
      <Field>
        <FieldLabel className="text-xs">{t("security.password.new")}</FieldLabel>
        <FieldContent>
          <Input type="password" autoComplete="new-password" {...form.register("newPassword")} />
        </FieldContent>
        <AuthFieldError message={form.formState.errors.newPassword?.message} />
      </Field>
      <Field>
        <FieldLabel className="text-xs">{t("security.password.confirm")}</FieldLabel>
        <FieldContent>
          <Input type="password" autoComplete="new-password" {...form.register("confirmNewPassword")} />
        </FieldContent>
        <AuthFieldError message={form.formState.errors.confirmNewPassword?.message} />
      </Field>
    </div>
  )
}

function SettingsPasswordRequirementsPanel({
  password,
  t,
}: {
  readonly password: string
  readonly t: ReturnType<typeof useTranslations<"pages.admin.settings">>
}): JSX.Element {
  const requirements = getPasswordRuleState(password)

  return (
    <div className="rounded-lg border border-border/40 bg-secondary/30 p-5">
      <h3 className="mb-4 text-xs font-medium text-foreground">{t("security.password.requirements.title")}</h3>
      <ul className="space-y-3 text-xs text-muted-foreground">
        <SettingsPasswordRequirement met={requirements.isMinLength} text={t("security.password.requirements.length")} />
        <SettingsPasswordRequirement met={requirements.hasUppercase} text={t("security.password.requirements.case")} />
        <SettingsPasswordRequirement met={requirements.hasSpecialChar} text={t("security.password.requirements.special")} />
      </ul>
    </div>
  )
}

function SettingsPasswordRequirement({ met, text }: { readonly met: boolean; readonly text: string }): JSX.Element {
  const Icon = met ? Check : X

  return (
    <li className="flex items-start gap-2.5">
      <Icon className={`mt-0.5 size-4 shrink-0 ${met ? "text-emerald-500" : "text-muted-foreground"}`} />
      <Label className="text-xs font-normal text-muted-foreground">{text}</Label>
    </li>
  )
}
