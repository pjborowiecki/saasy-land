import "@tanstack/react-start/server-only"

import { env } from "cloudflare:workers"

import { drizzle } from "drizzle-orm/d1"

import * as schema from "~/src/integrations/drizzle-orm/drizzle.schemas"

export const db = drizzle(env.DB, { schema })
