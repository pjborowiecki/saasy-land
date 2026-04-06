import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

import { env } from "~/src/environment"
import * as schema from "~/src/integrations/drizzle-orm/drizzle.schemas"

const sql = neon(env.DATABASE_URL)
const db = drizzle(sql, { schema })

export { db }
