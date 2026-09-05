import { createSchemaFactory } from "drizzle-zod"
import z from "zod/v4"

import { MIN_FIELD_LENGTH } from "~/src/modules/_core/utils/zod-fields"
import { verification } from "~/src/modules/verification/verification.schema"
import { VERIFICATION_VALIDATION_MESSAGE } from "~/src/modules/verification/verification.validations"

import { AUTH_VALIDATION_MESSAGE } from "~/src/integrations/better-auth/auth.validations"
import { emailSchema, strictPasswordSchema, withMatchingPasswords } from "~/src/integrations/better-auth/auth.zod"

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({ zodInstance: z })

const forgotPassword = z.object({
  email: emailSchema,
})

const resetPasswordForm = withMatchingPasswords(
  z.object({
    confirmPassword: z.string().min(MIN_FIELD_LENGTH, { message: AUTH_VALIDATION_MESSAGE.confirmPasswordRequired }),
    password: strictPasswordSchema,
  }),
)

const tokenField = z.string().min(MIN_FIELD_LENGTH, { message: VERIFICATION_VALIDATION_MESSAGE.tokenRequired })

const redirectToField = z.string().min(MIN_FIELD_LENGTH, { message: VERIFICATION_VALIDATION_MESSAGE.redirectToRequired })

const requestPasswordReset = forgotPassword.extend({
  redirectTo: redirectToField,
})

const resetPassword = resetPasswordForm.extend({
  token: tokenField,
})

const sendVerificationEmail = z.object({
  callbackURL: redirectToField,
  email: emailSchema,
})

const verifyEmail = z.object({
  token: tokenField,
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
  verifyEmail,
}
