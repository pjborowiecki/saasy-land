import { type QueryClient, queryOptions } from "@tanstack/react-query"
import type { AbstractIntlMessages } from "use-intl"

import type { LocaleCode } from "~/src/modules/_core/constants/locale"

type MessageTree = Record<string, AbstractIntlMessages>

export type NamespaceEntry = readonly [namespace: string, messages: AbstractIntlMessages]

const MESSAGES_QUERY_KEYS = { ALL: ["i18n-messages"] } as const

const JSON_EXTENSION_LENGTH = ".json".length
const SLASH_LENGTH = 1
const NAMESPACE_LEAF_COUNT = 1

const messageModules = import.meta.glob<AbstractIntlMessages>(
  ["../../../messages/*/*.json", "!../../../messages/*/emails.json", "!../../../messages/*/emails.*.json"],
  { import: "default" },
)

const toNamespace = (path: string): string => path.slice(path.lastIndexOf("/") + SLASH_LENGTH, -JSON_EXTENSION_LENGTH)

const rootMessagePaths = Object.keys(
  import.meta.glob(["../../../messages/*/common.json", "../../../messages/*/components.*.json", "../../../messages/*/errors*.json"]),
)

export const ROOT_NAMESPACES = [...new Set(rootMessagePaths.map((path) => toNamespace(path)))]

const modulePath = ({ locale, namespace }: { locale: LocaleCode; namespace: string }): string =>
  `../../../messages/${locale}/${namespace}.json`

const missingNamespace = ({ locale, namespace }: { locale: LocaleCode; namespace: string }): Error =>
  new Error(`No messages/${locale}/${namespace}.json — every declared namespace needs a file per supported locale.`)

export const loadNamespace = ({ locale, namespace }: { locale: LocaleCode; namespace: string }): Promise<AbstractIntlMessages> => {
  const load = messageModules[modulePath({ locale, namespace })]

  if (load === undefined) {
    throw missingNamespace({ locale, namespace })
  }

  return load()
}

const isMessageTree = (value: AbstractIntlMessages | string | undefined): value is MessageTree => typeof value === "object"

const insertNamespace = ({ messages, namespace, tree }: { messages: AbstractIntlMessages; namespace: string; tree: MessageTree }): void => {
  const segments = namespace.split(".").slice(0, -NAMESPACE_LEAF_COUNT)
  const leaf = namespace.slice(namespace.lastIndexOf(".") + ".".length)

  let node = tree

  for (const segment of segments) {
    const existing = node[segment]
    const child = isMessageTree(existing) ? { ...existing } : {}

    node[segment] = child
    node = child
  }

  node[leaf] = { ...node[leaf], ...messages }
}

export const buildMessageTree = (entries: readonly NamespaceEntry[]): AbstractIntlMessages => {
  const tree: MessageTree = {}

  for (const [namespace, messages] of entries) {
    insertNamespace({ messages, namespace, tree })
  }

  return tree
}

export const messagesQueryOptions = ({ locale, namespace }: { locale: LocaleCode; namespace: string }) =>
  queryOptions({
    gcTime: Infinity,
    queryFn: () => loadNamespace({ locale, namespace }),
    queryKey: [...MESSAGES_QUERY_KEYS.ALL, locale, namespace],
    staleTime: Infinity,
  })

export const preloadNamespaces = async ({
  locale,
  namespaces,
  queryClient,
}: {
  locale: LocaleCode
  namespaces: readonly string[]
  queryClient: QueryClient
}): Promise<void> => {
  await Promise.all(
    namespaces.map((namespace) => queryClient.query({ ...messagesQueryOptions({ locale, namespace }), staleTime: "static" })),
  )
}
