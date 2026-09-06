import { adminClient, inferAdditionalFields, multiSessionClient, twoFactorClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

import { ROLES, ac } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import { redirectPathname } from "~/src/integrations/use-intl/i18n.locale"

import { ROUTES } from "~/src/routes"

export const authClient = createAuthClient({
  plugins: [
    adminClient({ ac, roles: ROLES }),
    inferAdditionalFields<typeof auth>(),
    multiSessionClient(),
    twoFactorClient({
      onTwoFactorRedirect() {
        globalThis.location.href = redirectPathname(globalThis.location.pathname, ROUTES.TWO_FACTOR)
      },
    }),
  ],
})

export const { getSession, requestPasswordReset, resetPassword, sendVerificationEmail, signIn, signOut, signUp, useSession, verifyEmail } =
  authClient

export const { twoFactor } = authClient
