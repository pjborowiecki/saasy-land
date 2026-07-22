import { createSchemaFactory } from "drizzle-zod"
import { z } from "zod/v4"

import { twoFactor } from "~/src/modules/two-factor/two-factor.schema"

import { BACKUP_CODE_MAX_LENGTH, BACKUP_CODE_MIN_LENGTH, TWO_FACTOR_CODE_LENGTH } from "~/src/integrations/better-auth/auth.constraints"
import { AUTH_VALIDATION_MESSAGE } from "~/src/integrations/better-auth/auth.validations"
import { signInPasswordSchema } from "~/src/integrations/better-auth/auth.zod"

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({ zodInstance: z })

const totpCodeField = z
  .string()
  .min(TWO_FACTOR_CODE_LENGTH, { message: AUTH_VALIDATION_MESSAGE.twoFactorCodeRequired })
  .max(TWO_FACTOR_CODE_LENGTH, { message: AUTH_VALIDATION_MESSAGE.twoFactorCodeLength })

const backupCodeField = z
  .string()
  .min(BACKUP_CODE_MIN_LENGTH, { message: AUTH_VALIDATION_MESSAGE.backupCodeRequired })
  .max(BACKUP_CODE_MAX_LENGTH, { message: AUTH_VALIDATION_MESSAGE.backupCodeMaxLength })

const passwordField = signInPasswordSchema

const disableTwoFactor = z.object({
  password: passwordField,
})

const enableTwoFactor = z.object({
  password: passwordField,
})

const verifyBackupCode = z.object({
  code: backupCodeField,
  trustDevice: z.boolean().optional(),
})

const verifyTotp = z.object({
  code: totpCodeField,
  trustDevice: z.boolean().optional(),
})

const insert = createInsertSchema(twoFactor)
const select = createSelectSchema(twoFactor)
const update = createUpdateSchema(twoFactor)

export const twoFactorZodSchemas = {
  disableTwoFactor,
  enableTwoFactor,
  insert,
  select,
  update,
  verifyBackupCode,
  verifyTotp,
}
