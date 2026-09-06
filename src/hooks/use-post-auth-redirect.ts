import { useCallback } from "react"

import { useRouter } from "@tanstack/react-router"

import { hasPermission } from "~/src/integrations/better-auth/auth.access"
import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"

import { ROUTES } from "~/src/routes"

export const usePostAuthRedirect = (): (() => Promise<void>) => {
  const router = useRouter()

  return useCallback(async () => {
    const session = await getCurrentSession()
    const href = hasPermission(session?.user.role, { admin: ["access"] }) ? ROUTES.ADMIN : ROUTES.APP

    await router.navigate({ to: href })
  }, [router])
}
