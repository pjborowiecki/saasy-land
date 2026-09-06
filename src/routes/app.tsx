import type { JSX } from "react"

import { Outlet, createFileRoute } from "@tanstack/react-router"

import { requireSession } from "~/src/integrations/better-auth/auth.guards"
import { getCurrentSessionQuery } from "~/src/integrations/better-auth/auth.session"

const AppLayout = (): JSX.Element => (
  <div>
    <Outlet />
  </div>
)

export const Route = createFileRoute("/app")({
  beforeLoad: async ({ context }) => {
    const result = await requireSession()
    context.queryClient.setQueryData(getCurrentSessionQuery.queryKey, result.session)
    return result
  },
  component: AppLayout,
  staticData: { namespaces: [] },
})
