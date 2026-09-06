import type { SupportedLocale } from "~/src/integrations/use-intl/i18n.config"

import deMessages from "~/messages/de-DE/errors.global.json"
import enMessages from "~/messages/en-US/errors.global.json"
import esMessages from "~/messages/es-ES/errors.global.json"
import frMessages from "~/messages/fr-FR/errors.global.json"
import itMessages from "~/messages/it-IT/errors.global.json"
import jaMessages from "~/messages/ja-JP/errors.global.json"
import plMessages from "~/messages/pl-PL/errors.global.json"
import ptMessages from "~/messages/pt-BR/errors.global.json"
import ukMessages from "~/messages/uk-UA/errors.global.json"

// The root error boundary must work before the asynchronous message providers load.
const GLOBAL_ERROR_MESSAGES = {
  "de-DE": deMessages,
  "en-US": enMessages,
  "es-ES": esMessages,
  "fr-FR": frMessages,
  "it-IT": itMessages,
  "ja-JP": jaMessages,
  "pl-PL": plMessages,
  "pt-BR": ptMessages,
  "uk-UA": ukMessages,
} as const satisfies Record<SupportedLocale, unknown>

export const getGlobalErrorMessages = (locale: SupportedLocale) => GLOBAL_ERROR_MESSAGES[locale]
