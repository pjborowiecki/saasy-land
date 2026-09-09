import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import type * as zod from "zod"

import { authorized } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"
import { POLAR_PRODUCT_IDS } from "~/src/integrations/polar/polar.config"

import { LICENSE_MUTATION_KEYS } from "~/src/modules/license/license.constants"
import { pppDiscountId } from "~/src/modules/license/license.ppp"
import { licenseZodSchemas } from "~/src/modules/license/license.zod"

export const startCheckout = createServerFn({ method: "POST" })
  .middleware([authorized()])
  .validator((input: zod.input<typeof licenseZodSchemas.startCheckout>) => licenseZodSchemas.startCheckout.parse(input))
  .handler(async ({ context, data: { tier } }) => {
    const discountId = await pppDiscountId(context.requestHeaders, POLAR_PRODUCT_IDS[tier])
    const { url } = await auth.api.checkout({
      body: { allowDiscountCodes: false, slug: tier, ...(discountId === undefined ? {} : { discountId }) },
      headers: context.requestHeaders,
    })

    return { url }
  })

export const startCheckoutMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof startCheckout>[0]["data"]) => startCheckout({ data }),
  mutationKey: LICENSE_MUTATION_KEYS.START_CHECKOUT,
})
