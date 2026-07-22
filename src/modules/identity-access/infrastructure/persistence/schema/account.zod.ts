import { createSchemaFactory } from "drizzle-zod"
import { z } from "zod/v4"

import { account } from "~/src/modules/identity-access/infrastructure/persistence/schema/account.table"

const { createSelectSchema, createInsertSchema, createUpdateSchema } = createSchemaFactory({ zodInstance: z })

export const accountZodSchemas = {
  insert: createInsertSchema(account),
  select: createSelectSchema(account),
  update: createUpdateSchema(account),
}
