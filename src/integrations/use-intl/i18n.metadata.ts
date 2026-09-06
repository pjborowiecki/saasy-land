import type { QueryClient } from "@tanstack/react-query"
import { type AbstractIntlMessages, createTranslator } from "use-intl"

import { loadNamespace, preloadNamespaces } from "~/src/integrations/use-intl/i18n.messages"
import { localeLinks, localizePathname } from "~/src/integrations/use-intl/i18n.paths"
import { getCurrentLocale } from "~/src/integrations/use-intl/i18n.utils"

import { APP_NAME, APP_URL } from "~/src/presentation/branding"

export const loadRouteMessages = async ({
  queryClient,
  namespaces,
  metadataNamespace,
  pathname,
}: {
  queryClient: QueryClient
  namespaces: readonly string[]
  metadataNamespace: string | undefined
  pathname: string
}) => {
  const locale = getCurrentLocale()
  await preloadNamespaces({ locale, namespaces, queryClient })
  let title: string = APP_NAME
  let description = ""
  if (metadataNamespace !== undefined && metadataNamespace.length > 0) {
    const namespace =
      namespaces
        .toSorted((first, second) => second.length - first.length)
        .find((entry) => metadataNamespace === entry || metadataNamespace.startsWith(`${entry}.`)) ?? metadataNamespace
    let messages: AbstractIntlMessages = await loadNamespace({ locale, namespace })
    for (const part of metadataNamespace.slice(namespace.length).split(".").filter(Boolean)) {
      const child = messages[part]
      if (typeof child === "object") {
        messages = child
      }
    }
    const { metadata } = messages
    if (typeof metadata === "object") {
      messages = metadata
    }
    const t = createTranslator<{ title: string; description: string }>({
      locale,
      messages: {
        description: typeof messages["description"] === "string" ? messages["description"] : "",
        title: typeof messages["title"] === "string" ? messages["title"] : APP_NAME,
      },
    })
    title = t("title", { name: APP_NAME })
    description = t("description", { name: APP_NAME })
  }
  return { metadata: { description, locale, pathname, title } }
}

export const routeHead = ({ loaderData }: { loaderData?: Awaited<ReturnType<typeof loadRouteMessages>> | undefined }) => {
  if (!loaderData) {
    return {}
  }
  const { title, description, locale, pathname } = loaderData.metadata
  return {
    links: localeLinks({ origin: APP_URL, pathname: localizePathname({ locale, pathname }) }),
    meta: [
      { title: title === APP_NAME || title.endsWith(`| ${APP_NAME}`) ? title : `${title} | ${APP_NAME}` },
      { content: description, name: "description" },
    ],
  }
}
