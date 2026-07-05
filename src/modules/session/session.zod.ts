import { createSchemaFactory } from "drizzle-zod"
import { z } from "zod/v4"

import { session } from "~/src/modules/session/session.schema"

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({ zodInstance: z })

export const sessionZodSchemas = {
  insert: createInsertSchema(session),
  select: createSelectSchema(session),
  update: createUpdateSchema(session),
}
