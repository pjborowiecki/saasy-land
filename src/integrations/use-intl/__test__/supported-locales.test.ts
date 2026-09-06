import { getRequest } from "@tanstack/react-start/server"
import { expect, it, vi } from "vite-plus/test"

import { I18N } from "~/src/integrations/use-intl/i18n.config"
import { getEmailMessages } from "~/src/integrations/use-intl/i18n.emails"
import { getGlobalErrorMessages } from "~/src/integrations/use-intl/i18n.errors"
import { handleLocaleMiddleware } from "~/src/integrations/use-intl/i18n.middleware"
import { canonicalizePathname, localizePathname } from "~/src/integrations/use-intl/i18n.paths"
import { getCurrentLocale } from "~/src/integrations/use-intl/i18n.utils"

it.each(I18N.SUPPORTED_LOCALES)("uses %s consistently for documents, aliases, and server functions", (locale) => {
  const path = localizePathname({ locale, pathname: "/refunds" })
  const alias = `/${locale.split("-")[0]}/refunds`
  expect(canonicalizePathname(alias)).toBe(path)
  expect(handleLocaleMiddleware(new Request(`https://saasyland.com${alias}`)).redirect?.headers.get("location")).toBe(
    `https://saasyland.com${path}`,
  )
  vi.mocked(getRequest).mockReturnValue(new Request(`https://saasyland.com${path}`))
  expect(getCurrentLocale()).toBe(locale)
  vi.mocked(getRequest).mockReturnValue(
    new Request("https://saasyland.com/_serverFn/example", { headers: { cookie: `${I18N.COOKIE_NAME}=${locale}` } }),
  )
  expect(getCurrentLocale()).toBe(locale)
  expect(getGlobalErrorMessages(locale).title.length).toBeGreaterThan(0)
  const messages = getEmailMessages(locale)
  expect(messages.emails.resetPassword.body).toContain("{name}")
  expect(messages.emails.changeEmailConfirmation.body).toContain("{newEmail}")
  if (locale !== I18N.DEFAULT_LOCALE) {
    expect(messages.emails.resetPassword.subject).not.toBe(getEmailMessages(I18N.DEFAULT_LOCALE).emails.resetPassword.subject)
  }
})
