import type enMessages from "~/src/integrations/next-intl/en-US.d.json.ts"
import type { I18N } from "~/src/integrations/next-intl/i18n.config"

type AppMessages = typeof enMessages

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof I18N.LOCALES)[number]
  }

  interface IntlMessages extends AppMessages {
    readonly __appMessagesBrand?: never
  }
}

export type AuthValidationMessageKey = keyof AppMessages["auth"]["validations"]
export type CategoryValidationMessageKey = keyof AppMessages["category"]["validations"]
export type NewsletterSubscriberValidationMessageKey = keyof AppMessages["newsletter-subscriber"]["validations"]
export type ProductValidationMessageKey = keyof AppMessages["product"]["validations"]
export type SessionValidationMessageKey = keyof AppMessages["session"]["validations"]
export type UserValidationMessageKey = keyof AppMessages["user"]["validations"]
export type VerificationValidationMessageKey = keyof AppMessages["verification"]["validations"]
