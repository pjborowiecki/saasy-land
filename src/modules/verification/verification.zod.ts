import { createSchemaFactory } from "drizzle-zod"
import { z } from "zod/v4"

import { verification } from "~/src/modules/verification/verification.schema"

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({ zodInstance: z })

export const verificationZodSchemas = {
  insert: createInsertSchema(verification),
  select: createSelectSchema(verification),
  update: createUpdateSchema(verification),
}
