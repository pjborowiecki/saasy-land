"use server"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { actionClient, withAuth } from "~/src/integrations/next-safe-action/action.client"

export const settingsSignOutUser = actionClient.use(withAuth()).action(({ ctx }) => auth.api.signOut({ headers: ctx.requestHeaders }))
