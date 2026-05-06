import { headers } from "next/headers"
import { cache } from "react"

import { auth } from "~/src/integrations/better-auth/auth.server"

export const getCurrentSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  })
})
