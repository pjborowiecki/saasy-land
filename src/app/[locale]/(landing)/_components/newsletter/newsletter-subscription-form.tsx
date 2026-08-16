"use client"

import { type JSX, useCallback, useTransition } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useController, useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod/v4"

import { newsletterSubscriberZodSchemas } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.zod"
import { subscribeToNewsletter } from "~/src/modules/newsletter-subscriber/use-cases/subscribe-to-newsletter.use-case"

import { AUTH_VALIDATION_PARAMS } from "~/src/integrations/better-auth/auth.validations"

import { cn } from "~/src/utils"

import { useActionError } from "~/src/hooks/use-action-error"

import { Spinner } from "~/src/presentation/components/shadcn/spinner"

import { ValidationFieldError } from "~/src/presentation/components/custom/validation-field-error"

const INPUT_ID = "newsletter-email"
const ERROR_ID = "newsletter-email-error"

const emailSchema = newsletterSubscriberZodSchemas.subscribeToNewsletter.pick({ email: true })

type NewsletterFormValues = z.infer<typeof emailSchema>

export function NewsletterSubscriptionForm(): JSX.Element {
  const [isPending, startTransition] = useTransition()

  const locale = useLocale()
  const t = useTranslations("pages.newsletter.form")
  const actionError = useActionError()

  const form = useForm<NewsletterFormValues>({
    defaultValues: { email: "" },
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(emailSchema),
  })

  const { field, fieldState } = useController({ control: form.control, name: "email" })

  const onSubmit = useCallback(
    ({ email }: NewsletterFormValues) => {
      startTransition(async () => {
        const result = await subscribeToNewsletter({ email, locale })

        if (!result?.data) {
          toast.error(actionError(result) ?? t("error"))
          return
        }

        form.reset()
        toast.success(t(result.data.status))
      })
    },
    [actionError, form, locale, t],
  )

  const isLoading = form.formState.isSubmitting || isPending

  const message = fieldState.error?.message

  return (
    <form className="mt-6" noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <label className="sr-only" htmlFor={INPUT_ID}>
        {t("label")}
      </label>
      <div
        className={cn(
          "flex items-center gap-4 border-b transition-colors duration-200 ease-exp",
          message === undefined ? "border-border focus-within:border-foreground" : "border-destructive",
        )}
      >
        <input
          {...field}
          aria-describedby={ERROR_ID}
          aria-invalid={message !== undefined}
          autoComplete="email"
          className="h-11 w-full min-w-0 bg-transparent px-3 font-sans text-body-sm font-medium text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:opacity-50"
          disabled={isLoading}
          id={INPUT_ID}
          placeholder={t("placeholder")}
          type="email"
        />
        <button
          className="group flex h-11 shrink-0 items-center gap-2 font-sans text-body-sm font-semibold whitespace-nowrap text-foreground transition-[color,opacity] duration-200 ease-exp hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50"
          disabled={isLoading}
          type="submit"
        >
          {isLoading && <Spinner />}
          {isLoading ? t("submitting") : t("button")}
          {!isLoading && (
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-200 ease-exp group-hover:translate-x-0.5"
              strokeWidth={1.5}
            />
          )}
        </button>
      </div>
      <div className="mt-2 min-h-5 font-mono text-spec" id={ERROR_ID}>
        <ValidationFieldError message={message} namespace="auth.validations" paramsByKey={AUTH_VALIDATION_PARAMS} />
      </div>
    </form>
  )
}
