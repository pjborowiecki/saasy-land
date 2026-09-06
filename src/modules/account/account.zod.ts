import { createSchemaFactory } from "drizzle-zod"
import zod from "zod/v4"

import { AUTH_VALIDATION_MESSAGE } from "~/src/integrations/better-auth/auth.validations"
import { emailSchema, nameSchema, signInPasswordSchema, strictPasswordSchema } from "~/src/integrations/better-auth/auth.zod"

import { MIN_FIELD_LENGTH } from "~/src/modules/_core/utils/zod-fields"
import { account } from "~/src/modules/account/account.schema"

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({ zodInstance: zod })

const changeEmail = zod.object({
  newEmail: emailSchema,
})

const changePassword = zod.object({
  currentPassword: signInPasswordSchema,
  newPassword: strictPasswordSchema,
  revokeOtherSessions: zod.boolean().optional(),
})

const changePasswordForm = zod
  .object({
    confirmNewPassword: zod.string().min(MIN_FIELD_LENGTH, { message: AUTH_VALIDATION_MESSAGE.confirmPasswordRequired }),
    currentPassword: signInPasswordSchema,
    newPassword: strictPasswordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: AUTH_VALIDATION_MESSAGE.passwordsMustMatch,
    path: ["confirmNewPassword"],
  })

const updateUser = zod.object({
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
