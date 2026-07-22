import "server-only"

import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

import { env } from "~/src/platform/env"

import * as schema from "~/src/platform/db/schema"

const sql = neon(env.DATABASE_URL)
const db = drizzle(sql, { schema })

export { db }
