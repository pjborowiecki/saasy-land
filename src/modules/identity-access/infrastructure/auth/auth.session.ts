import "server-only"

import { headers } from "next/headers"
import { cache } from "react"

import { auth } from "~/src/modules/identity-access/infrastructure/auth/auth._server"

export const getCurrentSession = cache(async () =>
  auth.api.getSession({
    headers: await headers(),
  }),
)
