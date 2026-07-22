"use server"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { authedActionClient } from "~/src/integrations/next-safe-action/action.client"

export const stopImpersonatingUser = authedActionClient().action(({ ctx }) => auth.api.stopImpersonating({ headers: ctx.requestHeaders }))
