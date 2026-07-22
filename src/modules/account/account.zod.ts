import { createSchemaFactory } from "drizzle-zod"
import { z } from "zod/v4"

import { MIN_FIELD_LENGTH } from "~/src/modules/_core/utils/zod-fields"
import { account } from "~/src/modules/account/account.schema"

import { AUTH_VALIDATION_MESSAGE } from "~/src/integrations/better-auth/auth.validations"
import { emailSchema, nameSchema, signInPasswordSchema, strictPasswordSchema } from "~/src/integrations/better-auth/auth.zod"

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({ zodInstance: z })

const changeEmail = z.object({
  newEmail: emailSchema,
})

const changePassword = z.object({
  currentPassword: signInPasswordSchema,
  newPassword: strictPasswordSchema,
  revokeOtherSessions: z.boolean().optional(),
})

const changePasswordForm = z
  .object({
    confirmNewPassword: z.string().min(MIN_FIELD_LENGTH, { message: AUTH_VALIDATION_MESSAGE.confirmPasswordRequired }),
    currentPassword: signInPasswordSchema,
    newPassword: strictPasswordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: AUTH_VALIDATION_MESSAGE.passwordsMustMatch,
    path: ["confirmNewPassword"],
  })

const updateUser = z.object({
  name: nameSchema,
})

const insert = createInsertSchema(account)
const select = createSelectSchema(account)
const update = createUpdateSchema(account)

export const accountZodSchemas = {
  changeEmail,
  changePassword,
  changePasswordForm,
  insert,
  select,
  update,
  updateUser,
}
