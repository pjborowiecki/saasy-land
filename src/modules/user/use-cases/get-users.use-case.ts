import "server-only"

import { cacheLife, cacheTag } from "next/cache"
import { forbidden, unauthorized } from "next/navigation"

import { desc } from "drizzle-orm"

import { db } from "~/src/platform/db/client"

import { ADMIN_USERS_CACHE_TAG } from "~/src/modules/user/user.constants"
import { user } from "~/src/modules/user/user.schema"

import { hasPermission } from "~/src/integrations/better-auth/auth.access"
import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"

async function loadUsers() {
  "use cache"

  cacheTag(ADMIN_USERS_CACHE_TAG)
  cacheLife("minutes")

  const rows = await db.select().from(user).orderBy(desc(user.createdAt))
  return rows
}

export async function getUsers() {
  const session = await getCurrentSession()

  if (!session) {
    unauthorized()
  }

  if (!hasPermission(session.user.role, { user: ["list"] })) {
    forbidden()
  }

  return loadUsers()
}
