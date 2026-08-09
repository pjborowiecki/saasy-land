"use server"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { actionClient, withAuth } from "~/src/integrations/next-safe-action/action.client"

export const stopImpersonatingUser = actionClient
  .use(withAuth())
  .action(({ ctx }) => auth.api.stopImpersonating({ headers: ctx.requestHeaders }))
