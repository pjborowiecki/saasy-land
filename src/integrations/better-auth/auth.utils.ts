import "server-only"

import { headers } from "next/headers"
import { cache } from "react"

import { auth } from "~/src/integrations/better-auth/auth._server"

export const getCurrentSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  })
})
