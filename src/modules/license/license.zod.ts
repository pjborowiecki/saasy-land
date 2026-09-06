import { createSchemaFactory } from "drizzle-zod"
import zod from "zod/v4"

import { license, licenseStatusEnum, licenseTierEnum } from "~/src/modules/license/license.schema"

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({ zodInstance: zod })

const startCheckout = zod.object({
  tier: zod.enum(licenseTierEnum.enumValues),
})

const deactivateLicense = zod.object({
  activationId: zod.uuid(),
})

const deactivated = zod.object({
  deactivated: zod.boolean(),
})

const checkoutSession = zod.object({
  url: zod.url(),
})

const licenseSummary = zod.object({
  key: zod.string().nullable(),
  status: zod.enum(licenseStatusEnum.enumValues),
  tier: zod.enum(licenseTierEnum.enumValues),
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
