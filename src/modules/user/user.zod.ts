import { createSchemaFactory } from "drizzle-zod"
import z from "zod/v4"

import { TIMEZONE_CODES } from "~/src/modules/_core/constants/timezone"
import { userIdField } from "~/src/modules/_core/utils/zod-fields"
import { user } from "~/src/modules/user/user.schema"
import { USER_VALIDATION_MESSAGE } from "~/src/modules/user/user.validations"

import { ROLE_VALUES } from "~/src/integrations/better-auth/auth.access"
import { emailSchema, nameSchema, strictPasswordSchema } from "~/src/integrations/better-auth/auth.zod"

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({ zodInstance: z })

const USER_IMAGE_MAX_LENGTH = 2048

const userIdInput = z.object({
  userId: userIdField,
})

const banUser = z.object({
  banExpiresIn: z.number().optional(),
  banReason: z.string().optional(),
  userId: userIdField,
})

const createUser = z.object({
  email: emailSchema,
  name: nameSchema,
  password: strictPasswordSchema.optional(),
  role: z.enum(ROLE_VALUES).optional(),
})

const deleteUser = userIdInput

const getUser = userIdInput

const impersonateUser = userIdInput

const setUserPassword = z.object({
  newPassword: strictPasswordSchema,
  userId: userIdField,
})

const setUserPasswordForm = z.object({
  newPassword: strictPasswordSchema,
})

const setUserRole = z.object({
  role: z.enum(ROLE_VALUES),
  userId: userIdField,
})

const unbanUser = userIdInput

const updateUser = z
  .object({
    image: z.string().max(USER_IMAGE_MAX_LENGTH).nullable().optional(),
    name: nameSchema.optional(),
    timezone: z.enum(TIMEZONE_CODES).optional(),
    userId: userIdField,
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
