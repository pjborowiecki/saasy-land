import { createSchemaFactory } from "drizzle-zod"
import { z } from "zod/v4"

import { account } from "~/src/modules/account/account.schema"

const { createSelectSchema, createInsertSchema, createUpdateSchema } = createSchemaFactory({ zodInstance: z })

export const accountZodSchemas = {
  select: createSelectSchema(account),
  insert: createInsertSchema(account),
  update: createUpdateSchema(account),
}
