import { createSchemaFactory } from "drizzle-zod"
import z from "zod/v4"

import { license, licenseStatusEnum, licenseTierEnum } from "~/src/modules/license/license.schema"

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({ zodInstance: z })

const startCheckout = z.object({
  tier: z.enum(licenseTierEnum.enumValues),
})

const deactivateLicense = z.object({
  activationId: z.uuid(),
})

const deactivated = z.object({
  deactivated: z.boolean(),
})

const checkoutSession = z.object({
  url: z.url(),
})

const licenseSummary = z.object({
  key: z.string().nullable(),
  status: z.enum(licenseStatusEnum.enumValues),
  tier: z.enum(licenseTierEnum.enumValues),
})

const insert = createInsertSchema(license)
const select = createSelectSchema(license)
const update = createUpdateSchema(license)

export const licenseZodSchemas = {
  checkoutSession,
  deactivateLicense,
  deactivated,
  insert,
  licenseSummary,
  select,
  startCheckout,
  update,
}
