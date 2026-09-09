import { createFileRoute } from "@tanstack/react-router"

import { redirectAfterAuth } from "~/src/integrations/better-auth/auth.routes"

export const Route = createFileRoute("/auth/callback")({
  beforeLoad: redirectAfterAuth,
})
