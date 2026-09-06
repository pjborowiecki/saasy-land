import { type ChangeEvent, useCallback, useEffect, useRef, useState } from "react"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { toast } from "sonner"
import { useLocale, useTranslations } from "use-intl/react"

import { localizePathname } from "~/src/integrations/use-intl/i18n.paths"

import { sendVerificationEmailMutation } from "~/src/modules/verification/use-cases/send-verification-email"
import { verifyEmailMutation } from "~/src/modules/verification/use-cases/verify-email"

import { useActionError } from "~/src/hooks/use-action-error"
import { usePostAuthRedirect } from "~/src/hooks/use-post-auth-redirect"

import { ROUTES } from "~/src/routes"

export type VerifyEmailStatus = "error" | "pending" | "success" | "verifying"

interface UseVerifyEmailPanelOptions {
  readonly email?: string
  readonly token?: string
}

interface UseVerifyEmailPanelResult {
  readonly handleBackToSignIn: () => void
  readonly handleContinue: () => void
  readonly handleEmailChange: (event: ChangeEvent<HTMLInputElement>) => void
  readonly handleResendClick: () => void
  readonly isResending: boolean
  readonly resendEmail: string
  readonly showEmailInput: boolean
  readonly status: VerifyEmailStatus
  readonly t: ReturnType<typeof useTranslations<"pages.auth.verify-email">>
}

export const useVerifyEmailPanel = ({ email, token }: Readonly<UseVerifyEmailPanelOptions>): UseVerifyEmailPanelResult => {
  const queryClient = useQueryClient()
  const verifyEmailRequest = useMutation({
    ...verifyEmailMutation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["session"] }),
  })
  const sendVerificationEmailRequest = useMutation({
    ...sendVerificationEmailMutation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["session"] }),
  })
  const router = useRouter()
  const t = useTranslations("pages.auth.verify-email")
  const locale = useLocale()
  const actionError = useActionError()
  const redirectAfterAuth = usePostAuthRedirect()
  const [status, setStatus] = useState<VerifyEmailStatus>(token === undefined ? "pending" : "verifying")
  const [resendEmail, setResendEmail] = useState(email ?? "")
  const hasVerifiedRef = useRef(false)
  const isResendingRef = useRef(false)

  useEffect(() => {
    if (token === undefined || hasVerifiedRef.current) {
      return
    }

    hasVerifiedRef.current = true
    setStatus("verifying")

    void (async () => {
      try {
        await verifyEmailRequest.mutateAsync({ token })
        setStatus("success")
        toast.success(t("form.success"))
        await redirectAfterAuth()
      } catch (error) {
        setStatus("error")
        toast.error(actionError(error))
      }
    })()
  }, [actionError, redirectAfterAuth, t, token])

  const handleResend = useCallback(async () => {
    if (isResendingRef.current) {
      return
    }

    try {
      const address = resendEmail.trim()
      if (address.length === 0) {
        toast.error(t("form.emailRequired"))
        return
      }
      isResendingRef.current = true
      const callbackURL = localizePathname({ locale, pathname: ROUTES.APP })
      await sendVerificationEmailRequest.mutateAsync({ callbackURL, email: address })
      toast.success(t("form.resendSuccess"))
    } catch (error) {
      toast.error(actionError(error))
    } finally {
      isResendingRef.current = false
    }
  }, [actionError, locale, resendEmail, t])

  const handleContinue = useCallback(() => {
    void redirectAfterAuth()
  }, [redirectAfterAuth])

  const handleResendClick = useCallback(() => {
    void handleResend()
  }, [handleResend])

  const handleEmailChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setResendEmail(event.currentTarget.value)
  }, [])

  const handleBackToSignIn = useCallback(() => {
    void router.navigate({ to: localizePathname({ locale, pathname: ROUTES.SIGN_IN }) })
  }, [locale, router])

  return {
    handleBackToSignIn,
    handleContinue,
    handleEmailChange,
    handleResendClick,
    isResending: sendVerificationEmailRequest.isPending,
    resendEmail,
    showEmailInput: email === undefined || email.trim().length === 0,
    status,
    t,
  }
}
