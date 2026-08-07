/**
 * Top-level namespaces held back from the client provider.
 *
 * The root layout sits in every route's App Shell, so whatever it hands
 * `NextIntlClientProvider` ships with every prefetch. These namespaces are large
 * reference catalogs read only on the server — via `getTranslations` in Server
 * Components or `createTranslator` in email templates — so they never need to cross
 * the boundary.
 *
 * Exclusion (rather than an allowlist) keeps this safe by default: a new namespace is
 * shipped to the client unless someone deliberately adds it here. `scripts/check-i18n.ts`
 * fails the build if any Client Component reads a key under one of these.
 */
export const SERVER_ONLY_NAMESPACES = ["countries", "currencies", "emails", "locales", "timezones"] as const

export type ServerOnlyNamespace = (typeof SERVER_ONLY_NAMESPACES)[number]

/**
 * Strip server-only namespaces before the message tree is serialized to the client.
 *
 * Generic over the input so it accepts the loose shape `getMessages()` returns while
 * still describing exactly which keys it removed. The result is a `DeepPartial` of the
 * full catalog, which is what `NextIntlClientProvider` accepts — client components keep
 * their key autocomplete from the global `IntlMessages` augmentation.
 */
export function toClientMessages<TMessages extends Record<string, unknown>>(messages: TMessages): Partial<TMessages> {
  const clientMessages: Partial<TMessages> = { ...messages }

  for (const namespace of SERVER_ONLY_NAMESPACES) {
    // The record constraint makes plain string keys valid, so the literal namespaces
    // delete without asserting anything about the concrete message tree.
    delete clientMessages[namespace]
  }

  return clientMessages
}
