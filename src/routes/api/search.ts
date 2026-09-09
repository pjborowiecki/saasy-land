import { createFileRoute } from "@tanstack/react-router"

import { fumadocsSearch } from "~/src/integrations/fumadocs/fumadocs.search"

export const Route = createFileRoute("/api/search")({ server: { handlers: { GET: ({ request }) => fumadocsSearch.GET(request) } } })
