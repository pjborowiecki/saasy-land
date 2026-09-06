import { type JSX } from "react"

import { Loader2 } from "lucide-react"

import { Button } from "~/src/presentation/components/shadcn/button"

import {
  AUTH_INPUT_CLASS,
  AUTH_LABEL_CLASS,
  AUTH_PRIMARY_BUTTON_CLASS,
} from "~/src/presentation/components/custom/auth/constants/auth-styles"
import {
  type VerifyEmailStatus,
  useVerifyEmailPanel,
} from "~/src/presentation/components/custom/auth/verify-email/hooks/use-verify-email-panel"

const STATUS_COPY_CLASS = "text-body text-pretty text-muted-foreground"

interface VerifyEmailPanelProps {
  readonly email?: string
  readonly token?: string
}

const VerifyEmailVerifyingView = ({ label }: Readonly<{ label: string }>): JSX.Element => (
  <div className="flex items-center gap-3" data-testid="verify-email-verifying">
    <Loader2 aria-hidden="true" className="size-4 shrink-0 animate-spin text-ring" strokeWidth={1.5} />
    <p className={STATUS_COPY_CLASS}>{label}</p>
  </div>
)

const VerifyEmailSuccessView = ({
  continueLabel,
  onContinue,
  successLabel,
}: Readonly<{ continueLabel: string; onContinue: () => void; successLabel: string }>): JSX.Element => (
  <>
    <p className={STATUS_COPY_CLASS}>{successLabel}</p>
    <Button className={AUTH_PRIMARY_BUTTON_CLASS} onPress={onContinue} type="button">
      {continueLabel}
    </Button>
  </>
)

const VerifyEmailPendingView = ({ panel }: Readonly<{ panel: ReturnType<typeof useVerifyEmailPanel> }>): JSX.Element => (
  <div className="flex flex-col gap-6" data-testid="verify-email-pending">
    <p className={panel.status === "error" ? "text-body text-pretty text-destructive" : STATUS_COPY_CLASS}>
      {panel.t(panel.status === "error" ? "form.invalidToken" : "form.pendingDescription")}
    </p>

    <div className="flex flex-col gap-3">
      <Button className={AUTH_PRIMARY_BUTTON_CLASS} onPress={panel.handleBackToSignIn} type="button">
        {panel.t("form.backToSignIn")}
      </Button>

      {panel.showEmailInput ? (
        <label className="flex flex-col gap-2">
          <span className={AUTH_LABEL_CLASS}>{panel.t("form.email")}</span>
          <input
            autoComplete="email"
            className={AUTH_INPUT_CLASS}
            disabled={panel.isResending}
            onChange={panel.handleEmailChange}
            placeholder={panel.t("form.emailPlaceholder")}
            type="email"
            value={panel.resendEmail}
          />
        </label>
      ) : undefined}

      <Button
        className="min-h-11 self-center px-0 text-body-sm text-muted-foreground"
        data-testid="verify-email-resend-button"
        isDisabled={panel.isResending}
        onPress={panel.handleResendClick}
        type="button"
        variant="link"
      >
        {panel.isResending ? <Loader2 aria-hidden="true" className="size-4 animate-spin" strokeWidth={1.5} /> : undefined}
        {panel.t(panel.isResending ? "form.resending" : "form.resend")}
      </Button>
    </div>
  </div>
)

const renderPendingView = (panel: ReturnType<typeof useVerifyEmailPanel>): JSX.Element => <VerifyEmailPendingView panel={panel} />

const VERIFY_EMAIL_VIEWS: Record<VerifyEmailStatus, (panel: ReturnType<typeof useVerifyEmailPanel>) => JSX.Element> = {
  error: renderPendingView,
  pending: renderPendingView,
  success: (panel) => (
    <VerifyEmailSuccessView
      continueLabel={panel.t("form.continue")}
      onContinue={panel.handleContinue}
      successLabel={panel.t("form.success")}
    />
  ),
  verifying: (panel) => <VerifyEmailVerifyingView label={panel.t("form.verifying")} />,
}

export const VerifyEmailPanel = ({ email, token }: Readonly<VerifyEmailPanelProps>): JSX.Element => {
  const panel = useVerifyEmailPanel({ ...(email === undefined ? {} : { email }), ...(token === undefined ? {} : { token }) })
  return VERIFY_EMAIL_VIEWS[panel.status](panel)
}
