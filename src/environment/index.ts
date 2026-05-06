import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod/v4"

import { CONSTANTS } from "~/src/constants"

const env = createEnv({
  server: {
    AUTH_SECRET: z.string().min(64),
    DATABASE_URL: z.url(),
    CLOUDFLARE_EMAIL_SERVICE_URL: z.url(),
    CLOUDFLARE_API_TOKEN: z.string().min(32).startsWith("cfat_"),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.url().default(CONSTANTS.DEFAULT_APP_URL),
  },
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    CLOUDFLARE_EMAIL_SERVICE_URL: process.env.CLOUDFLARE_EMAIL_SERVICE_URL,
    CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
})

export { env }
