import { z } from "zod/v4"

import { emailSchema } from "~/src/integrations/better-auth/auth.zod"
import { I18N } from "~/src/integrations/next-intl/i18n.config"

/**
 * The locale travels with the address because the confirmation is sent from a Server
 * Action, and root params are unavailable there: read on the server it would always
 * resolve to `en-US` and a Polish visitor would get an English reply.
 */
const subscribeToBuildLog = z.object({
  email: emailSchema,
  locale: z.enum(I18N.LOCALES),
})

export const newsletterZodSchemas = {
  subscribeToBuildLog,
}
