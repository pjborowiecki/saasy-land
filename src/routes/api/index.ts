import { createFileRoute } from "@tanstack/react-router"

import { runtimeResponse } from "~/src/integrations/cloudflare/runtime"
export const Route = createFileRoute("/api/")({ server: { handlers: { GET: runtimeResponse } } })
