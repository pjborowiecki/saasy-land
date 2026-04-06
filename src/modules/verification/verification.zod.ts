import { createSchemaFactory } from "drizzle-zod"
import { z } from "zod/v4"

import { verification } from "~/src/modules/verification/verification.schema"

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({ zodInstance: z })

export const verificationZodSchemas = {
  select: createSelectSchema(verification),
  insert: createInsertSchema(verification),
  update: createUpdateSchema(verification),
}
