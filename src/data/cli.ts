/** Shared scaffold choices and flags. Labels are translated; executable flags stay in code. */
export const SCAFFOLD_DIR = "my-app"

export const SCAFFOLD_TARGET = `saasyland@latest init ${SCAFFOLD_DIR}`

/**
 * The four runners: the incantation each uses to execute a package it has not installed, and the
 * one it uses to start the thing that package wrote. Untranslated for the same reason the flags
 * are: `npx` is a program, not a word.
 */
export const PACKAGE_MANAGERS = [
  { dev: "bun dev", exec: "bunx", id: "bun" },
  { dev: "npm run dev", exec: "npx", id: "npm" },
  { dev: "pnpm dev", exec: "pnpm dlx", id: "pnpm" },
  { dev: "yarn dev", exec: "yarn dlx", id: "yarn" },
] as const

/**
 * Four groups, because twelve questions in one column is a form rather than an exhibit. The
 * grouping is the one the answers already have in reality: what it runs on, where the data lives,
 * what the product does, and what gets written on top. Email belongs in the third and not the
 * fourth: the auth flows cannot send a verification link without it.
 */
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
    /**
     * The three shapes a product actually grows through: one deployable, a frontend calling a
     * separate API, and services split by domain behind a gateway.
     */
    id: "architecture",
    options: [
      { flag: "--arch monolith", id: "monolith" },
      { flag: "--arch split", id: "split" },
      { flag: "--arch microservices", id: "microservices" },
    ],
  },
  {
    group: "platform",
    /**
     * Asked before the database, because it constrains it. A visitor who picks the target first
     * never sees an option disappear from under a selection they had already made.
     */
    id: "deployment",
    options: [
      { flag: "--deploy cloudflare", id: "cloudflare" },
      { flag: "--deploy vercel", id: "vercel" },
      { flag: "--deploy self", id: "self" },
    ],
  },
  {
    group: "platform",
    /**
     * Only asked once the API is its own deployable. A monolith has no second server to pick a
     * framework for, so the row is absent rather than disabled: a question that cannot apply is
     * not a question the visitor should have to read past.
     */
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
    /**
     * What executes the server code. Both targets run Node; only one of them runs Bun, so the
     * row shows the pairing being ruled out rather than letting the deploy discover it.
     */
    id: "runtime",
    options: [
      { flag: "--runtime node", id: "node" },
      { flag: "--runtime bun", id: "bun", unavailableWhen: { deployment: ["cloudflare"] } },
    ],
  },
  {
    group: "data",
    /**
     * The engine, not the vendor. Postgres runs on every target; SQLite does not, because on
     * Cloudflare it is D1 and on a box it is a file, and Vercel has neither.
     */
    id: "database",
    options: [
      { flag: "--db sqlite", id: "sqlite", unavailableWhen: { deployment: ["vercel"] } },
      { flag: "--db postgres", id: "postgres" },
    ],
  },
  {
    group: "data",
    /**
     * The vendor, filtered by the engine. Showing Neon under SQLite would be offering something
     * that cannot exist, so providers for the other engine are absent rather than struck through:
     * a menu of six with four crossed out is noise, not information.
     */
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
    /**
     * The one question where the answer is not obvious. Stripe is the processor; Polar and Lemon
     * Squeezy are merchants of record, which means they carry EU VAT and US sales tax for you.
     * That is a business decision a founder makes once and cannot easily undo, so the scaffold
     * should not make it for them.
     */
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

/**
 * The last band, and the only one that is not a question.
 *
 * Everything above chooses between implementations of something the product needs. These are
 * whole features with sample data, and they are independent: a store and a course platform are
 * not two answers to one question, so the row toggles rather than selects. Each writes a module
 * of its own, which is why turning one on visibly lengthens the output beside it.
 *
 * The two that sell something are ruled out when billing is, and the visual post editor is ruled
 * out without content to edit. Same mechanism as the rows above, for the same reason: the scaffold
 * should not accept a combination it cannot write.
 */
export const CLI_EXTRAS = [
  { flag: "--with commerce", id: "commerce", module: "commerce", unavailableWhen: { billing: ["none"] } },
  { flag: "--with courses", id: "courses", module: "courses", unavailableWhen: { billing: ["none"] } },
  { flag: "--with page-builder", id: "page-builder", module: "builder" },
  { flag: "--with post-editor", id: "post-editor", module: "editor", unavailableWhen: { content: ["none"] } },
] as const

/** The option every question offers for leaving a capability out, and the one that writes nothing. */
export const NONE = "none"

/**
 * The modules the scaffold writes, in the order the manifest lists them, and the question each one
 * depends on.
 *
 * Same names as "What is in the box", because a visitor who scrolls from here to there must find
 * the same things. The ones that carry a `choiceId` are written only when that question was
 * answered with something other than `none`, which is what lets the run beside the matrix be the
 * matrix's actual output rather than an illustration of it.
 *
 * Deliberately untranslated, for the same reason the flags are: these are directory names printed
 * by a program, and a localised `uwierzytelnianie` would be a directory nobody has.
 */
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
