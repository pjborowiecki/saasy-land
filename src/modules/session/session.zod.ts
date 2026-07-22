import { createSchemaFactory } from "drizzle-zod"
import { z } from "zod/v4"

import { MIN_FIELD_LENGTH, userIdField } from "~/src/modules/_core/utils/zod-fields"
import { session } from "~/src/modules/session/session.schema"
import { SESSION_VALIDATION_MESSAGE } from "~/src/modules/session/session.validations"

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({ zodInstance: z })

const tokenField = z.string().min(MIN_FIELD_LENGTH, { message: SESSION_VALIDATION_MESSAGE.tokenRequired })

const sessionTokenField = z.string().min(MIN_FIELD_LENGTH, { message: SESSION_VALIDATION_MESSAGE.tokenRequired })

const userIdInput = z.object({
  userId: userIdField,
})

const listUserSessions = userIdInput

const revokeSession = z.object({
  token: tokenField,
})

const revokeUserSession = z.object({
  sessionToken: sessionTokenField,
})

const revokeUserSessions = userIdInput

const insert = createInsertSchema(session)
const select = createSelectSchema(session)
const update = createUpdateSchema(session)

export const sessionZodSchemas = {
  insert,
  listUserSessions,
  revokeSession,
  revokeUserSession,
  revokeUserSessions,
  select,
  update,
}
