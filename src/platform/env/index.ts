import { createEnv } from "@t3-oss/env-nextjs"
import z from "zod/v4"

const MIN_STRING_LENGTH = 1
const AUTH_SECRET_MIN_LENGTH = 64

const env = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
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
    POLAR_ACCESS_TOKEN: process.env["POLAR_ACCESS_TOKEN"],
    POLAR_ORGANIZATION_ID: process.env["POLAR_ORGANIZATION_ID"],
    POLAR_PRODUCT_ID_COMPLETE: process.env["POLAR_PRODUCT_ID_COMPLETE"],
    POLAR_PRODUCT_ID_CORE: process.env["POLAR_PRODUCT_ID_CORE"],
    POLAR_SERVER: process.env["POLAR_SERVER"],
    POLAR_WEBHOOK_SECRET: process.env["POLAR_WEBHOOK_SECRET"],
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
    POLAR_ACCESS_TOKEN: z.string().min(MIN_STRING_LENGTH),
    POLAR_ORGANIZATION_ID: z.uuid(),
    POLAR_PRODUCT_ID_COMPLETE: z.uuid(),
    POLAR_PRODUCT_ID_CORE: z.uuid(),
    POLAR_SERVER: z.enum(["sandbox", "production"]).default("sandbox"),
    POLAR_WEBHOOK_SECRET: z.string().min(MIN_STRING_LENGTH),
    RESEND_API_KEY: z.string().min(MIN_STRING_LENGTH).startsWith("re_"),
    RESEND_EMAIL_FROM: z.email(),
  },
})

export { env }
