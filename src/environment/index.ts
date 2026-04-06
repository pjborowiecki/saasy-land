import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod/v4"

import { CONSTANTS } from "~/src/constants"

const env = createEnv({
  server: {
    AUTH_SECRET: z.string().min(64),
    DATABASE_URL: z.url(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.url().default(CONSTANTS.DEFAULT_APP_URL),
  },
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
})

export { env }
