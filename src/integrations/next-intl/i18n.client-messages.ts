/**
 * Message paths held back from the client provider.
 *
 * The root layout sits in every route's App Shell, so whatever it hands
 * `NextIntlClientProvider` ships with every prefetch. These subtrees are read only on the
 * server — via `getTranslations` in Server Components or `createTranslator` in email
 * templates — so they never need to cross the boundary. Entries are dotted message paths;
 * a top-level entry withholds the whole namespace.
 *
 * Exclusion (rather than an allowlist) keeps this safe by default: a new namespace is
 * shipped to the client unless someone deliberately adds it here. `scripts/check-i18n.ts`
 * fails the build if any Client Component reads a key under one of these.
 */
export const SERVER_ONLY_NAMESPACES = [
  "countries",
  "currencies",
  "emails",
  "locales",
  "pages.admin.analytics",
  "pages.admin.blog",
  "pages.admin.courses",
  "pages.admin.landing-page",
  "pages.admin.payments",
  "pages.admin.pricing-models",
  "pages.admin.products",
  "pages.app",
  "pages.blog",
  "pages.landing",
  "pages.legal",
  "pages.premium",
  "timezones",
] as const

export type ServerOnlyNamespace = (typeof SERVER_ONLY_NAMESPACES)[number]

function isMessageBranch(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

const LAST_SEGMENT_OFFSET = 1

function pruneMessagePath(tree: Record<string, unknown>, segments: readonly string[]): void {
  let node = tree

  for (const [index, segment] of segments.entries()) {
    if (index === segments.length - LAST_SEGMENT_OFFSET) {
      delete node[segment]
      return
    }

    const child = node[segment]

    if (!isMessageBranch(child)) {
      return
    }

    // Clone the branch before descending so the caller's tree is never mutated.
    const branch = { ...child }
    node[segment] = branch
    node = branch
  }
}

/**
 * Strip server-only message paths before the tree is serialized to the client.
 *
 * Generic over the input so it accepts the loose shape `getMessages()` returns while
 * still describing exactly which keys it removed. The result is a `DeepPartial` of the
 * full catalog, which is what `NextIntlClientProvider` accepts — client components keep
 * their key autocomplete from the global `IntlMessages` augmentation.
 */
export function toClientMessages<TMessages extends Record<string, unknown>>(messages: TMessages): Partial<TMessages> {
  const clientMessages: Partial<TMessages> = { ...messages }

  for (const namespace of SERVER_ONLY_NAMESPACES) {
    pruneMessagePath(clientMessages, namespace.split("."))
  }

  return clientMessages
}
