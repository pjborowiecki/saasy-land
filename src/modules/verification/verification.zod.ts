import { createSchemaFactory } from "drizzle-zod"
import zod from "zod/v4"

import { AUTH_VALIDATION_MESSAGE } from "~/src/integrations/better-auth/auth.validations"
import { emailSchema, strictPasswordSchema, withMatchingPasswords } from "~/src/integrations/better-auth/auth.zod"

import { MIN_FIELD_LENGTH } from "~/src/modules/_core/utils/zod-fields"
import { verification } from "~/src/modules/verification/verification.schema"
import { VERIFICATION_VALIDATION_MESSAGE } from "~/src/modules/verification/verification.validations"

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({ zodInstance: zod })

const forgotPassword = zod.object({
  email: emailSchema,
})

const resetPasswordForm = withMatchingPasswords(
  zod.object({
    confirmPassword: zod.string().min(MIN_FIELD_LENGTH, { message: AUTH_VALIDATION_MESSAGE.confirmPasswordRequired }),
    password: strictPasswordSchema,
  }),
)

const tokenField = zod.string().min(MIN_FIELD_LENGTH, { message: VERIFICATION_VALIDATION_MESSAGE.tokenRequired })

const redirectToField = zod.string().min(MIN_FIELD_LENGTH, { message: VERIFICATION_VALIDATION_MESSAGE.redirectToRequired })

const requestPasswordReset = forgotPassword.extend({
  redirectTo: redirectToField,
})

const resetPassword = resetPasswordForm.extend({
  token: tokenField,
})

const sendVerificationEmail = zod.object({
  callbackURL: redirectToField,
  email: emailSchema,
})

const insert = createInsertSchema(verification)
const select = createSelectSchema(verification)
const update = createUpdateSchema(verification)

export const verificationZodSchemas = {
  forgotPassword,
  insert,
  requestPasswordReset,
  resetPassword,
  resetPasswordForm,
  select,
  sendVerificationEmail,
  update,
}
