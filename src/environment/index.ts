import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod/v4"

import { CONSTANTS } from "~/src/constants"

const MIN_STRING_LENGTH = 1
const AUTH_SECRET_MIN_LENGTH = 64

const env = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.url().default(CONSTANTS.DEFAULT_APP_URL),
  },
  runtimeEnv: {
    AUTH_SECRET: process.env["AUTH_SECRET"],
    DATABASE_URL: process.env["DATABASE_URL"],
    GITHUB_CLIENT_ID: process.env["GITHUB_CLIENT_ID"],
    GITHUB_CLIENT_SECRET: process.env["GITHUB_CLIENT_SECRET"],
    GOOGLE_CLIENT_ID: process.env["GOOGLE_CLIENT_ID"],
    GOOGLE_CLIENT_SECRET: process.env["GOOGLE_CLIENT_SECRET"],
    KV_REST_API_TOKEN: process.env["KV_REST_API_TOKEN"],
    KV_REST_API_URL: process.env["KV_REST_API_URL"],
    NEXT_PUBLIC_APP_URL: process.env["NEXT_PUBLIC_APP_URL"],
    RESEND_API_KEY: process.env["RESEND_API_KEY"],
    RESEND_EMAIL_FROM: process.env["RESEND_EMAIL_FROM"],
  },
  server: {
    AUTH_SECRET: z.string().min(AUTH_SECRET_MIN_LENGTH),
    DATABASE_URL: z.url(),
    GITHUB_CLIENT_ID: z.string().min(MIN_STRING_LENGTH),
    GITHUB_CLIENT_SECRET: z.string().min(MIN_STRING_LENGTH),
    GOOGLE_CLIENT_ID: z.string().min(MIN_STRING_LENGTH),
    GOOGLE_CLIENT_SECRET: z.string().min(MIN_STRING_LENGTH),
    KV_REST_API_TOKEN: z.string().min(MIN_STRING_LENGTH),
    KV_REST_API_URL: z.url(),
    RESEND_API_KEY: z.string().min(MIN_STRING_LENGTH).startsWith("re_"),
    RESEND_EMAIL_FROM: z.email(),
  },
})

export { env }
