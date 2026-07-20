"use client"

import { type ChangeEvent, type JSX } from "react"

import { Loader2 } from "lucide-react"

import { Button } from "~/src/components/shadcn/button"

import { useVerifyEmailPanel, type VerifyEmailStatus } from "~/src/app/[locale]/(auth)/auth/verify-email/_components/use-verify-email-panel"

interface VerifyEmailPanelProps {
  readonly email?: string
  readonly token?: string
}

function VerifyEmailVerifyingView({ label }: Readonly<{ label: string }>): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center" data-testid="verify-email-verifying">
      <Loader2 aria-hidden="true" className="size-8 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

function VerifyEmailSuccessView({
  continueLabel,
  onContinue,
  successLabel,
}: Readonly<{ continueLabel: string; onContinue: () => void; successLabel: string }>): JSX.Element {
  return (
    <div className="flex flex-col gap-4 text-center">
      <p className="text-sm text-muted-foreground">{successLabel}</p>
      <Button className="h-11 bg-foreground text-background hover:bg-foreground/80" onPress={onContinue} type="button">
        {continueLabel}
      </Button>
    </div>
  )
}

function VerifyEmailErrorView({
  invalidTokenLabel,
  onResend,
  resendLabel,
}: Readonly<{ invalidTokenLabel: string; onResend: () => void; resendLabel: string }>): JSX.Element {
  return (
    <div className="flex flex-col gap-4 text-center">
      <p className="text-sm text-muted-foreground">{invalidTokenLabel}</p>
      <Button className="h-11 bg-foreground text-background hover:bg-foreground/80" onPress={onResend} type="button">
        {resendLabel}
      </Button>
    </div>
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
      <p className="text-center text-sm text-muted-foreground">{pendingDescription}</p>

      <label className="flex flex-col gap-2 text-sm">
        <span className="text-muted-foreground">{emailLabel}</span>
        <input
          className="h-11 rounded-xl border border-white/10 bg-transparent px-4 text-sm text-foreground shadow-inner outline-none focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/50"
          onChange={onEmailChange}
          placeholder={emailPlaceholder}
          type="email"
          value={email}
        />
      </label>

      <Button
        className="h-11 bg-foreground text-background hover:bg-foreground/80"
        data-testid="verify-email-resend-button"
        onPress={onResend}
        type="button"
      >
        {resendLabel}
      </Button>

      <Button className="h-11" onPress={onBackToSignIn} type="button" variant="outline">
        {backToSignInLabel}
      </Button>
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
