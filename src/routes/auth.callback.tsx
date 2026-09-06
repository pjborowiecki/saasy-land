import { createFileRoute } from "@tanstack/react-router"

import { redirectAfterAuth } from "~/src/integrations/better-auth/auth.guards"

export const Route = createFileRoute("/auth/callback")({
  beforeLoad: redirectAfterAuth,
})
