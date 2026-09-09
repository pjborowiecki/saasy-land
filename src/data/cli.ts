// Labels are translated; executable flags and generated directory names remain unchanged.
export const SCAFFOLD_DIR = "my-app"

export const SCAFFOLD_TARGET = `saasyland@latest init ${SCAFFOLD_DIR}`

export const PACKAGE_MANAGERS = [
  { dev: "bun dev", exec: "bunx", id: "bun" },
  { dev: "npm run dev", exec: "npx", id: "npm" },
  { dev: "pnpm dev", exec: "pnpm dlx", id: "pnpm" },
  { dev: "yarn dev", exec: "yarn dlx", id: "yarn" },
] as const

export const CLI_GROUPS = ["platform", "data", "product", "extras"] as const

export const CLI_CHOICES = [
  {
    group: "platform",
    id: "framework",
    options: [
      { flag: "--framework tanstack", id: "tanstack" },
      { flag: "--framework next", id: "next" },
      { flag: "--framework react-router", id: "react-router" },
    ],
  },
  {
    group: "platform",

    id: "architecture",
    options: [
      { flag: "--arch monolith", id: "monolith" },
      { flag: "--arch split", id: "split" },
      { flag: "--arch microservices", id: "microservices" },
    ],
  },
  {
    group: "platform",

    id: "deployment",
    options: [
      { flag: "--deploy cloudflare", id: "cloudflare" },
      { flag: "--deploy vercel", id: "vercel" },
      { flag: "--deploy self", id: "self" },
    ],
  },
  {
    group: "platform",

    id: "api",
    options: [
      { flag: "--api hono", id: "hono", visibleWhen: { architecture: ["split", "microservices"] } },
      {
        flag: "--api elysia",
        id: "elysia",
        unavailableWhen: { deployment: ["cloudflare"] },
        visibleWhen: { architecture: ["split", "microservices"] },
      },
    ],
  },
  {
    group: "platform",

    id: "runtime",
    options: [
      { flag: "--runtime node", id: "node" },
      { flag: "--runtime bun", id: "bun", unavailableWhen: { deployment: ["cloudflare"] } },
    ],
  },
  {
    group: "data",

    id: "database",
    options: [
      { flag: "--db sqlite", id: "sqlite", unavailableWhen: { deployment: ["vercel"] } },
      { flag: "--db postgres", id: "postgres" },
    ],
  },
  {
    group: "data",

    id: "provider",
    options: [
      { flag: "--provider neon", id: "neon", visibleWhen: { database: ["postgres"] } },
      { flag: "--provider supabase", id: "supabase", visibleWhen: { database: ["postgres"] } },
      { flag: "--provider self", id: "self-postgres", visibleWhen: { database: ["postgres"] } },
      {
        flag: "--provider d1",
        id: "d1",
        unavailableWhen: { deployment: ["self"] },
        visibleWhen: { database: ["sqlite"] },
      },
      { flag: "--provider turso", id: "turso", visibleWhen: { database: ["sqlite"] } },
      {
        flag: "--provider file",
        id: "file",
        unavailableWhen: { deployment: ["cloudflare"] },
        visibleWhen: { database: ["sqlite"] },
      },
    ],
  },
  {
    group: "data",
    id: "orm",
    options: [
      { flag: "--orm drizzle", id: "drizzle" },
      { flag: "--orm prisma", id: "prisma" },
    ],
  },
  {
    group: "product",
    id: "tenancy",
    options: [
      { flag: "--tenancy single", id: "single" },
      { flag: "--tenancy multi", id: "multi" },
    ],
  },
  {
    group: "product",
    id: "auth",
    options: [
      { flag: "--auth better-auth", id: "better-auth" },
      { flag: "--no-auth", id: "none" },
    ],
  },
  {
    group: "product",
    id: "email",
    options: [
      { flag: "--email resend", id: "resend" },
      { flag: "--email plunk", id: "plunk" },
      { flag: "--no-email", id: "none" },
    ],
  },
  {
    group: "product",

    id: "billing",
    options: [
      { flag: "--billing polar", id: "polar" },
      { flag: "--billing stripe", id: "stripe" },
      { flag: "--billing lemonsqueezy", id: "lemonsqueezy" },
      { flag: "--no-billing", id: "none" },
    ],
  },
  {
    group: "product",
    id: "content",
    options: [
      { flag: "--content mdx", id: "mdx" },
      { flag: "--no-content", id: "none" },
    ],
  },
] as const

export const CLI_EXTRAS = [
  { flag: "--with commerce", id: "commerce", module: "commerce", unavailableWhen: { billing: ["none"] } },
  { flag: "--with courses", id: "courses", module: "courses", unavailableWhen: { billing: ["none"] } },
  { flag: "--with page-builder", id: "page-builder", module: "builder" },
  { flag: "--with post-editor", id: "post-editor", module: "editor", unavailableWhen: { content: ["none"] } },
] as const

export const NONE = "none"

export const CLI_MODULES = [
  { choiceId: "auth", id: "auth" },
  { id: "database" },
  { choiceId: "billing", id: "billing" },
  { choiceId: "email", id: "email" },
  { id: "admin" },
  { id: "ui" },
  { id: "i18n" },
  { choiceId: "content", id: "content" },
  { id: "tests" },
  { id: "tooling" },
] as const
