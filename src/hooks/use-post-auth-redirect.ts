import { useCallback } from "react"

import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"

import { ROUTES } from "~/src/routes"

export const usePostAuthRedirect = (): (() => Promise<void>) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useCallback(async () => {
    queryClient.clear()
    router.clearCache()
    await router.navigate({ replace: true, to: ROUTES.AUTH_CALLBACK })
  }, [queryClient, router])
}
