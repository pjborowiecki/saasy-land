import { createSchemaFactory } from "drizzle-zod"
import zod from "zod/v4"

import { BACKUP_CODE_MAX_LENGTH, BACKUP_CODE_MIN_LENGTH, TWO_FACTOR_CODE_LENGTH } from "~/src/integrations/better-auth/auth.constraints"
import { AUTH_VALIDATION_MESSAGE } from "~/src/integrations/better-auth/auth.validations"
import { signInPasswordSchema } from "~/src/integrations/better-auth/auth.zod"

import { twoFactor } from "~/src/modules/two-factor/two-factor.schema"

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({ zodInstance: zod })

const totpCodeField = zod
  .string()
  .min(TWO_FACTOR_CODE_LENGTH, { message: AUTH_VALIDATION_MESSAGE.twoFactorCodeRequired })
  .max(TWO_FACTOR_CODE_LENGTH, { message: AUTH_VALIDATION_MESSAGE.twoFactorCodeLength })

const backupCodeField = zod
  .string()
  .min(BACKUP_CODE_MIN_LENGTH, { message: AUTH_VALIDATION_MESSAGE.backupCodeRequired })
  .max(BACKUP_CODE_MAX_LENGTH, { message: AUTH_VALIDATION_MESSAGE.backupCodeMaxLength })

const passwordField = signInPasswordSchema

const disableTwoFactor = zod.object({
  password: passwordField,
})

const enableTwoFactor = zod.object({
  password: passwordField,
})

const verifyBackupCode = zod.object({
  code: backupCodeField,
  trustDevice: zod.boolean().optional(),
})

const verifyTotp = zod.object({
  code: totpCodeField,
  trustDevice: zod.boolean().optional(),
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
