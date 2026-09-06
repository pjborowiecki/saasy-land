import { render } from "react-email"
import { expect, it } from "vite-plus/test"

import { I18N } from "~/src/integrations/use-intl/i18n.config"

import { ChangeEmailConfirmationEmail } from "~/src/presentation/emails/change-email-confirmation.email-template"
import { ResetPasswordEmail } from "~/src/presentation/emails/reset-password.email-template"
import { VerifyEmail } from "~/src/presentation/emails/verify-email.email-template"

it.each(I18N.SUPPORTED_LOCALES)("renders account emails in %s with working action links", async (locale) => {
  const url = `https://saasyland.com/${locale}/auth/verify-email?token=example`
  const templates = [
    <ResetPasswordEmail key="reset" locale={locale} name="Alex" resetPasswordUrl={url} />,
    <VerifyEmail key="verify" locale={locale} name="Alex" verifyUrl={url} />,
    <ChangeEmailConfirmationEmail key="change" locale={locale} name="Alex" newEmail="alex@example.test" confirmUrl={url} />,
  ]
  for (const template of templates) {
    const html = await render(template)
    expect(html).toContain(`lang="${locale}"`)
    expect(html).toContain(`href="${url}"`)
    expect(html).toContain("Alex")
    expect(html).not.toContain("{name}")
    expect(html).not.toContain("{newEmail}")
  }
})
