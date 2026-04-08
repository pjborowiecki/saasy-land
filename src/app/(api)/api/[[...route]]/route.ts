import { Elysia } from "elysia"

import { fumadocsSearch } from "~/src/integrations/fumadocs/fumadocs.search"

const app = new Elysia({ prefix: "/api" })
  .get("/", "Hello from Saasy Land 2.0!")
  .get("/search", ({ request }) => fumadocsSearch.GET(request))

export type App = typeof app

export const GET = app.fetch
export const POST = app.fetch
