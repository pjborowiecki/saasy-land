// Generate runtime binding types with `bun run cf-typegen`.
declare namespace Cloudflare {
  interface Env {
    DB: D1Database
    CACHE: KVNamespace
    ASSETS: Fetcher
    AUTH_SECRET: string
    AUTH_GITHUB_CLIENT_ID: string
    AUTH_GITHUB_CLIENT_SECRET: string
    AUTH_GOOGLE_CLIENT_ID: string
    AUTH_GOOGLE_CLIENT_SECRET: string
    RESEND_API_KEY: string
    RESEND_EMAIL_FROM: string
    POLAR_ACCESS_TOKEN: string
    POLAR_ORGANIZATION_ID: string
    POLAR_PRODUCT_ID_COMPLETE: string
    POLAR_PRODUCT_ID_AGENCY: string
    POLAR_PRODUCT_ID_CORE: string
    POLAR_SERVER: "sandbox" | "production"
    POLAR_WEBHOOK_SECRET: string
  }
}
