import { Elysia } from "elysia"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { fumadocsSearchGet } from "~/src/integrations/fumadocs/fumadocs.search"

const app = new Elysia({ prefix: "/api" })
  .get("/", () =>
    Response.json({
      bun: process.versions.bun ?? "unavailable",
      node: process.versions.node,
    }),
  )
  .get("/search", ({ request }) => fumadocsSearchGet(request))
  .all("/auth/*", ({ request }) => auth.handler(request))

export type App = typeof app

const handle = app.fetch

export const GET = handle
export const POST = handle
export const PUT = handle
export const PATCH = handle
export const DELETE = handle
export const HEAD = handle
export const OPTIONS = handle
