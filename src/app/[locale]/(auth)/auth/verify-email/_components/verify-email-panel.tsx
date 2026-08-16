"use client"

import { type ChangeEvent, type JSX } from "react"

import { Loader2 } from "lucide-react"

import { Button } from "~/src/presentation/components/shadcn/button"

import {
  AUTH_INPUT_CLASS,
  AUTH_LABEL_CLASS,
  AUTH_PRIMARY_BUTTON_CLASS,
  AUTH_SECONDARY_BUTTON_CLASS,
} from "~/src/app/[locale]/(auth)/auth/_constants/auth-styles"
import { useVerifyEmailPanel, type VerifyEmailStatus } from "~/src/app/[locale]/(auth)/auth/verify-email/_lib/use-verify-email-panel"

const STATUS_COPY_CLASS = "text-body text-pretty text-muted-foreground"

interface VerifyEmailPanelProps {
  readonly email?: string
  readonly token?: string
}

function VerifyEmailVerifyingView({ label }: Readonly<{ label: string }>): JSX.Element {
  return (
    <div className="flex items-center gap-3" data-testid="verify-email-verifying">
      <Loader2 aria-hidden="true" className="size-4 shrink-0 animate-spin text-ring" strokeWidth={1.5} />
      <p className={STATUS_COPY_CLASS}>{label}</p>
    </div>
  )
}

function VerifyEmailSuccessView({
  continueLabel,
  onContinue,
  successLabel,
}: Readonly<{ continueLabel: string; onContinue: () => void; successLabel: string }>): JSX.Element {
  return (
    <>
      <p className={STATUS_COPY_CLASS}>{successLabel}</p>
      <Button className={AUTH_PRIMARY_BUTTON_CLASS} onPress={onContinue} type="button">
        {continueLabel}
      </Button>
    </>
  )
}

function VerifyEmailErrorView({
  invalidTokenLabel,
  onResend,
  resendLabel,
}: Readonly<{ invalidTokenLabel: string; onResend: () => void; resendLabel: string }>): JSX.Element {
  return (
    <>
      <p className="text-body text-pretty text-destructive">{invalidTokenLabel}</p>
      <Button className={AUTH_PRIMARY_BUTTON_CLASS} onPress={onResend} type="button">
        {resendLabel}
      </Button>
    </>
  )
}

function VerifyEmailPendingView({
  backToSignInLabel,
  email,
  emailLabel,
  emailPlaceholder,
  onBackToSignIn,
  onEmailChange,
  onResend,
  pendingDescription,
  resendLabel,
}: Readonly<{
  backToSignInLabel: string
  email: string
  emailLabel: string
  emailPlaceholder: string
  onBackToSignIn: () => void
  onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void
  onResend: () => void
  pendingDescription: string
  resendLabel: string
}>): JSX.Element {
  return (
    <div className="flex flex-col gap-6" data-testid="verify-email-pending">
      <p className={STATUS_COPY_CLASS}>{pendingDescription}</p>

      <label className="flex flex-col gap-2">
        <span className={AUTH_LABEL_CLASS}>{emailLabel}</span>
        <input className={AUTH_INPUT_CLASS} onChange={onEmailChange} placeholder={emailPlaceholder} type="email" value={email} />
      </label>

      <div className="flex flex-col gap-3">
        <Button className={AUTH_PRIMARY_BUTTON_CLASS} data-testid="verify-email-resend-button" onPress={onResend} type="button">
          {resendLabel}
        </Button>
        <Button className={AUTH_SECONDARY_BUTTON_CLASS} onPress={onBackToSignIn} type="button" variant="outline">
          {backToSignInLabel}
        </Button>
      </div>
    </div>
  )
}

const VERIFY_EMAIL_VIEWS: Record<VerifyEmailStatus, (panel: ReturnType<typeof useVerifyEmailPanel>) => JSX.Element> = {
  error: (panel) => (
    <VerifyEmailErrorView
      invalidTokenLabel={panel.t("form.invalidToken")}
      onResend={panel.handleResendClick}
      resendLabel={panel.t("form.resend")}
    />
  ),
  pending: (panel) => (
    <VerifyEmailPendingView
      backToSignInLabel={panel.t("form.backToSignIn")}
      email={panel.resendEmail}
      emailLabel={panel.t("form.email")}
      emailPlaceholder={panel.t("form.emailPlaceholder")}
      onBackToSignIn={panel.handleBackToSignIn}
      onEmailChange={panel.handleEmailChange}
      onResend={panel.handleResendClick}
      pendingDescription={panel.t("form.pendingDescription")}
      resendLabel={panel.t("form.resend")}
    />
  ),
  success: (panel) => (
    <VerifyEmailSuccessView
      continueLabel={panel.t("form.continue")}
      onContinue={panel.handleContinue}
      successLabel={panel.t("form.success")}
    />
  ),
  verifying: (panel) => <VerifyEmailVerifyingView label={panel.t("form.verifying")} />,
}

export function VerifyEmailPanel({ email, token }: Readonly<VerifyEmailPanelProps>): JSX.Element {
  const panel = useVerifyEmailPanel({ ...(email === undefined ? {} : { email }), ...(token === undefined ? {} : { token }) })
  return VERIFY_EMAIL_VIEWS[panel.status](panel)
}
