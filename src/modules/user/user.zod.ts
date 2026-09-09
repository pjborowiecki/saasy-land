import { createSchemaFactory } from "drizzle-zod"
import zod from "zod/v4"

import { ROLE_VALUES } from "~/src/integrations/better-auth/auth.access"
import { emailSchema, nameSchema, strictPasswordSchema } from "~/src/integrations/better-auth/auth.zod"

import { TIMEZONE_CODES } from "~/src/modules/_core/constants/timezone"
import { idField } from "~/src/modules/_core/utils/zod-fields"
import { user } from "~/src/modules/user/user.schema"
import { USER_VALIDATION_MESSAGE } from "~/src/modules/user/user.validations"

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({ zodInstance: zod })

const USER_IMAGE_MAX_LENGTH = 2048

const userIdInput = zod.object({
  userId: idField,
})

const banUser = zod.object({
  banExpiresIn: zod.number().optional(),
  banReason: zod.string().optional(),
  userId: idField,
})

const createUser = zod.object({
  email: emailSchema,
  name: nameSchema,
  password: strictPasswordSchema.optional(),
  role: zod.enum(ROLE_VALUES).optional(),
})

const deleteUser = userIdInput

const getUser = userIdInput

const impersonateUser = userIdInput

const setUserPassword = zod.object({
  newPassword: strictPasswordSchema,
  userId: idField,
})

const setUserPasswordForm = zod.object({
  newPassword: strictPasswordSchema,
})

const setUserRole = zod.object({
  role: zod.enum(ROLE_VALUES),
  userId: idField,
})

const unbanUser = userIdInput

const updateUser = zod
  .object({
    image: zod.string().max(USER_IMAGE_MAX_LENGTH).nullable().optional(),
    name: nameSchema.optional(),
    timezone: zod.enum(TIMEZONE_CODES).optional(),
    userId: idField,
  })
  .refine(({ userId: _userId, ...fields }) => Object.values(fields).some((val) => val !== undefined), {
    message: USER_VALIDATION_MESSAGE.atLeastOneFieldRequired,
  })

const insert = createInsertSchema(user)
const select = createSelectSchema(user)
const update = createUpdateSchema(user)

export const userZodSchemas = {
  banUser,
  createUser,
  deleteUser,
  getUser,
  impersonateUser,
  insert,
  select,
  setUserPassword,
  setUserPasswordForm,
  setUserRole,
  unbanUser,
  update,
  updateUser,
}
