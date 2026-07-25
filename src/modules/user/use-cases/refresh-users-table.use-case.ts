"use server"

import { revalidatePath } from "next/cache"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import { authedActionClient } from "~/src/integrations/next-safe-action/action.client"

/** Revalidates the admin users page so RSC data (listUsers) reloads. */
export const refreshUsersTable = authedActionClient(PERMISSIONS.user.list).action(async () => {
  revalidatePath("/[locale]/admin/users", "page")
  await Promise.resolve()
})
