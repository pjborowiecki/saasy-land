import { createFileRoute } from "@tanstack/react-router"

import { docsLoader, loadDocsPage } from "~/src/integrations/fumadocs/fumadocs.docs"
import { routeHead } from "~/src/integrations/use-intl/i18n.metadata"
import { getCurrentLocale } from "~/src/integrations/use-intl/i18n.utils"

const DocumentationPage = () => {
  const page = Route.useLoaderData()
  return docsLoader.useContent(page.path, { path: page.path })
}

export const Route = createFileRoute("/docs/")({
  component: DocumentationPage,
  head: routeHead,
  loader: async () => {
    const page = await loadDocsPage()
    return { ...page, metadata: { description: page.description, locale: getCurrentLocale(), pathname: page.pathname, title: page.title } }
  },
})
