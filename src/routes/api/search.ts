import { createFileRoute } from "@tanstack/react-router"

import { fumadocsSearchGet } from "~/src/integrations/fumadocs/fumadocs.search"

export const Route = createFileRoute("/api/search")({ server: { handlers: { GET: ({ request }) => fumadocsSearchGet(request) } } })
