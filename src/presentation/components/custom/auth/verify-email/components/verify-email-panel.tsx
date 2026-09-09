import { useMutation } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useLocale, useTranslations } from "use-intl/react"

import { localizePathname } from "~/src/integrations/use-intl/i18n.paths"

import { sendVerificationEmailMutation } from "~/src/modules/verification/use-cases/send-verification-email"

import { useActionError } from "~/src/hooks/use-action-error"

import { cn } from "~/src/lib/cn"

import { Button, buttonVariants } from "~/src/presentation/components/shadcn/button"

import {
  AUTH_INPUT_CLASS,
  AUTH_LABEL_CLASS,
  AUTH_PRIMARY_BUTTON_CLASS,
} from "~/src/presentation/components/custom/auth/constants/auth-styles"

import { ROUTES } from "~/src/routes"

export const VerifyEmailPanel = ({ email = "", invalid = false }: { readonly email?: string; readonly invalid?: boolean }) => {
  const locale = useLocale()
  const t = useTranslations("pages.auth.verify-email")
  const actionError = useActionError()
  const resend = useMutation({
    ...sendVerificationEmailMutation,
    onError: (error) => toast.error(actionError(error)),
    onSuccess: () => toast.success(t("form.resendSuccess")),
  })

  return (
    <div className="flex flex-col gap-6" data-testid="verify-email-pending">
      <p className={cn("text-body text-pretty", invalid ? "text-destructive" : "text-muted-foreground")}>
        {t(invalid ? "form.invalidToken" : "form.pendingDescription")}
      </p>

      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          if (resend.isPending) {
            return
          }
          const address = new FormData(event.currentTarget).get("email")
          if (typeof address !== "string" || address.trim().length === 0) {
            toast.error(t("form.emailRequired"))
            return
          }
          resend.mutate({ callbackURL: localizePathname({ locale, pathname: ROUTES.AUTH_CALLBACK }), email: address.trim() })
        }}
      >
        <Link className={cn(buttonVariants(), AUTH_PRIMARY_BUTTON_CLASS)} to={localizePathname({ locale, pathname: ROUTES.SIGN_IN })}>
          {t("form.backToSignIn")}
        </Link>

        {email.trim().length > 0 ? (
          <input name="email" type="hidden" value={email} />
        ) : (
          <label className="flex flex-col gap-2">
            <span className={AUTH_LABEL_CLASS}>{t("form.email")}</span>
            <input
              autoComplete="email"
              className={AUTH_INPUT_CLASS}
              disabled={resend.isPending}
              name="email"
              placeholder={t("form.emailPlaceholder")}
              type="email"
            />
          </label>
        )}

        <Button
          className="min-h-11 self-center px-0 text-body-sm text-muted-foreground"
          data-testid="verify-email-resend-button"
          isDisabled={resend.isPending}
          type="submit"
          variant="link"
        >
          {resend.isPending ? <Loader2 aria-hidden="true" className="size-4 animate-spin" strokeWidth={1.5} /> : undefined}
          {t(resend.isPending ? "form.resending" : "form.resend")}
        </Button>
      </form>
    </div>
  )
}
