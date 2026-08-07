import { locale as rootLocaleParam } from "next/root-params"

import { hasLocale } from "next-intl"

import type { Locale } from "~/src/integrations/next-intl/i18n.config"
import { routing } from "~/src/integrations/next-intl/i18n.routing"

/**
 * Root params are unavailable in Server Actions, Route Handlers and `unstable_cache`,
 * where the getter throws instead of resolving. Callers that may run in those contexts
 * use this to fall back rather than crash.
 */
export async function tryRootLocale(): Promise<Locale | undefined> {
  try {
    const value = await rootLocaleParam()
    return hasLocale(routing.locales, value) ? value : undefined
  } catch {
    return undefined
  }
}

/**
 * Current locale from the `[locale]` root segment, narrowed to the app's locale union.
 *
 * Prefer this over `await params` in Server Components: root params keep the shared
 * App Shell intact, while a `params` read ties it to a single URL.
 */
export async function getRootLocale(): Promise<Locale> {
  return (await tryRootLocale()) ?? routing.defaultLocale
}
