import { createSchemaFactory } from "drizzle-zod"
import { z } from "zod/v4"

import { user } from "~/src/modules/user/user.schema"

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({ zodInstance: z })

export const userZodSchemas = {
  select: createSelectSchema(user),
  insert: createInsertSchema(user),
  update: createUpdateSchema(user),
}
