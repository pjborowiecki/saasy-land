import { Elysia } from "elysia"

import { auth } from "~/src/integrations/better-auth/auth._server"
import { fumadocsSearch } from "~/src/integrations/fumadocs/fumadocs.search"

const app = new Elysia({ prefix: "/api" })
  .get("/", "Hello from Saasy Land 2.0!")
  .get("/search", ({ request }) => fumadocsSearch.GET(request))
  .all("/auth/*", ({ request }) => auth.handler(request))

export type App = typeof app

const handle = app.fetch

export const GET = handle
export const POST = handle
export const PUT = handle
export const PATCH = handle
export const DELETE = handle
