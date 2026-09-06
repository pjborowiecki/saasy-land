import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"

import { hasPermission } from "~/src/integrations/better-auth/auth.access"
import { auth } from "~/src/integrations/better-auth/auth.server"
import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"

import { AppError, ERROR_CODES } from "~/src/modules/_core/constants/errors"

export const getUser = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async ({ data: userId }) => {
    const session = await getCurrentSession()

    if (!session) {
      throw new AppError(ERROR_CODES.UNAUTHORIZED)
    }

    if (!hasPermission(session.user.role, { user: ["get"] })) {
      throw new AppError(ERROR_CODES.FORBIDDEN)
    }

    return auth.api.getUser({ headers: getRequest().headers, query: { id: userId } })
  })
