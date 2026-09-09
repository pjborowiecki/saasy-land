import { type JSX } from "react"

import { useForm, useSelector } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useHydrated } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { useLocale, useTranslations } from "use-intl/react"

import { AUTH_VALIDATION_PARAMS } from "~/src/integrations/better-auth/auth.validations"
import { fieldErrorMessage } from "~/src/integrations/tanstack-form/form.fields"

import { NEWSLETTER_SUBSCRIBER_QUERY_KEYS } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.constants"
import { newsletterSubscriberZodSchemas } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.zod"
import { subscribeToNewsletterMutation } from "~/src/modules/newsletter-subscriber/use-cases/subscribe-to-newsletter"

import { useActionError } from "~/src/hooks/use-action-error"

import { cn } from "~/src/lib/cn"

import { Spinner } from "~/src/presentation/components/shadcn/spinner"

import { ValidationFieldError } from "~/src/presentation/components/custom/validation-field-error"

const INPUT_ID = "newsletter-email"
const ERROR_ID = "newsletter-email-error"

const emailSchema = newsletterSubscriberZodSchemas.subscribeToNewsletter.pick({ email: true })

export const NewsletterSubscriptionForm = (): JSX.Element => {
  const hydrated = useHydrated()
  const queryClient = useQueryClient()
  const subscribeToNewsletterRequest = useMutation({
    ...subscribeToNewsletterMutation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NEWSLETTER_SUBSCRIBER_QUERY_KEYS.ALL }),
  })

  const locale = useLocale()
  const t = useTranslations("pages.newsletter.form")
  const actionError = useActionError()

  const form = useForm({
    defaultValues: { email: "" },
    onSubmit: async ({ value }): Promise<void> => {
      try {
        const { email } = value
        const result = await subscribeToNewsletterRequest.mutateAsync({ email, locale })
        form.reset()
        toast.success(t(result.status))
      } catch (error) {
        toast.error(actionError(error))
      }
    },
    validators: { onChange: emailSchema, onSubmit: emailSchema },
  })
  const isPending = useSelector(form.store, (state) => state.isSubmitting)

  return (
    <form
      className="mt-6"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <form.Field name="email">
        {(field) => {
          const message = fieldErrorMessage(field.state.meta.errors)
          return (
            <>
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
                  readOnly={!hydrated}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    field.handleChange(event.target.value)
                  }}
                  aria-describedby={ERROR_ID}
                  aria-invalid={message !== undefined}
                  autoComplete="email"
                  className="h-11 w-full min-w-0 bg-transparent px-3 font-sans text-body-sm font-medium text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:opacity-50"
                  disabled={isPending}
                  id={INPUT_ID}
                  placeholder={t("placeholder")}
                  type="email"
                />
                <button
                  className="group flex h-11 shrink-0 items-center gap-2 font-sans text-body-sm font-semibold whitespace-nowrap text-foreground transition-[color,opacity] duration-200 ease-exp hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50"
                  disabled={isPending}
                  type="submit"
                >
                  {isPending && <Spinner />}
                  {isPending ? t("submitting") : t("button")}
                  {!isPending && (
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
            </>
          )
        }}
      </form.Field>
    </form>
  )
}
