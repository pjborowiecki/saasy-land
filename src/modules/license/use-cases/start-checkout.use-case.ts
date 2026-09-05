"use server"

import { licenseZodSchemas } from "~/src/modules/license/license.zod"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { actionClient, withAuth } from "~/src/integrations/next-safe-action/action.client"

export const startCheckout = actionClient
  .use(withAuth())
  .inputSchema(licenseZodSchemas.startCheckout)
  .outputSchema(licenseZodSchemas.checkoutSession)
  .action(async ({ ctx, parsedInput: { tier } }) => {
    const { url } = await auth.api.checkout({ body: { slug: tier }, headers: ctx.requestHeaders })

    return { url }
  })
